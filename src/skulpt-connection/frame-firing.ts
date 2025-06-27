const N_INTERVAL_SAMPLES = 20;

/** Mechanism for attempting to drive the project at a particular frame
 * rate, while coping with the fact that the opportunities we get to
 * advance the project by one frame do not necessarily come along at
 * regular intervals, or, if they do, not necessarily at the desired
 * frame rate.
 *
 * We keep track of the next `targetTime` we want to fire a project
 * frame.  If an opportunity is after the target time, we are late, so
 * definitely fire.  Otherwise, we have the opportunity to fire early,
 * so have to decide between firing now vs postponing until at least the
 * next opportunity.  We compute the "cost" of firing now (squared
 * difference of target time from now).  Then estimate the expected cost
 * (in the same sense) of firing at the next opportunity based on a
 * recent history of inter-opportunity intervals.  We fire now if that
 * has a lower cost.
 *
 * If we do fire now, we update the `targetTime` by at least
 * `targetFireInterval`, and also by at least the smallest multiple of
 * `targetFireInterval` which makes the new `targetTime` be in the
 * future.
 *
 * To boot, we say "yes" to the first opportunity we get to fire.
 *
 * Usage is along the lines of:
 *
 * ```
 * // Set up:
 * const ffa = new FrameFiringArbiter(60);
 *
 * // When an opportunity to fire arises:
 * const shouldFire = ffa.updateAndMakeFireDecision(now);
 * ```
 * */
export class FrameFiringArbiter {
  intervalSamples: Array<number>;
  samplesHead: number;
  nSamples: number;

  targetTime: number;
  targetFireInterval: number;
  prevOpportunityTime: number | null;

  constructor(targetFps: number) {
    this.intervalSamples = new Array<number>(N_INTERVAL_SAMPLES);
    this.intervalSamples.fill(0.0);
    this.samplesHead = 0;
    this.nSamples = 0;

    this.targetTime = 0.0;
    this.targetFireInterval = 1000.0 / targetFps;
    this.prevOpportunityTime = null;
  }

  acceptOpportunityTime(nowTime: number) {
    if (this.prevOpportunityTime == null) {
      return;
    }

    const intervalSample = nowTime - this.prevOpportunityTime;
    this.intervalSamples[this.samplesHead] = intervalSample;

    this.samplesHead += 1;
    if (this.samplesHead === N_INTERVAL_SAMPLES) {
      this.samplesHead = 0;
    }

    if (this.nSamples !== N_INTERVAL_SAMPLES) {
      this.nSamples += 1;
    }
  }

  preferFireNow(nowTime: number) {
    if (this.nSamples === 0) {
      return true;
    }

    if (nowTime > this.targetTime) {
      return true;
    }

    const preCostNow = this.targetTime - nowTime;
    const costNow = preCostNow * preCostNow;

    let expectedCostWait = 0.0;
    for (let i = 0; i < this.nSamples; ++i) {
      const sampleTime = nowTime + this.intervalSamples[i];
      const preCostSample = this.targetTime - sampleTime;
      const costSample = preCostSample * preCostSample;
      expectedCostWait += costSample;
    }
    expectedCostWait /= this.nSamples;

    return costNow < expectedCostWait;
  }

  updateAndMakeFireDecision(nowTime: number) {
    this.acceptOpportunityTime(nowTime);
    this.prevOpportunityTime = nowTime;

    const fireNow = this.preferFireNow(nowTime);
    if (fireNow) {
      // Always advance target time at least one target-fire-interval;
      // more if we've fallen behind and need to skip some.
      const nFrames = Math.max(
        1,
        1 + Math.floor((nowTime - this.targetTime) / this.targetFireInterval)
      );

      this.targetTime += nFrames * this.targetFireInterval;
    }

    return fireNow;
  }
}

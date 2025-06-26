const N_INTERVAL_SAMPLES = 20;

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
}

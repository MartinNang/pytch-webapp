import { assert } from "chai";
import { FrameFiringArbiter } from "../src/skulpt-connection/frame-firing";

const nTrialFrames = 2000;
const expectedFps = 60;

describe("Frame firing scheduler", () => {
  [29, 30, 31, 44, 45, 46, 59, 60, 61, 72, 90, 118, 120, 144].forEach(
    (systemFps) =>
      it(`fires close to 60fps if possible (sys-fps ${systemFps})`, () => {
        let fft = new FrameFiringArbiter(60);
        const systemIntervalMs = 1000.0 / systemFps;
        const systemIntervalSeconds = systemIntervalMs * 1e-3;

        let now = 12345.0;
        let nFramesFired = 0;
        for (let i = 0; i < nTrialFrames; ++i) {
          now += systemIntervalMs;
          const fireNow = fft.updateAndMakeFireDecision(now);
          if (fireNow) {
            nFramesFired += 1;
          }
        }

        // We can't fire more often than every opportunity, so clamp
        // above at the number of trial frames.
        const expNFramesFired = Math.round(
          Math.min(
            nTrialFrames,
            expectedFps * nTrialFrames * systemIntervalSeconds
          )
        );

        assert.approximately(nFramesFired, expNFramesFired, 1.0);
      })
  );
});

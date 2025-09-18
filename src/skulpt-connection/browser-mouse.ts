import {
  stageHalfWidth,
  stageHalfHeight,
  stageWidth,
  stageHeight,
} from "../constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let Sk: any;

// Snake-case fields to match what Pytch expects.
interface IStageCoords {
  stage_x: number;
  stage_y: number;
}

function clamp(x: number, xmin: number, xmax: number) {
  if (x < xmin) return xmin;
  if (x < xmax) return x;
  return xmax;
}

export class BrowserMouse {
  canvasOverlayDiv: HTMLDivElement;
  undrainedClicks: Array<IStageCoords>;
  clientX: number;
  clientY: number;
  button_is_down: boolean;
  cached_stage_x: number | null;
  cached_stage_y: number | null;

  constructor(canvas: HTMLDivElement) {
    this.undrainedClicks = [];
    this.clientX = 0.0;
    this.clientY = 0.0;
    this.button_is_down = false;
    this.cached_stage_x = null;
    this.cached_stage_y = null;

    this.canvasOverlayDiv = canvas;

    this.canvasOverlayDiv.onmousemove = (evt) => this.onMouseMove(evt);
    this.canvasOverlayDiv.onpointerdown = () => this.onMouseDown();
    this.canvasOverlayDiv.onpointerup = () => this.onMouseUp();

    Sk.pytch.mouse = this;
  }

  onMouseMove(evt: MouseEvent) {
    // Track this continuously to allow ability for Pytch programs
    // to query mouse position (at some point in the future).
    this.clientX = evt.clientX;
    this.clientY = evt.clientY;
    this.cached_stage_x = null;
    this.cached_stage_y = null;
  }

  get stage_x() {
    if (this.cached_stage_x == null) {
      const canvasDiv = this.canvasOverlayDiv;
      const eltRect = canvasDiv.getBoundingClientRect();
      const canvasX0 = eltRect.left + canvasDiv.clientLeft;
      const canvasX = this.clientX - canvasX0;
      const scaledCanvasX = (canvasX / canvasDiv.clientWidth) * stageWidth;
      const rawStageX = scaledCanvasX - stageHalfWidth;
      const stageX = clamp(rawStageX, -stageHalfWidth, stageHalfWidth);
      this.cached_stage_x = stageX;
    }
    return this.cached_stage_x;
  }

  get stage_y() {
    if (this.cached_stage_y == null) {
      const canvasDiv = this.canvasOverlayDiv;
      const eltRect = canvasDiv.getBoundingClientRect();
      const canvasY0 = eltRect.top + canvasDiv.clientTop;
      const canvasY = this.clientY - canvasY0;
      const scaledCanvasY = (canvasY / canvasDiv.clientHeight) * stageHeight;
      const rawStageY = stageHalfHeight - scaledCanvasY;
      const stageY = clamp(rawStageY, -stageHalfHeight, stageHalfHeight);
      this.cached_stage_y = stageY;
    }
    return this.cached_stage_y;
  }

  currentStageCoords(): IStageCoords {
    return { stage_x: this.stage_x, stage_y: this.stage_y };
  }

  onMouseDown() {
    this.button_is_down = true;
    this.undrainedClicks.push(this.currentStageCoords());
  }

  onMouseUp() {
    this.button_is_down = false;
  }

  deactivate() {
    // TODO: Should there be an API-point for doing this?
    Sk.pytch.mouse = Sk.default_pytch_environment.mouse;
  }

  // Snake-case to match what Pytch expects.
  drain_new_click_events() {
    const evts = this.undrainedClicks;
    this.undrainedClicks = [];
    return evts;
  }
}

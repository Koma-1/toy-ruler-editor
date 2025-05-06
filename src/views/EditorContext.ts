import { EditorInteractionContoroller } from "../controller/EditorInteractionController";

export class EditorContext {
    private zoom: number = 1.0;
    private canvasWidth: number = 640;
    private canvasHeight: number = 480;
    private canvasMarginTop: number = 400;
    private canvasMarginRight: number = 400;
    private canvasMarginBottom: number = 400;
    private canvasMarginLeft: number = 400;
    public controller: EditorInteractionContoroller = new EditorInteractionContoroller(() => {this.requestRender();});
    private renderCallback: () => void = () => {};

    constructor() {}

    setRenderCallback(callback: () => void) {
        this.renderCallback = callback;
    }

    requestRender() {
        this.renderCallback();
    }

    getZoom() {
        return this.zoom;
    }

    setZoom(zoom: number) {
        this.zoom = zoom;
    }

    resetZoom() {
        this.setZoom(1.0);
    }

    getCanvasMargins(): {top: number, right: number, bottom: number, left: number} {
        return {
            top: this.canvasMarginTop,
            right: this.canvasMarginRight,
            bottom: this.canvasMarginBottom,
            left: this.canvasMarginLeft};
    }

    getCanvasWidth(): number {
        return this.canvasWidth;
    }

    getCanvasHeight(): number {
        return this.canvasHeight;
    }

    setCanvasSize(width: number, height: number) {
        this.canvasWidth = width;
        this.canvasHeight = height;
    }

    getSvgWidth(): number {
        return (this.canvasMarginLeft + this.canvasWidth + this.canvasMarginRight) * this.zoom;
    }

    getSvgHeight(): number {
        return (this.canvasMarginTop + this.canvasHeight + this.canvasMarginBottom) * this.zoom;
    }

}
import { InteractionEvent } from "../controller/events";
import { EditorPlane } from "../core/EditorPlane";

export class EditorContext {
    private zoom: number = 1.0;
    private canvasMarginTop: number = 400;
    private canvasMarginRight: number = 400;
    private canvasMarginBottom: number = 400;
    private canvasMarginLeft: number = 400;
    private renderCallback: () => void = () => {};
    private pushEventCallback: (e: InteractionEvent) => void = () => {};
    readonly pointPicker = {
        enabled: false,
        enable: () => {
            console.log("ctx.pointPicker.enable");
            this.pointPicker.enabled = true;
            this.requestRender();
        },
        disable: () => {
            console.log("ctx.pointPicker.disable");
            this.pointPicker.enabled = false;
            this.requestRender();
        },
        isSnap: true,
        toggleSnap: () => {
            console.log("ctx.pointPicker.toggleSnap -> ", !this.pointPicker.isSnap);
            this.pointPicker.isSnap = !this.pointPicker.isSnap;
            this.requestRender();
        },
    }

    constructor(private model: EditorPlane) {}

    setRenderCallback(callback: () => void) {
        this.renderCallback = callback;
    }

    requestRender() {
        this.renderCallback();
    }

    setPushEventCallback(callback: (e: InteractionEvent) => void) {
        this.pushEventCallback = callback;
    }

    pushEvent(e: InteractionEvent) {
        this.pushEventCallback(e);
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
        return this.model.getWidth();
    }

    getCanvasHeight(): number {
        return this.model.getHeight();
    }

    getSvgWidth(): number {
        return (this.canvasMarginLeft + this.getCanvasWidth() + this.canvasMarginRight) * this.zoom;
    }

    getSvgHeight(): number {
        return (this.canvasMarginTop + this.getCanvasHeight() + this.canvasMarginBottom) * this.zoom;
    }
}
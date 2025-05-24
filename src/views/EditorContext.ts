import { InteractionEvent } from "../controller/events";
import { EditorPlane } from "../core/EditorPlane";

export class EditorContext {
    private zoom: number = 1.0;
    private canvasMarginTop: number = 400;
    private canvasMarginRight: number = 400;
    private canvasMarginBottom: number = 400;
    private canvasMarginLeft: number = 400;
    private renderCallback: (option?: string) => void = () => {};
    private pushEventCallback: (e: InteractionEvent) => void = () => {};
    private getSelectedIdsCallback: () => string[] = () => {return []};
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
    readonly selectElement = {
        enabled: true,
        enable: () => {
            console.log("ctx.selectElement.enable");
            this.selectElement.enabled = true;
            this.requestRender();
        },
        disable: () => {
            console.log("ctx.selectElement.disable");
            this.selectElement.enabled = false;
            this.requestRender();
        },
    }

    constructor(private model: EditorPlane) {}

    setRenderCallback(callback: (option?: string) => void) {
        this.renderCallback = callback;
    }

    requestRender(option?: string) {
        this.renderCallback(option);
    }

    setPushEventCallback(callback: (e: InteractionEvent) => void) {
        this.pushEventCallback = callback;
    }

    pushEvent(e: InteractionEvent) {
        this.pushEventCallback(e);
    }

    setSelectedIdsCallback(callback: () => string[]) {
        this.getSelectedIdsCallback = callback;
    }

    getSelectedIds(): string[] {
        return this.getSelectedIdsCallback();
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
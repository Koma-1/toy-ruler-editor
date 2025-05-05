import { ChainedRuler } from "../core/ChainedRuler";
import { EditorPlane } from "../core/EditorPlane";
import { NS, clientPointToSvgPoint } from "../util/util";
import { EditorContext } from "./EditorContext";
import { ControlRulerLineView } from "./RulerLineView";

export class RulerAreaView {
    private hSvgRoot: SVGSVGElement;
    private vSvgRoot: SVGSVGElement;
    private hDrawingPlane: SVGGElement;
    private vDrawingPlane: SVGGElement;

    private draggingRuler: ChainedRuler | null = null;
    private dragStartPoint: DOMPoint | null = null;

    private animationFrameId: number | null = null;

    constructor(
        private hContainer: HTMLDivElement,
        private vContainer: HTMLDivElement,
        private model: EditorPlane,
        private context: EditorContext,
        private requestRenderCallback: () => void,
    ) {
        this.hSvgRoot = document.createElementNS(NS, "svg");
        this.vSvgRoot = document.createElementNS(NS, "svg");
        this.hContainer.appendChild(this.hSvgRoot);
        this.vContainer.appendChild(this.vSvgRoot);
        this.hDrawingPlane = document.createElementNS(NS, "g");
        this.vDrawingPlane = document.createElementNS(NS, "g");
        this.hSvgRoot.appendChild(this.hDrawingPlane);
        this.vSvgRoot.appendChild(this.vDrawingPlane);

        this.attachEventListeners();
    }

    setRulerAreaSize(editorPlaneWidth: number, editorPlaneHeight: number, rulerAreaWidth: number) {
        this.hContainer.style.width = String(rulerAreaWidth);
        this.hContainer.style.height = String(editorPlaneHeight);
        this.vContainer.style.width = String(editorPlaneWidth);
        this.vContainer.style.height = String(rulerAreaWidth);
    }

    private attachEventListeners(): void {
        this.vContainer.addEventListener("mousemove", (e) => {this.onMouseMove(e);});
        this.hContainer.addEventListener("mousemove", (e) => {this.onMouseMove(e);});

        this.vContainer.addEventListener("mouseup", (e) => {this.onMouseUp(e);});
        this.hContainer.addEventListener("mouseup", (e) => {this.onMouseUp(e);});
    }

    private handleStartDrag(model: ChainedRuler, e: MouseEvent): void {
        e.preventDefault();
        this.draggingRuler = model;
        switch (model.direction) {
            case "horizontal":
                this.dragStartPoint = clientPointToSvgPoint(this.hDrawingPlane, e.clientX, e.clientY);
                break;
            case "vertical":
                this.dragStartPoint = clientPointToSvgPoint(this.vDrawingPlane, e.clientX, e.clientY);
                break;
            default:
                break;
        }
    }

    private onMouseMove(e: MouseEvent) {
        if (!this.draggingRuler) {
            return;
        }
        const svgPt = clientPointToSvgPoint(this.draggingRuler.direction === "horizontal" ? this.hDrawingPlane : this.vDrawingPlane, e.clientX, e.clientY);

        const delta = this.draggingRuler.direction === "horizontal" ?
        svgPt.y - this.dragStartPoint!.y : svgPt.x - this.dragStartPoint!.x;

        this.draggingRuler.applyPreviewOffset(delta);
        this.requestRender();
    }

    private onMouseUp(e: MouseEvent) {
        if (!this.draggingRuler) {
            return;
        }
        this.draggingRuler.commitPreview();
        this.draggingRuler = null;
        this.cancelRenderLoop();
        this.requestRenderCallback();
    }

    render() {
        this.vSvgRoot.setAttribute("width", String(this.context.getSvgWidth() + 100));
        this.vSvgRoot.setAttribute("height", String(this.vContainer.clientHeight));
        this.hSvgRoot.setAttribute("width", String(this.hContainer.clientWidth));
        this.hSvgRoot.setAttribute("height", String(this.context.getSvgWidth() + 100));
        this.hDrawingPlane.style.transformOrigin = "top left";
        this.vDrawingPlane.style.transformOrigin = "top left";
        this.hDrawingPlane.style.transform = `scale(1.0, ${String(this.context.getZoom())})`;
        this.vDrawingPlane.style.transform = `scale(${String(this.context.getZoom())}, 1.0)`;
        while (this.hDrawingPlane.firstChild) {
            this.hDrawingPlane.removeChild(this.hDrawingPlane.firstChild);
        }
        while (this.vDrawingPlane.firstChild) {
            this.vDrawingPlane.removeChild(this.vDrawingPlane.firstChild);
        }
        for (const ruler of this.model.getAllRulers()) {
            if (ruler.direction == "horizontal") {
                const view = new ControlRulerLineView(ruler, this.context, this.hDrawingPlane);
                view.setZoom(this.context.getZoom());
                view.onStartDrag((model, e) => this.handleStartDrag(model, e));
                view.render();
            } else if (ruler.direction == "vertical") {
                const view = new ControlRulerLineView(ruler, this.context, this.vDrawingPlane);
                view.setZoom(this.context.getZoom());
                view.onStartDrag((model, e) => this.handleStartDrag(model, e));
                view.render();
            }
        }
    }

    private requestRender(): void {
        if (this.animationFrameId !== null) {
            return;
        }
        this.animationFrameId = requestAnimationFrame(() => {
            this.animationFrameId = null;
            this.requestRenderCallback();
        });
    }

    private cancelRenderLoop(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}
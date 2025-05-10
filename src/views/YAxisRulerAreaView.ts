import { ChainedRuler } from "../core/ChainedRuler";
import { EditorPlane } from "../core/EditorPlane";
import { NS, clientPointToSvgPoint } from "../util/util";
import { EditorContext } from "./EditorContext";
import { ControlRulerLineView } from "./ControlRulerLineView";

export class YAxisRulerAreaView {
    private svgRoot: SVGSVGElement;
    private drawingPlane: SVGGElement;

    private draggingRuler: ChainedRuler | null = null;
    private dragStartPoint: DOMPoint | null = null;

    private animationFrameId: number | null = null;

    constructor(
        private container: HTMLDivElement,
        private model: EditorPlane,
        private context: EditorContext,
    ) {
        this.svgRoot = document.createElementNS(NS, "svg");
        this.container.appendChild(this.svgRoot);
        this.drawingPlane = document.createElementNS(NS, "g");
        this.svgRoot.appendChild(this.drawingPlane);

        this.attachEventListeners();
    }

    static createAndAttach(parent: HTMLDivElement, model: EditorPlane, context: EditorContext): YAxisRulerAreaView {
        const container = document.createElement("div");
        container.setAttribute("id", "yAxisRulerAreaContainer");
        container.style.display = "inline-block";
        container.style.overflow = "hidden";
        parent.appendChild(container);
        return new YAxisRulerAreaView(container, model, context);
    }

    setRulerAreaSize(editorPlaneWidth: number, editorPlaneHeight: number, rulerAreaWidth: number) {
        this.container.style.width = String(rulerAreaWidth);
        this.container.style.height = String(editorPlaneHeight);
    }

    private attachEventListeners(): void {
        this.container.addEventListener("mousemove", (e) => {this.onMouseMove(e);});
        this.container.addEventListener("mouseup", (e) => {this.onMouseUp(e);});
    }

    private handleStartDrag(model: ChainedRuler, e: MouseEvent): void {
        e.preventDefault();
        this.draggingRuler = model;
        this.dragStartPoint = clientPointToSvgPoint(this.drawingPlane, e.clientX, e.clientY);
    }

    private onMouseMove(e: MouseEvent) {
        if (!this.draggingRuler) {
            return;
        }
        const svgPt = clientPointToSvgPoint(this.drawingPlane, e.clientX, e.clientY);

        const delta = svgPt.y - this.dragStartPoint!.y;

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
        this.context.requestRender();
    }

    render() {
        this.svgRoot.setAttribute("width", String(this.container.clientWidth));
        this.svgRoot.setAttribute("height", String(this.context.getSvgWidth() + 100));
        this.drawingPlane.style.transformOrigin = "top left";
        this.drawingPlane.style.transform = `scale(1.0, ${String(this.context.getZoom())})`;
        while (this.drawingPlane.firstChild) {
            this.drawingPlane.removeChild(this.drawingPlane.firstChild);
        }
        for (const ruler of this.model.getAllRulers().filter((ruler) => {return ruler.direction === "horizontal";})) {
            const view = new ControlRulerLineView(ruler, this.context, this.drawingPlane);
            view.setZoom(this.context.getZoom());
            view.onStartDrag((model, e) => this.handleStartDrag(model, e));
            view.render();
        }
    }

    setScroll(top: number): void {
        this.container.scrollTop = top;
    }

    private requestRender(): void {
        if (this.animationFrameId !== null) {
            return;
        }
        this.animationFrameId = requestAnimationFrame(() => {
            this.animationFrameId = null;
            this.context.requestRender();
        });
    }

    private cancelRenderLoop(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}
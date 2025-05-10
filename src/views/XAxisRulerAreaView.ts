import { ChainedRuler } from "../core/ChainedRuler";
import { EditorPlane } from "../core/EditorPlane";
import { NS, clientPointToSvgPoint } from "../util/util";
import { EditorContext } from "./EditorContext";
import { ControlRulerLineView } from "./ControlRulerLineView";

export class XAxisRulerAreaView {
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

    static createAndAttach(parent: HTMLDivElement, model: EditorPlane, context: EditorContext): XAxisRulerAreaView {
        const container = document.createElement("div");
        container.setAttribute("id", "xAxisRulerAreaContainer");
        container.style.display = "inline-block";
        container.style.overflow = "hidden";
        parent.appendChild(container);
        return new XAxisRulerAreaView(container, model, context);
    }

    setRulerAreaSize(editorPlaneWidth: number, editorPlaneHeight: number, rulerAreaWidth: number) {
        this.container.style.width = String(editorPlaneWidth);
        this.container.style.height = String(rulerAreaWidth);
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

        const delta = svgPt.x - this.dragStartPoint!.x;

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
        this.svgRoot.setAttribute("width", String(this.context.getSvgWidth() + 100));
        this.svgRoot.setAttribute("height", String(this.container.clientHeight));
        this.drawingPlane.style.transformOrigin = "top left";
        this.drawingPlane.style.transform = `scale(${String(this.context.getZoom())}, 1.0)`;
        while (this.drawingPlane.firstChild) {
            this.drawingPlane.removeChild(this.drawingPlane.firstChild);
        }
        for (const ruler of this.model.getAllRulers().filter((ruler) => {return ruler.direction === "vertical";})) {
            const view = new ControlRulerLineView(ruler, this.context, this.drawingPlane);
            view.setZoom(this.context.getZoom());
            view.onStartDrag((model, e) => this.handleStartDrag(model, e));
            view.render();
        }
    }

    setScroll(left: number): void {
        this.container.scrollLeft = left;
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
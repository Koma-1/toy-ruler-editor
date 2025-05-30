import { InteractionEvent } from "../controller/events";
import { EditorPlane } from "../core/EditorPlane";
import { NS } from "../util/util";
import { EditorContext } from "./EditorContext";
import { PointPickerView } from "./PointPickerView";
import { RectElementView } from "./RectElementView";
import { DisplayRulerLineView } from "./DisplayRulerLineView";
import { RectSelectionOverlayView } from "./RectSelectionOverlayView";

export class EditorPlaneView {
    private svgRoot: SVGSVGElement;
    private drawingGroup: SVGGElement;
    private backgroundPlane: SVGGElement;
    private contentPlane: SVGGElement;
    private rulerPlane: SVGGElement;
    private intersectionPlane: SVGGElement;
    private overlayPlane: SVGGElement;
    private onScroll?: (left: number, top: number) => void;
    constructor(
        private container: HTMLDivElement,
        private model: EditorPlane,
        private context: EditorContext,
    ) {
        this.svgRoot = document.createElementNS(NS, "svg");
        this.container.appendChild(this.svgRoot);
        this.drawingGroup = document.createElementNS(NS, "g");
        this.svgRoot.appendChild(this.drawingGroup);
        this.backgroundPlane = document.createElementNS(NS, "g");
        this.contentPlane = document.createElementNS(NS, "g");
        this.rulerPlane = document.createElementNS(NS, "g");
        this.intersectionPlane = document.createElementNS(NS, "g");
        this.overlayPlane = document.createElementNS(NS, "g");
        this.drawingGroup.appendChild(this.backgroundPlane);
        this.drawingGroup.appendChild(this.contentPlane);
        this.drawingGroup.appendChild(this.rulerPlane);
        this.drawingGroup.appendChild(this.intersectionPlane);
        this.drawingGroup.appendChild(this.overlayPlane);
        this.container.addEventListener("scroll", () => {
            this.onScroll?.(this.container.scrollLeft, this.container.scrollTop);
        });
    }

    setScrollListener(listener: (left: number, top: number) => void): void {
        this.onScroll = listener;
    }

    static createAndAttach(parent: HTMLDivElement, model: EditorPlane, context: EditorContext): EditorPlaneView {
        const container = document.createElement("div");
        container.id = "editorPlaneContainer";
        container.style.overflow = "scroll";
        container.style.display = "inline-block";
        parent.appendChild(container);
        return new EditorPlaneView(container, model, context);
    }

    setScreenSize(width: number, height: number) {
        this.container.style.width = String(width);
        this.container.style.height = String(height);
    }

    render() {
        this.svgRoot.setAttribute("width", String(this.context.getSvgWidth()));
        this.svgRoot.setAttribute("height", String(this.context.getSvgHeight()));
        this.drawingGroup.style.transformOrigin = "top left";
        this.drawingGroup.style.transform = `scale(${String(this.context.getZoom())})`;

        while (this.backgroundPlane.firstChild) {
            this.backgroundPlane.removeChild(this.backgroundPlane.firstChild);
        }
        while (this.contentPlane.firstChild) {
            this.contentPlane.removeChild(this.contentPlane.firstChild);
        }
        while (this.rulerPlane.firstChild) {
            this.rulerPlane.removeChild(this.rulerPlane.firstChild);
        }
        while (this.overlayPlane.firstChild) {
            this.overlayPlane.removeChild(this.overlayPlane.firstChild);
        }

        this.contentPlane.style.transformOrigin = "top left";
        this.contentPlane.style.transform = `translate(${this.context.getCanvasMargins().left}px, ${this.context.getCanvasMargins().top}px)`;

        this.overlayPlane.style.transformOrigin = "top left";
        this.overlayPlane.style.transform = `translate(${this.context.getCanvasMargins().left}px, ${this.context.getCanvasMargins().top}px)`;

        this.addBackground(this.backgroundPlane);

        for (const element of this.model.getElements()) {
            const view = new RectElementView(this.contentPlane, element, this.context);
            view.render();
        }

        for (const id of this.context.getSelectedIds()) {
            console.log(id);
            const rect = this.model.getElement(id);
            if (!rect) {
                console.log("not exists");
                break;
            }
            const view = new RectSelectionOverlayView(this.overlayPlane, rect, this.context);
            view.render();
        }

        for (const ruler of this.model.getAllRulers()) {
            const view = new DisplayRulerLineView(ruler, this.context, this.rulerPlane);
            view.setZoom(this.context.getZoom());
            view.render();
        }

        do {
            const view = new PointPickerView(this.intersectionPlane, this.model, this.context);
            view.render();
        } while (0);
    }

    private addBackground(root: SVGGElement) {
        const m = this.context.getCanvasMargins();
        const cw = this.context.getCanvasWidth();
        const ch = this.context.getCanvasHeight();
        const w = m.left + cw + m.right;
        const h = m.top + ch + m.bottom;

        const bg1 = document.createElementNS(NS, "rect");
        bg1.setAttribute("x", "0");
        bg1.setAttribute("y", "0");
        bg1.setAttribute("width", String(w));
        bg1.setAttribute("height", String(h));
        bg1.setAttribute("fill", "darkgray");
        const bg2 = document.createElementNS(NS, "rect");
        bg2.setAttribute("x", String(m.left));
        bg2.setAttribute("y", String(m.left));
        bg2.setAttribute("width", String(cw));
        bg2.setAttribute("height", String(ch));
        bg2.setAttribute("fill", "white");
        root.appendChild(bg1);
        root.appendChild(bg2);
    }
}

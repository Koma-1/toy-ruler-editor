import { EditorPlane } from "../core/EditorPlane";
import { NS } from "../util/util";
import { EditorContext } from "./EditorContext";
import { RectElementView } from "./RectElementView";
import { DisplayRulerLineView } from "./RulerLineView";

export class EditorPlaneView {
    private svgRoot: SVGSVGElement;
    private drawingGroup: SVGGElement;
    private backgroundPlane: SVGGElement;
    private contentPlane: SVGGElement;
    private rulerPlane: SVGGElement;
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
        this.drawingGroup.appendChild(this.backgroundPlane);
        this.drawingGroup.appendChild(this.contentPlane);
        this.drawingGroup.appendChild(this.rulerPlane);
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

        this.contentPlane.style.transformOrigin = "top left";
        this.contentPlane.style.transform = `translate(${this.context.getCanvasMargins().left}px, ${this.context.getCanvasMargins().top}px)`;

        this.addBackground(this.backgroundPlane);

        for (const element of this.model.getElements()) {
            const view = new RectElementView(element, this.contentPlane);
            view.render();
        }

        for (const ruler of this.model.getAllRulers()) {
            const view = new DisplayRulerLineView(ruler, this.context, this.rulerPlane);
            view.setZoom(this.context.getZoom());
            view.render();
        }
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

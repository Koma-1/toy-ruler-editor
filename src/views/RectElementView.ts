import { RectElement } from "../core/Rect";
import { NS } from "../util/util";

export class RectElementView {
    private dom : SVGRectElement | null = null;
    constructor(
        private model: RectElement,
        private root: SVGElement,
    ) {}

    render() {
        if (!this.dom) {
            this.dom = document.createElementNS(NS, "rect");
            this.root.appendChild(this.dom);
        }
        const { x, y, width, height } = this.model.getBBox();
        this.dom.setAttribute("x", String(x));
        this.dom.setAttribute("y", String(y));
        this.dom.setAttribute("width", String(width));
        this.dom.setAttribute("height", String(height));
        this.dom.setAttribute("fill", "lightgray");
    }
}
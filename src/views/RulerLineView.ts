import { Ruler } from "../core/Ruler";
import { NS } from "../util/util";

export class RulerLineView {
    private dom: SVGLineElement | null = null;
    constructor(
        private ruler: Ruler,
        private root: SVGElement
    ) { }

    render(): void {
        const pos = this.ruler.getPosition();
        if (!this.dom) {
            this.dom = document.createElementNS(NS, "line");
            this.root.appendChild(this.dom);
        }

        if (this.ruler.direction === 'horizontal') {
            this.dom.setAttribute("x1", "0");
            this.dom.setAttribute("y1", String(pos));
            this.dom.setAttribute("x2", String(this.root.clientWidth));
            this.dom.setAttribute("y2", String(pos));
            this.dom.setAttribute("stroke", "#00FF00");
        } else {
            this.dom.setAttribute("x1", String(pos));
            this.dom.setAttribute("y1", "0");
            this.dom.setAttribute("x2", String(pos));
            this.dom.setAttribute("y2", String(this.root.clientHeight));
            this.dom.setAttribute("stroke", "#FF0000");
        }

        this.dom.setAttribute("stroke-width", "1px");
    }
}
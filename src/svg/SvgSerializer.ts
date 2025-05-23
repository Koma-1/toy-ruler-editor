import { EditorPlane } from "../core/EditorPlane";
import { NS } from "../util/util";

export class SvgSerializer {
    constructor (private model: EditorPlane) {
    }

    serialize(): string {
        const svg: SVGSVGElement = document.createElementNS(NS, "svg");
        if (this.model.getWidth()) {
            svg.setAttribute("width", String(this.model.getWidth()));
        }
        if (this.model.getHeight()) {
            svg.setAttribute("height", String(this.model.getHeight()));
        }
        for (const elem of this.model.getElements()) {
            const { x, y, width, height } = elem.getBBox();
            const dom = document.createElementNS(NS, "rect");
            dom.setAttribute("x", String(x));
            dom.setAttribute("y", String(y));
            dom.setAttribute("width", String(width));
            dom.setAttribute("height", String(height));
            const fill = elem.graphicsAttributes.get("fill");
            if (fill === undefined) {
                dom.setAttribute("fill", "lightgray");
            } else {
                dom.setAttribute("fill", fill);
            }
            svg.appendChild(dom);
        }
        return new XMLSerializer().serializeToString(svg);
    }
}
import { RectElement } from "../core/Rect";
import { NS } from "../util/util";
import { InteractionEvent } from "../controller/events";
import { EditorContext } from "./EditorContext";

export class RectElementView {
    private dom : SVGRectElement | null = null;
    private abortController = new AbortController();
    constructor(
        private root: SVGElement,
        private model: RectElement,
        private context: EditorContext,
    ) {}

    render() {
        this.dom = document.createElementNS(NS, "rect");
        this.root.appendChild(this.dom);

        if (this.context.selectElement.enabled) {
            this.dom.addEventListener("click", (e) => {
                this.context.pushEvent({type: "graphicsElementSelected", id: this.model.id});
            }, {signal: this.abortController.signal});
        } else {
            this.abortController.abort();
        }

        const { x, y, width, height } = this.model.getBBox();
        this.dom.setAttribute("x", String(x));
        this.dom.setAttribute("y", String(y));
        this.dom.setAttribute("width", String(width));
        this.dom.setAttribute("height", String(height));
        this.dom.setAttribute("fill", "lightgray");
    }
}
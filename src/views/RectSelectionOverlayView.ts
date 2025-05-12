import { RectElement } from "../core/Rect";
import { EditorContext } from "./EditorContext";

export class RectSelectionOverlayView {
    private strokeWidth = 3;
    constructor(
        private container: SVGElement,
        private model: RectElement,
        private context: EditorContext,
    ) {}

    render() {
        const selectionBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        selectionBox.setAttribute("stroke", "blue");
        selectionBox.setAttribute("stroke-width", String(this.strokeWidth / this.context.getZoom()));
        selectionBox.setAttribute("fill", "none");
        selectionBox.setAttribute("stroke-dasharray", `${10 / this.context.getZoom()} ${5 / this.context.getZoom()}`);
        const {x, y, width, height} = this.model.getBBox();
        selectionBox.setAttribute("x", String(x));
        selectionBox.setAttribute("y", String(y));
        selectionBox.setAttribute("width", String(width));
        selectionBox.setAttribute("height", String(height));
        this.container.appendChild(selectionBox);
    }
}
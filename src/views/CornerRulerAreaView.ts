import { EditorPlane } from "../core/EditorPlane";
import { NS } from "../util/util";
import { EditorContext } from "./EditorContext";

export class CornerRulerAreaView {
    private svgRoot: SVGSVGElement;
    constructor(
        private container: HTMLDivElement,
        private model: EditorPlane,
        private context: EditorContext,
    ) {
        this.svgRoot = document.createElementNS(NS, "svg");
        this.container.appendChild(this.svgRoot);
    }

    static createAndAttach(parent: HTMLDivElement, model: EditorPlane, context: EditorContext): CornerRulerAreaView {
        const container = document.createElement("div");
        container.setAttribute("id", "cornersRulerAreaContainer");
        container.style.display = "inline-block";
        container.style.overflow = "hidden";
        parent.appendChild(container);
        return new CornerRulerAreaView(container, model, context);
    }

    setScreenSize(width: number, height: number) {
        this.container.style.width = String(width);
        this.container.style.height = String(height);
    }
    setEditorPlaneSize(width: number, height: number) {
        this.svgRoot.setAttribute("width", String(width));
        this.svgRoot.setAttribute("height", String(height));
    }
    setScroll(scrollY: number) {}
    setZoom(scale: number) {}
    render() {}
}
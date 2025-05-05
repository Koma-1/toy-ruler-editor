import { EditorPlane } from "../core/EditorPlane";
import { NS } from "../util/util";

export class CornerRulerAreaView {
    private svgRoot: SVGSVGElement;
    constructor(
        private container: HTMLDivElement,
        private model: EditorPlane
    ) {
        this.svgRoot = document.createElementNS(NS, "svg");
        this.container.appendChild(this.svgRoot);
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
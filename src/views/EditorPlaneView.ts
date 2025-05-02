import { EditorPlane } from "../core/EditorPlane";
import { RectElementView } from "./RectElementView";
import { RulerLineView } from "./RulerLineView";

export class EditorPlaneView {
    constructor(
        private svgRoot: SVGSVGElement,
        private model: EditorPlane
    ) { }

    render(): void {
        // 既存の描画をクリア（MVPでは全部再描画でOK）
        while (this.svgRoot.firstChild) {
            this.svgRoot.removeChild(this.svgRoot.firstChild);
        }

        for (const element of this.model.getElements()) {
            // 今はRectだけなので Viewを直接生成
            const view = new RectElementView(element, this.svgRoot);
            view.render();
        }

        for (const ruler of this.model.getAllRulers()) {
            const view = new RulerLineView(ruler, this.svgRoot);
            view.render();
        }
    }
}

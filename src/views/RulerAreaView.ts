import { CornerRulerAreaView } from "./CornerRulerAreaView";
import { XAxisRulerAreaView } from "./XAxisRulerAreaView";
import { YAxisRulerAreaView } from "./YAxisRulerAreaView";


export class RulerAreaView {
    constructor(
        private xAxisView: XAxisRulerAreaView,
        private yAxisView: YAxisRulerAreaView,
        private cornerView: CornerRulerAreaView,
    ) {}

    render(): void {
        this.xAxisView.render();
        this.yAxisView.render();
        this.cornerView.render();
    }

    setRulerAreaSize(editorPlaneWidth: number, editorPlaneHeight: number, rulerAreaWidth: number): void {
        this.xAxisView.setRulerAreaSize(editorPlaneWidth, editorPlaneHeight, rulerAreaWidth);
        this.yAxisView.setRulerAreaSize(editorPlaneWidth, editorPlaneHeight, rulerAreaWidth);
        this.cornerView.setScreenSize(rulerAreaWidth, rulerAreaWidth);
    }

    setScroll(left: number, top: number): void {
        this.xAxisView.setScroll(left);
        this.yAxisView.setScroll(top);
    }
}
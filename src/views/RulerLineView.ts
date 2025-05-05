import { Ruler } from "../core/Ruler";
import { NS } from "../util/util";
import { ChainedRuler } from "../core/ChainedRuler";
import { EditorContext } from "./EditorContext";

export class DisplayRulerLineView {
    private dom: SVGLineElement | null = null;
    private baseStrokeWidth: number = 1;
    private svgStrokeWidth: number = 1;

    constructor(
        private ruler: Ruler,
        private context: EditorContext,
        private root: SVGElement,
    ) { }

    setZoom(scale: number) {
        this.svgStrokeWidth = this.baseStrokeWidth / scale;
        this.render();
    }

    render(): void {
        const pos = this.ruler.getPosition();
        if (!this.dom) {
            this.dom = document.createElementNS(NS, "line");
            this.root.appendChild(this.dom);
        }

        if (this.ruler.direction === 'horizontal') {
            this.dom.setAttribute("x1", "0");
            this.dom.setAttribute("y1", String(pos + this.context.getCanvasMargins().top));
            this.dom.setAttribute("x2", String(this.context.getCanvasMargins().left + this.context.getCanvasWidth() + this.context.getCanvasMargins().right));
            this.dom.setAttribute("y2", String(pos + this.context.getCanvasMargins().top));
            this.dom.setAttribute("stroke", "#00FF00");
        } else {
            this.dom.setAttribute("x1", String(pos + this.context.getCanvasMargins().left));
            this.dom.setAttribute("y1", "0");
            this.dom.setAttribute("x2", String(pos + this.context.getCanvasMargins().left));
            this.dom.setAttribute("y2", String(this.context.getCanvasMargins().top + this.context.getCanvasHeight() + this.context.getCanvasMargins().bottom));
            this.dom.setAttribute("stroke", "#FF0000");
        }

        this.dom.setAttribute("stroke-width", String(this.svgStrokeWidth));
    }
}

export class ControlRulerLineView {
    private dom: SVGLineElement | null = null;
    private onStartDragCallback?: (ruler: ChainedRuler, e: MouseEvent) => void;

    private baseStrokeWidth: number = 5;
    private svgStrokeWidth: number = 5;

    constructor(
        private ruler: Ruler,
        private context: EditorContext,
        private root: SVGElement,
    ) { }

    setZoom(scale: number) {
        this.svgStrokeWidth = this.baseStrokeWidth / scale;
        this.render();
    }

    render(): void {
        const pos = this.ruler.getPosition();
        if (!this.dom) {
            this.dom = document.createElementNS(NS, "line");
            this.root.appendChild(this.dom);
            if (this.ruler instanceof ChainedRuler) {
                this.dom.addEventListener("mousedown", (e) => {
                    if (this.onStartDragCallback) {
                    }
                    this.onStartDragCallback?.(this.ruler as ChainedRuler, e);
                });
            }
        }

        if (this.ruler.direction === 'horizontal') {
            this.dom.setAttribute("x1", "0");
            this.dom.setAttribute("y1", String(pos + this.context.getCanvasMargins().top));
            this.dom.setAttribute("x2", String(this.context.getCanvasMargins().left + this.context.getCanvasWidth() + this.context.getCanvasMargins().right));
            this.dom.setAttribute("y2", String(pos + this.context.getCanvasMargins().top));
            this.dom.setAttribute("stroke", "#00FF00");
        } else {
            this.dom.setAttribute("x1", String(pos + this.context.getCanvasMargins().left));
            this.dom.setAttribute("y1", "0");
            this.dom.setAttribute("x2", String(pos + this.context.getCanvasMargins().left));
            this.dom.setAttribute("y2", String(this.context.getCanvasMargins().top + this.context.getCanvasHeight() + this.context.getCanvasMargins().bottom));
            this.dom.setAttribute("stroke", "#FF0000");
        }

        this.dom.setAttribute("stroke-width", String(this.svgStrokeWidth));

    }

    onStartDrag(callback: (ruler: ChainedRuler, e: MouseEvent) => void) {
        this.onStartDragCallback = callback;
    }
}
import { EditorPlane } from "../core/EditorPlane";
import { clientPointToSvgPoint, NS } from "../util/util";
import { EditorContext } from "./EditorContext";
import { EditorInteractionController } from "../controller/EditorInteractionController";
import { AbsolutePoint, RulerPointRef } from "../core/Position";
import { InteractionEvent } from "../controller/events";

export class PointPickerView {
    private pointLayer: SVGGElement;
    constructor(
        private svgRoot: SVGGElement,
        private model: EditorPlane,
        private context: EditorContext,
    ) {
        this.pointLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    }

    render(): void {
        while (this.svgRoot.firstChild) {
            this.svgRoot.removeChild(this.svgRoot.firstChild);
        }

        if (!this.context.pointPicker.enabled) {
            return;
        }

        const hoverLayer = document.createElementNS(NS, "rect");
        hoverLayer.setAttribute("x", "0");
        hoverLayer.setAttribute("y", "0");
        hoverLayer.setAttribute("width", String(this.context.getSvgWidth()));
        hoverLayer.setAttribute("height", String(this.context.getSvgHeight()));
        hoverLayer.setAttribute("fill", "transparent");
        hoverLayer.setAttribute("pointer-events", "all");
        this.svgRoot.appendChild(hoverLayer);

        this.pointLayer = document.createElementNS(NS, "g");
        this.svgRoot.appendChild(this.pointLayer);

        hoverLayer.addEventListener("mousemove", (e) => {
            const mousePoint = clientPointToSvgPoint(this.svgRoot, e.clientX, e.clientY);
            this.updateHoveredIntersections({
                x: mousePoint.x - this.context.getCanvasMargins().left,
                y: mousePoint.y - this.context.getCanvasMargins().top}, this.pointLayer);
        });
    }

    private updateHoveredIntersections(mousePoint: {x: number, y: number}, layer: SVGGElement) {
        while (layer.firstChild) {
            layer.removeChild(layer.firstChild);
        }
        const zoom = this.context.getZoom();
        const threshold = 10 / zoom;
        if (this.context.pointPicker.isSnap) {
            const intersections = this.model.getAllIntersections();
            let nearest_id = -1;
            let nearest_distance = Number.MAX_VALUE;

            for (const [idx, intersection] of intersections.entries()) {
                const dx = Math.abs(mousePoint.x - intersection.xRuler.getPosition());
                const dy = Math.abs(mousePoint.y - intersection.yRuler.getPosition());
                if (dx * zoom < threshold && dy * zoom < threshold && dx * dx + dy * dy < nearest_distance) {
                    nearest_id = idx;
                    nearest_distance = dx * dx + dy * dy;
                }
            }

            if (nearest_id != -1) {
                const p = intersections[nearest_id];
                const circle = document.createElementNS(NS, "circle");
                circle.setAttribute("cx", String(p.xRuler.getPosition() + this.context.getCanvasMargins().left));
                circle.setAttribute("cy", String(p.yRuler.getPosition() + this.context.getCanvasMargins().top));
                circle.setAttribute("r", String(threshold));
                circle.setAttribute("fill", "#FF00FF");
                circle.addEventListener("click", (e) => {
                    this.context.pushEvent({type: "pointSelected", point: new RulerPointRef(p.xRuler, p.yRuler)});
                })
                layer.appendChild(circle);
            }
        } else {
            const circle = document.createElementNS(NS, "circle");
            circle.setAttribute("cx", String(mousePoint.x + this.context.getCanvasMargins().left));
            circle.setAttribute("cy", String(mousePoint.y + this.context.getCanvasMargins().top));
            circle.setAttribute("r", String(threshold));
            circle.setAttribute("fill", "#FF00FF");
            circle.setAttribute("pointer-events", "click");
            circle.addEventListener("click", (e) => {
                this.context.pushEvent({type: "pointSelected", point: new AbsolutePoint({x: mousePoint.x, y: mousePoint.y})});
            })
            circle.addEventListener("mousemove", (e) => {
                const mousePoint = clientPointToSvgPoint(this.svgRoot, e.clientX, e.clientY);
                this.updateHoveredIntersections({
                    x: mousePoint.x - this.context.getCanvasMargins().left,
                    y: mousePoint.y - this.context.getCanvasMargins().top}, this.pointLayer);
            })
            layer.appendChild(circle);
        }
    }
}
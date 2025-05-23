import { PositionRefLike } from "./Position";
import { BoundingBox } from "../types/interfaces";

export class RectElement {
    constructor(
        public id: string,
        public start: PositionRefLike,
        public end: PositionRefLike,
        public graphicsAttributes: Map<string, string> = new Map(),
    ) {
        if (!this.graphicsAttributes.has("fill")) {
            this.graphicsAttributes.set("fill", "#d3d3d3");
        }
    }

    public getBBox(): BoundingBox {
        const p1 = this.start.getPosition();
        const p2 = this.end.getPosition();
        return {
            x: Math.min(p1.x, p2.x),
            y: Math.min(p1.y, p2.y),
            width: Math.abs(p1.x - p2.x),
            height: Math.abs(p1.y - p2.y)
        }
    }
}

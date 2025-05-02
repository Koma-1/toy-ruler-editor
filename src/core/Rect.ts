import { PositionRefLike } from "./Position";
import { BoundingBox } from "../types/interfaces";

export class RectElement {
    constructor(
        public id: string,
        public start: PositionRefLike,
        public end: PositionRefLike,
        public graphicsAttributes?: Map<string, string>,
    ) { }

    public getBBox(): BoundingBox {
        const p1 = this.start.getPosition();
        const p2 = this.end.getPosition();
        const x = p1.x < p2.x ? p1.x : p2.x;
        const y = p1.y < p2.y ? p1.y : p2.y;
        return {
            x: Math.min(p1.x, p2.x),
            y: Math.min(p1.y, p2.y),
            width: Math.abs(p1.x - p2.x),
            height: Math.abs(p1.y - p2.y)
        }
    }
}

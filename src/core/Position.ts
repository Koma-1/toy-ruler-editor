import { Ruler } from "./Ruler";

export interface Position {
    x: number;
    y: number;
}

export interface PositionRefLike {
    getPosition(): Position;
}

export class RulerPointRef implements PositionRefLike {
    constructor(public xRuler: Ruler, public yRuler: Ruler) {}

    getPosition(): Position {
        return {
            x: this.xRuler.getPosition(),
            y: this.yRuler.getPosition()
        };
    }
}

export class AbsolutePoint implements PositionRefLike {
    constructor(private pos: Position) {}

    getPosition(): Position {
        return this.pos;
    }
}
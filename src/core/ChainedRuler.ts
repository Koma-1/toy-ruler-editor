import { Ruler, RulerDirection } from "./Ruler";

export class ChainedRuler implements Ruler {
    constructor(
        public id: string,
        public direction: RulerDirection,
        public baseRuler: Ruler | null,
        public offset: number
    ) {}

    public getPosition(): number {
        if (this.baseRuler) {
            return this.baseRuler.getPosition() + this.offset;
        }
        return this.offset;
    }
}
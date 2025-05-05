import { Ruler, RulerDirection } from "./Ruler";

export class ChainedRuler implements Ruler {
    private previewOffset: number | null = null;
    constructor(
        public id: string,
        public direction: RulerDirection,
        public baseRuler: Ruler | null,
        public offset: number
    ) {}

    getPosition(): number {
        if (this.baseRuler) {
            return this.baseRuler.getPosition() + this.offset + (this.previewOffset ?? 0);
        }
        return this.offset + (this.previewOffset ?? 0);
    }

    applyPreviewOffset(delta: number): void {
        this.previewOffset = delta + this.offset >= 0 ? delta : -this.offset;
    }

    commitPreview(): void {
        if (this.previewOffset !== null) {
            this.offset += this.previewOffset;
            this.previewOffset = null;
        }
    }

    cancelPreview(): void {
        this.previewOffset = null;
    }
}
import { Ruler } from './Ruler';
import { RectElement } from './Rect';

export class EditorPlane {
    private rulers: Map<string, Ruler> = new Map();
    private elements: RectElement[] = [];

    constructor(
        initialRulers: Ruler[] = [],
        initialElements: RectElement[] = []
    ) {
        for (const r of initialRulers) {
            this.rulers.set(r.id, r);
        }
        this.elements = initialElements;
    }

    getRuler(id: string): Ruler | undefined {
        return this.rulers.get(id);
    }

    getAllRulers(): Ruler[] {
        return Array.from(this.rulers.values());
    }

    getElements(): RectElement[] {
        return this.elements;
    }

    addElement(element: RectElement): void {
        this.elements.push(element);
    }

    removeElementById(id: string): void {
        this.elements = this.elements.filter(e => e.id !== id);
    }
}

import { Ruler } from './Ruler';
import { RectElement } from './Rect';

export class EditorPlane {
    private rulers: Map<string, Ruler> = new Map();
    private elements: RectElement[] = [];

    constructor(
        private width?: number,
        private height?: number,
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

    getAllIntersections(): {xRuler: Ruler, yRuler: Ruler}[] {
        let result: {xRuler: Ruler, yRuler: Ruler}[] = [];
        for (const xRuler of this.getAllRulers().filter((ruler) => {return ruler.direction === "vertical"})) {
            for (const yRuler of this.getAllRulers().filter((ruler) => {return ruler.direction === "horizontal"})) {
                result.push({xRuler: xRuler, yRuler: yRuler});
            }
        }
        return result;
    }

    getElements(): RectElement[] {
        return this.elements;
    }

    getElement(id: string): RectElement | null {
        for (const elem of this.elements) {
            if (elem.id === id) {
                return elem;
            }
        }
        return null;
    }

    addElement(element: RectElement): void {
        this.elements.push(element);
    }

    removeElementById(id: string): void {
        console.log(this.elements);
        this.elements = this.elements.filter(e => e.id !== id);
        console.log("-> ", this.elements);
    }

    getWidth(): number {
        return this.width ?? 0;
    }

    getHeight(): number {
        return this.height ?? 0;
    }
}

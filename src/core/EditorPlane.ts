import { Ruler } from './Ruler';
import { RectElement } from './Rect';
import { IdRegistry } from './IdRegistry';

export class EditorPlane {
    private rulers: Map<string, Ruler> = new Map();
    private elements: RectElement[] = [];
    private idRegistry = new IdRegistry();

    constructor(
        private width?: number,
        private height?: number,
        initialRulers: Ruler[] = [],
        initialElements: RectElement[] = []
    ) {
        for (const r of initialRulers) {
            this.rulers.set(r.id, r);
        }
        for (const elem of initialElements) {
            this.addElement(elem);
        }
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
        if (element.id === "") {
            element.id = this.idRegistry.generateId("rect");
        }
        this.idRegistry.reserveId(element.id);
        this.elements.push(element);
    }

    addRuler(ruler: Ruler): void {
        if (ruler.id === "") {
            ruler.id = this.idRegistry.generateId(ruler.direction);
        }
        this.idRegistry.reserveId(ruler.id);
        this.rulers.set(ruler.id, ruler);
    }

    removeElementById(id: string): void {
        this.idRegistry.releaseId(id);
        this.elements = this.elements.filter(e => e.id !== id);
    }

    getWidth(): number {
        return this.width ?? 0;
    }

    getHeight(): number {
        return this.height ?? 0;
    }
}

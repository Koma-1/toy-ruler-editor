import { Ruler, RulerDirection } from "../core/Ruler";
import { RectElement } from "../core/Rect";
import { ChainedRuler } from "../core/ChainedRuler";
import { AbsolutePoint, PositionRefLike, RulerPointRef } from "../core/Position";
import { EditorPlane } from "../core/EditorPlane";

export class XmlParser {
    private rulerMap = new Map<string, Ruler>();
    private rectMap = new Map<string, RectElement>();
    private rectList: RectElement[] = [];

    public parse(xmlStr: string): EditorPlane {
        if (xmlStr.length > 50000) {
            throw "Input XML is too large."
        }

        const parser = new DOMParser();
        const doc: Document = parser.parseFromString(xmlStr, "application/xml");
        const errorNode: Element | null = doc.querySelector("parsererror");
        if (errorNode) {
            console.log("parse error");
        } else {
            console.log(doc.documentElement.nodeName);
        }
        for (const elem of Array.from(doc.documentElement.children)) {
            switch (elem.tagName) {
                case "ruler":
                    this.parseRulerTag(elem);
                    break;
                case "rect":
                    this.parseRectTag(elem);
                    break;
                default:
                    break;
            }
        }

        return new EditorPlane(
            Array.from(this.rulerMap.values()),
            this.rectList,
        )
    }

    private parseRulerTag(elem: Element) {
        // assert elem.TagName == "ruler"
        const id = elem.getAttribute("id");
        const direction = elem.getAttribute("direction");
        const type = elem.getAttribute("type");
        if (!id || !direction || !type) {
            throw "TODO";
        }
        if (this.rulerMap.has(id)) {
            throw "TODO";
        }
        if (direction != "horizontal" && direction != "vertical") {
            throw "TODO";
        }
        if (type == "chain") {
            this.parseChainedRulerTag(elem, id, direction);
        } else {
            throw "TODO";
        }
    }

    private parseChainedRulerTag(elem: Element, id: string, direction: RulerDirection) {
        const offsetFrom = elem.getAttribute("offsetFrom");
        const offsetStr = elem.getAttribute("offset");
        if (!offsetStr) {
            throw "TODO";
        }
        const offset = Number(offsetStr);
        if (Number.isNaN(offset)) {
            throw "TODO"
        }

        if (!offsetFrom) {
            this.rulerMap.set(id, new ChainedRuler(id, direction, null, offset))
        } else {
            const baseRuler = this.rulerMap.get(offsetFrom);
            if (!baseRuler) {
                throw "TODO";
            }
            if (baseRuler.direction != direction) {
                throw "TODO";
            }
            this.rulerMap.set(id, new ChainedRuler(id, direction, baseRuler, offset));
        }
    }

    private parseRectTag(elem: Element) {
        // assert elem.TagName == "ruler"
        const id = elem.getAttribute("id");

        if (!id) {
            throw "TODO";
        }

        const startXRulerAttr = elem.getAttribute("startXRuler");
        const startYRulerAttr = elem.getAttribute("startYRuler");
        const startXAttr = elem.getAttribute("startX");
        const startYAttr = elem.getAttribute("startY");
        let startPosition: PositionRefLike | null = null;
        if (startXRulerAttr && startYRulerAttr && !startXAttr && !startYAttr) {
            const xRuler = this.rulerMap.get(startXRulerAttr);
            const yRuler = this.rulerMap.get(startYRulerAttr);
            if (!xRuler || !yRuler) {
                throw "TODO";
            }
            if (xRuler.direction != "vertical" || yRuler.direction != "horizontal") {
                throw "TODO";
            }
            startPosition = new RulerPointRef(xRuler, yRuler);
        } else if (!startXRulerAttr && !startYRulerAttr && startXAttr && startYAttr) {
            const x = Number(startXAttr);
            const y = Number(startYAttr);
            if (Number.isNaN(x) || Number.isNaN(y)) {
                throw "TODO";
            }
            startPosition = new AbsolutePoint({x: x, y: y});
        } else {
            throw "TODO";
        }

        if (!startPosition) {
            throw "TODO";
        }

        const endXRulerAttr = elem.getAttribute("endXRuler");
        const endYRulerAttr = elem.getAttribute("endYRuler");
        const endXAttr = elem.getAttribute("endX");
        const endYAttr = elem.getAttribute("endY");
        let endPosition: PositionRefLike | null = null;
        if (endXRulerAttr && endYRulerAttr && !endXAttr && !endYAttr) {
            const xRuler = this.rulerMap.get(endXRulerAttr);
            const yRuler = this.rulerMap.get(endYRulerAttr);
            if (!xRuler || !yRuler) {
                throw "TODO";
            }
            if (xRuler.direction != "vertical" || yRuler.direction != "horizontal") {
                throw "TODO";
            }
            endPosition = new RulerPointRef(xRuler, yRuler);
        } else if (!endXRulerAttr && !endYRulerAttr && endXAttr && endYAttr) {
            const x = Number(endXAttr);
            const y = Number(endYAttr);
            if (Number.isNaN(x) || Number.isNaN(y)) {
                throw "TODO";
            }
            endPosition = new AbsolutePoint({x: x, y: y});
        } else {
            throw "TODO";
        }

        if (!endPosition) {
            throw "TODO";
        }

        const rect = new RectElement(id, startPosition, endPosition);
        this.rectList.push(rect)
        this.rectMap.set(id, rect);
    }
}
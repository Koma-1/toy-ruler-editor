export const NS = "http://www.w3.org/2000/svg";

export type InteractionMode =
    | "idle"
    | "insert-rect";

export function clientPointToSvgPoint(root: SVGGraphicsElement, x: number, y: number): DOMPoint {
    var pt = new DOMPoint(x, y);
    return pt.matrixTransform(root.getScreenCTM()!.inverse());
}
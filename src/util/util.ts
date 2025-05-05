export const NS = "http://www.w3.org/2000/svg";

export function clientPointToSvgPoint(root: SVGGraphicsElement, x: number, y: number): DOMPoint {
    var pt = new DOMPoint(x, y);
    return pt.matrixTransform(root.getScreenCTM()!.inverse());
}
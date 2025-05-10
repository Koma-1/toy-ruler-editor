import { RectElement } from "../core/Rect";

export interface InteractionEnvironment {
    enableIntersectionPicker(enabled: boolean): void;
    requestRender(): void;
    deleteSelectedElement(): void;
    addElement(element: RectElement): void;
}
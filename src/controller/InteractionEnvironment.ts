import { RectElement } from "../core/Rect";

export interface InteractionEnvironment {
    enableIntersectionPicker(enabled: boolean): void;
    enableElementSelection(enabled: boolean): void;
    requestRender(): void;
    removeElement(id: string): void;
    addElement(element: RectElement): void;
    setElementAttribute(id: string, key: string, value: string): void;
}
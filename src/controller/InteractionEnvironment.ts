import { RectElement } from "../core/Rect";

export interface InteractionEnvironment {
    enableIntersectionPicker(enabled: boolean): void;
    enableElementSelection(enabled: boolean): void;
    requestRender(): void;
    removeElement(id: string): void;
    addElement(element: RectElement): void;
}
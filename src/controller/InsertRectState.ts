import { EditorPlane } from "../core/EditorPlane";
import { PositionRefLike } from "../core/Position";
import { RectElement } from "../core/Rect";
import { InteractionMode } from "../util/util";
import { EditorInteractionContoroller } from "./EditorInteractionController";
import { InteractionEvent } from "./events";
import { InteractionState } from "./InteractionState";

export class InsertRectState implements InteractionState {
    private stage: "start" | "end" = "start";
    private startPoint?: PositionRefLike;
    constructor(
        private controller: EditorInteractionContoroller,
        private model: EditorPlane,
    ) {}
    getMode(): InteractionMode {
        return "insert-rect";
    }
    push(e: InteractionEvent) {
        console.log("InsertRectState push:", e);
        console.log("stage:", this.stage);
        if (e.type == "cancel") {
            this.controller.exit();
            return;
        }

        if (e.type != "pointSelected") {
            return;
        }
        if (this.stage === "start") {
            this.startPoint = e.point;
            this.stage = "end";
        } else {
            const rect = new RectElement("__Rect", this.startPoint!, e.point);
            this.model.addElement(rect);
            this.controller.exit();
        }
    }
}
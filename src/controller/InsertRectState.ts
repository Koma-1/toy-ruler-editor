import { EditorPlane } from "../core/EditorPlane";
import { PositionRefLike } from "../core/Position";
import { RectElement } from "../core/Rect";
import { InteractionMode } from "../util/util";
import { InteractionEvent } from "./events";
import { InteractionContext } from "./InteractionContext";
import { InteractionState } from "./InteractionState";

export class InsertRectState implements InteractionState {
    private stage: "start" | "end" = "start";
    private startPoint?: PositionRefLike;
    private ctx!: InteractionContext;

    getMode(): InteractionMode {
        return "insert-rect";
    }

    enter(ctx: InteractionContext) {
        this.ctx = ctx;
        this.ctx.env.enableIntersectionPicker(true);
    }

    exit(): void {
        this.ctx.env.enableIntersectionPicker(false);
    }

    push(e: InteractionEvent) {
        console.log("InsertRectState push:", e);
        console.log("stage:", this.stage);
        if (e.type == "cancel") {
            this.exit();
            this.ctx.emitEvent({type: "cancel"});
            return;
        }

        if (e.type != "pointSelected") {
            return;
        }
        if (this.stage === "start") {
            this.startPoint = e.point;
            this.stage = "end";
        } else {
            const rect = new RectElement("", this.startPoint!, e.point);
            this.ctx.env.addElement(rect);
            this.exit();
            this.ctx.emitEvent({type: "complete"});
        }
    }
}
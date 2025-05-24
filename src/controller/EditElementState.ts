import { InteractionMode } from "../util/util";
import { InteractionState } from "./InteractionState";
import { InteractionContext } from "./InteractionContext";
import { InteractionEvent } from "./events";

export class EditElementState implements InteractionState {
    private ctx!: InteractionContext;
    constructor() {}
    getMode(): InteractionMode {
        return "edit-element";
    }
    enter(ctx: InteractionContext) {
        this.ctx = ctx;
        this.ctx.env.enableElementSelection(true);
    }

    exit(): void {
        this.ctx.selection.clear();
        this.ctx.env.enableElementSelection(false);
    }

    push(e: InteractionEvent) {
        console.log("EditElementState");
        if (e.type == "cancel") {
            this.exit();
            this.ctx.emitEvent({type: "cancel"});
            return;
        }

        if (e.type == "graphicsElementSelected") {
            if (this.ctx.selection.has(e.id)) {
                this.ctx.selection.delete(e.id);
            } else {
                this.ctx.selection.clear();
                this.ctx.selection.add(e.id);
            }
            this.ctx.env.requestRender();
        } else if (e.type == "command") {
            if (e.command == "remove") {
                for (const id of this.ctx.selection.entries()) {
                    this.ctx.env.removeElement(id);
                }
                this.ctx.selection.clear();
                this.ctx.env.requestRender();
            } else if (e.command == "fillColor") {
                for (const id of this.ctx.selection.entries()) {
                    this.ctx.env.setElementAttribute(id, "fill", e.color);
                }
            }
        } else {
            return;
        }
    }

}
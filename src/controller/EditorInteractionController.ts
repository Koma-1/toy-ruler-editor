import { InteractionMode } from "../util/util";
import { InteractionState } from "./InteractionState";
import { IdleState } from "./IdleState";
import { InteractionEvent } from "./events";

export class EditorInteractionContoroller {
    private childState: InteractionState = new IdleState();

    constructor(
        private renderCallback: () => void,
    ) {}

    requestRender() {
        this.renderCallback();
    }

    getMode(): InteractionMode {
        return this.childState.getMode();
    }

    push(e: InteractionEvent): void {
        console.log("EditorInteractionContoroller push:", e);
        this.childState.push(e);
    }

    exit(): void {
        this.requestRender();
        this.childState = new IdleState();
    }

    setState(state: InteractionState): boolean {
        console.log(this.childState.getMode());
        if (this.getMode() !== "idle") {
            return false;
        }
        console.log("->", state.getMode());
        this.childState = state;
        return true;
    }

    cancel(): void {
        this.push({type: "cancel"});
    }
}
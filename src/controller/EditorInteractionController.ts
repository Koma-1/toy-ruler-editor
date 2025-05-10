import { InteractionMode } from "../util/util";
import { InteractionState } from "./InteractionState";
import { IdleState } from "./IdleState";
import { InteractionEvent } from "./events";
import { InteractionEnvironment } from "./InteractionEnvironment";
import { ControllerEvent, InteractionContext } from "./InteractionContext";

export class EditorInteractionContoroller {
    private childState: InteractionState;
    private context: InteractionContext;

    constructor(
        env: InteractionEnvironment,
    ) {
        this.context = {
            env: env,
            emitEvent: (e) => {this.handleState(e);}, // TODO
        }
        this.childState = new IdleState();
        this.childState.enter?.(this.context);
    }

    getMode(): InteractionMode {
        return this.childState.getMode();
    }

    handleState(e: ControllerEvent): void {
        switch (e.type) {
            case "complete":
                this.childState = new IdleState();
                this.childState.enter?.(this.context);
                break;
            case "cancel":
                this.childState = new IdleState();
                this.childState.enter?.(this.context);
                break;
            default:
                break;
        }
    }

    push(e: InteractionEvent): void {
        console.log("EditorInteractionContoroller push:", e);
        this.childState.push(e);
    }

    enter(state: InteractionState): boolean {
        console.log(this.childState.getMode());
        if (this.getMode() !== "idle") {
            return false;
        }
        console.log("->", state.getMode());
        this.childState = state;
        state.enter?.(this.context);
        return true;
    }

    cancel(): void {
        this.push({type: "cancel"});
    }
}
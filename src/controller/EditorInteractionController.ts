import { InteractionMode } from "../util/util";
import { InteractionState } from "./InteractionState";
import { IdleState } from "./IdleState";
import { InteractionEvent } from "./events";
import { InteractionEnvironment } from "./InteractionEnvironment";
import { ControllerEvent, InteractionContext } from "./InteractionContext";
import { EditElementState } from "./EditElementState";

export class EditorInteractionController {
    private childState: InteractionState;
    private context: InteractionContext;
    private selectedElements: Set<string> = new Set();

    constructor(
        env: InteractionEnvironment,
    ) {
        this.context = {
            env: env,
            emitEvent: (e) => {this.handleState(e);}, // TODO
            selection: {
                add: (id) => {this.addSelectedElement(id);},
                delete: (id) => {this.deleteSelectedElement(id);},
                clear: () => {this.resetSelectedElement();},
                has: (id) => {return this.hasSelectedElement(id);},
                entries: () => {return this.getAllSelectedElement();},
            }
        }
        this.childState = new EditElementState();
        this.childState.enter?.(this.context);
    }

    getMode(): InteractionMode {
        return this.childState.getMode();
    }

    handleState(e: ControllerEvent): void {
        switch (e.type) {
            case "complete":
                this.childState = new EditElementState();
                this.childState.enter?.(this.context);
                break;
            case "cancel":
                this.childState = new EditElementState();
                this.childState.enter?.(this.context);
                break;
            default:
                break;
        }
    }

    push(e: InteractionEvent): void {
        console.log("EditorInteractionController push:", e);
        this.childState.push(e);
    }

    enter(state: InteractionState): boolean {
        console.log(this.childState.getMode());
        this.childState.push({type: "cancel"});
        console.log("->", state.getMode());
        this.childState = state;
        state.enter?.(this.context);
        return true;
    }

    cancel(): void {
        this.push({type: "cancel"});
    }

    addSelectedElement(id: string): void {
        this.selectedElements.add(id);
    }

    deleteSelectedElement(id: string): void {
        this.selectedElements.delete(id);
    }

    resetSelectedElement(): void {
        this.selectedElements.clear();
    }

    hasSelectedElement(id: string): boolean {
        return this.selectedElements.has(id);
    }

    getAllSelectedElement(): string[] {
        return Array.from(this.selectedElements);
    }

    getSelectedIds(): string[] {
        return Array.from(this.selectedElements);
    }
}
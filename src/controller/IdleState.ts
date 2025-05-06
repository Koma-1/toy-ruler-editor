import { InteractionMode } from "../util/util";
import { InteractionState } from "./InteractionState";
export class IdleState implements InteractionState {
    constructor() {}
    getMode(): InteractionMode {
        return "idle";
    }
    push(): void {}

}
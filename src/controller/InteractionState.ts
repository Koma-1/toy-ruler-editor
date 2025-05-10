import { InteractionMode } from "../util/util";
import { InteractionEvent } from "./events";
import { InteractionContext } from "./InteractionContext";

export interface InteractionState {
    getMode(): InteractionMode;
    push(e: InteractionEvent): void;
    enter?(ctx: InteractionContext): void;
    exit?(): void;
}
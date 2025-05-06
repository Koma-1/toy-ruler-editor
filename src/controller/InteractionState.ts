import { InteractionMode } from "../util/util";
import { InteractionEvent } from "./events";

export interface InteractionState {
    getMode(): InteractionMode;
    push(e: InteractionEvent): void;
}
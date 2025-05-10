import { InteractionEnvironment } from "./InteractionEnvironment";

export type ControllerEvent =
    | {type: "complete"}
    | {type: "cancel"};

export interface InteractionContext {
    env: InteractionEnvironment;
    emitEvent(event: ControllerEvent): void;
}
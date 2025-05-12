import { InteractionEnvironment } from "./InteractionEnvironment";

export type ControllerEvent =
    | {type: "complete"}
    | {type: "cancel"};

export interface InteractionContext {
    env: InteractionEnvironment;
    emitEvent(event: ControllerEvent): void;
    selection: {
        add(id: string): void;
        delete(id: string): void;
        clear(): void;
        has(id: string): boolean;
        entries(): string[];
    }
}
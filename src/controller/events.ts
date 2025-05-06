import { PositionRefLike } from "../core/Position";

export type InteractionEvent =
    | {type: "cancel"}
    | {type: "pointSelected", point: PositionRefLike};
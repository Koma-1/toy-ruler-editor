import { PositionRefLike } from "../core/Position";

export type InteractionEvent =
    | {type: "cancel"}
    | {type: "pointSelected", point: PositionRefLike}
    | {type: "graphicsElementSelected", id: string}
    | {type: "command", command: "remove"}
    | {type: "command", command: "fillColor", color: string}
    ;
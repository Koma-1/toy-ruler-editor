export type RulerDirection = "vertical" | "horizontal"

export interface Ruler {
    id: string;
    direction: RulerDirection;
    getPosition(): number;
}
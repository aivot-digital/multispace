export interface Desk {
    id: number;
    name: string;
    description: string;
    tags: string[];

    width: number;
    height: number;
    pos_x: number;
    pos_y: number;
    orientation: number;

    floor: number;
}
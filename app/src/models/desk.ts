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

export interface DisplayDesk extends Desk {
    is_blocked: boolean;
}

export function isDisplayDesk(obj: any): obj is DisplayDesk {
    return obj != null && obj.is_blocked != null;
}
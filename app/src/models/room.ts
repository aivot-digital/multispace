export interface Room {
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

export interface DisplayRoom extends Room {
    is_blocked: boolean;
    booking_user?: string;
}

export function isDisplayRoom(obj: any): obj is DisplayRoom {
    return obj != null && obj.is_blocked != null;
}
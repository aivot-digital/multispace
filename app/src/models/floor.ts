import {DisplayDesk} from "./desk";
import {DisplayRoom} from "./room";

export interface Floor {
    id: number;
    name: string;
    image: string;
    desk_count?: number;
    access_count?: number;
}

export interface DisplayFloor extends Floor {
    desks: DisplayDesk[];
    rooms: DisplayRoom[];
}
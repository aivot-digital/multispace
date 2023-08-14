import {User} from "./user";

export interface RoomBooking {
    id: number;
    user: number;
    room: number;
    start: string;
    end: string;
}

export interface RoomBookingWithUser extends Omit<RoomBooking, 'user'> {
    user: User;
}

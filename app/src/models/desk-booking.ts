import {User} from "./user";

export interface DeskBooking {
    id: number;
    user: number;
    desk: number;
    date: string;
}

export interface DeskBookingWithUser extends Omit<DeskBooking, 'user'> {
    user: User;
}

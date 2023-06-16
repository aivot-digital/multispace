import {SystemConfig} from "../models/system-config";
import {ApiService} from "./api-service";
import {User} from "../models/user";
import {UserConfig} from "../models/user-config";
import {Floor} from "../models/floor";
import {Desk} from "../models/desk";
import {Room} from "../models/room";
import {Access} from "../models/access";
import {DisplayKey} from "../models/display-key";
import {DeskBooking} from "../models/desk-booking";
import {RoomBooking} from "../models/room-booking";

class RestApiService<M> extends ApiService {
    constructor(private readonly path: string) {
        super();
    }

    async list(filter?: {[key: string]: string | number}): Promise<{
        count: number;
        results: M[];
    }> {
        const filterQuery = filter != null ? Object.keys(filter).map(key => `${key}=${filter[key]}`).join('&') : '';
        return ApiService.get(this.path + '?page=0&limit=999&'+filterQuery);
    }

    async create(data: M): Promise<M> {
        return ApiService.post(this.path, data);
    }

    async retrieve(id: number | string): Promise<M> {
        return ApiService.get(this.path + id + '/');
    }

    async patch(id: number | string, data: Partial<M>): Promise<M> {
        return ApiService.patch(this.path + id + '/', data);
    }

    async destroy(id: number | string,): Promise<void> {
        return ApiService.delete(this.path + id + '/');
    }
}

export const AccessesApiService = new RestApiService<Access>('accesses/');
export const DeskBookingsApiService = new RestApiService<DeskBooking>('desk-bookings/');
export const DesksApiService = new RestApiService<Desk>('desks/');
export const DisplayKeysApiService = new RestApiService<DisplayKey>('display-keys/');
export const FloorApiService = new RestApiService<Floor>('floors/');
export const RoomBookingsApiService = new RestApiService<RoomBooking>('room-bookings/');
export const RoomsApiService = new RestApiService<Room>('rooms/');
export const SystemConfigApiService = new RestApiService<SystemConfig>('system-configs/');
export const UserConfigApiService = new RestApiService<UserConfig>('user-configs/');
export const UserApiService = new RestApiService<User>('users/');

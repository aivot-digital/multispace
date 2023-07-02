import {SystemConfig} from "../models/system-config";
import {ApiService} from "./api-service";
import {User} from "../models/user";
import {UserConfig} from "../models/user-config";
import {DisplayFloor, Floor} from "../models/floor";
import {Desk} from "../models/desk";
import {Room} from "../models/room";
import {Access} from "../models/access";
import {DisplayKey} from "../models/display-key";
import {DeskBooking, DeskBookingWithUser} from "../models/desk-booking";
import {RoomBooking, RoomBookingWithUser} from "../models/room-booking";

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

class _DeskBookingsApiService extends RestApiService<DeskBooking> {
    constructor() {
        super('desk-bookings/');
    }

    public async listWithUsers(filter?: {[key: string]: string | number}): Promise<DeskBookingWithUser[]> {
        return this.list(filter)
            .then(res => res.results)
            .then(bookings => {
                if (bookings.length === 0) {
                    return Promise.resolve([]);
                }

                const userIds: number[] = [];
                for (const bk of bookings) {
                    if (userIds.includes(bk.user)) {
                        continue;
                    }
                    userIds.push(bk.user);
                }
                return UserApiService
                    .list({id__in: userIds.join(',')})
                    .then(users => bookings.map(bk => ({
                        ...bk,
                        user: users.results.find(usr => usr.id === bk.user)!,
                    })))
            })
    }
}
export const DeskBookingsApiService = new _DeskBookingsApiService();

export const DesksApiService = new RestApiService<Desk>('desks/');
export const DisplayKeysApiService = new RestApiService<DisplayKey>('display-keys/');

class _FloorApiService extends RestApiService<Floor> {
    constructor() {
        super('floors/');
    }

    public async getDisplayFloor(key: string): Promise<DisplayFloor> {
        return ApiService.get(`display/${key}/`);
    }

}
export const FloorApiService = new _FloorApiService();

class _RoomBookingsApiService extends RestApiService<RoomBooking> {
    constructor() {
        super('room-bookings/');
    }

    public async listWithUsers(filter?: {[key: string]: string | number}): Promise<RoomBookingWithUser[]> {
        return this.list(filter)
            .then(res => res.results)
            .then(bookings => {
                if (bookings.length === 0) {
                    return Promise.resolve([]);
                }

                const userIds: number[] = [];
                for (const bk of bookings) {
                    if (userIds.includes(bk.user)) {
                        continue;
                    }
                    userIds.push(bk.user);
                }
                return UserApiService
                    .list({id__in: userIds.join(',')})
                    .then(users => bookings.map(bk => ({
                        ...bk,
                        user: users.results.find(usr => usr.id === bk.user)!,
                    })))
            })
    }
}
export const RoomBookingsApiService = new _RoomBookingsApiService();

export const RoomsApiService = new RestApiService<Room>('rooms/');
export const SystemConfigApiService = new RestApiService<SystemConfig>('system-configs/');
export const UserConfigApiService = new RestApiService<UserConfig>('user-configs/');
export const UserApiService = new RestApiService<User>('users/');

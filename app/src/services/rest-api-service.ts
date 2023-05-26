import {SystemConfig} from "../models/system-config";
import {ApiService} from "./api-service";
import {User} from "../models/user";
import {UserConfig} from "../models/user-config";
import {Floor} from "../models/floor";

class RestApiService<M> extends ApiService {
    constructor(private readonly path: string) {
        super();
    }

    async list(page?: number, size?: number): Promise<{
        count: number;
        results: M[];
    }> {
        return ApiService.get(this.path);
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

export const AccessesApiService = new RestApiService<Floor>('accesses/');
export const DeskBookingsApiService = new RestApiService<Floor>('desk-bookings/');
export const DesksApiService = new RestApiService<Floor>('desks/');
export const DisplayKeysApiService = new RestApiService<Floor>('display-keys/');
export const FloorApiService = new RestApiService<Floor>('floors/');
export const RoomBookingsApiService = new RestApiService<Floor>('room-bookings/');
export const RoomsApiService = new RestApiService<Floor>('rooms/');
export const SystemConfigApiService = new RestApiService<SystemConfig>('system-configs/');
export const UserConfigApiService = new RestApiService<UserConfig>('user-configs/');
export const UserApiService = new RestApiService<User>('users/');

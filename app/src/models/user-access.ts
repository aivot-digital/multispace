import {Access} from "./access";
import {User} from "./user";

export interface UserAccess {
    access: Access;
    user: User;
}
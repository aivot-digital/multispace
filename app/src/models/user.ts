export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    password?: string;
}

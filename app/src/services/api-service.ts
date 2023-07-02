import {ApiError} from "../models/api-error";

export class ApiService {
    private static readonly host = process.env.NODE_ENV === 'production' ? '/api/' : 'http://127.0.0.1:8000/api/';

    public static async get<R>(path: string): Promise<R> {
        const res = await fetch(this.host + path, {
            headers: this.createHeaders(),
        });
        if (res.status !== 200) {
            throw new ApiError(res.status, await res.json());
        }
        return await res.json();
    }

    public static async post<P, R>(path: string, data: P): Promise<R> {
        const res = await fetch(this.host + path, {
            method: 'POST',
            headers: this.createHeaders(),
            body: JSON.stringify(data),
        });
        if (res.status !== 200 && res.status !== 201) {
            throw new ApiError(res.status, await res.json());
        }
        return await res.json();
    }

    public static async postFormData<R>(path: string, data: FormData): Promise<R> {
        const res = await fetch(this.host + path, {
            method: 'POST',
            headers: {
                'Authorization': this.createHeaders().Authorization,
            },
            body: data,
        });
        if (res.status !== 200 && res.status !== 201) {
            throw new ApiError(res.status, await res.json());
        }
        return await res.json();
    }

    public static async patch<P, R>(path: string, data: Partial<P>): Promise<R> {
        const res = await fetch(this.host + path, {
            method: 'PATCH',
            headers: this.createHeaders(),
            body: JSON.stringify(data),
        });
        if (res.status !== 200) {
            throw new ApiError(res.status, await res.json());
        }
        return await res.json();
    }

    public static async patchFormData<R>(path: string, data: FormData): Promise<R> {
        const res = await fetch(this.host + path, {
            method: 'PATCH',
            headers: {
                'Authorization': this.createHeaders().Authorization,
            },
            body: data,
        });
        if (res.status !== 200) {
            throw new ApiError(res.status, await res.json());
        }
        return await res.json();
    }

    public static async put<P, R>(path: string, data: P): Promise<R> {
        const res = await fetch(this.host + path, {
            method: 'PUT',
            headers: this.createHeaders(),
            body: JSON.stringify(data),
        });
        if (res.status !== 200) {
            throw new ApiError(res.status, await res.json());
        }
        return await res.json();
    }

    public static async delete(path: string): Promise<void> {
        const res = await fetch(this.host + path, {
            method: 'DELETE',
            headers: this.createHeaders(),
        });
        if (res.status !== 204) {
            throw new ApiError(res.status, await res.json());
        }
    }

    private static createHeaders() {
        const headers: any = {
            'Content-Type': 'application/json',
        };

        const token = localStorage.getItem('token');
        if (token != null) {
            headers['Authorization'] = 'Token ' + token;
        }

        return headers;
    }
}

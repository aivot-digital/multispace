export class ApiError extends Error {
    constructor(public readonly status: number, public readonly details: any) {
        super('api error');
    }
}

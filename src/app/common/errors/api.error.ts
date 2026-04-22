export class ApiError extends Error {
    message: string;
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = true;
    }
    static unAuthorized(message: string) {
        return new ApiError(message, 401);
    }
    static badRequest(message: string) {
        return new ApiError(message, 400);
    }
    static notFound(message: string) {
        return new ApiError(message, 404);
    }
    static serverError(message: string) {
        return new ApiError(message, 500);
    }
    static conflict(message: string) {
        return new ApiError(message, 409);
    }

}
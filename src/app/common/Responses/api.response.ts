class ApiResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: any;
    constructor(success: boolean, message: string, statusCode: number, data: any) {
        this.success = success;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }
    static success(message: string, statusCode: number, data: any) {
        return new ApiResponse(true, message, statusCode, data);
    }
    static ok(message: string, data: any) {
        return new ApiResponse(true, message, 200, data);
    }
    static created(message: string, data: any) {
        return new ApiResponse(true, message, 201, data);
    }
    static updated(message: string, data: any) {
        return new ApiResponse(true, message, 200, data);
    }
    static deleted(message: string, data: any) {
        return new ApiResponse(true, message, 200, data);
    }
    static error(message: string, statusCode: number, data: any) {
        return new ApiResponse(false, message, statusCode, data);
    }
}
export { ApiResponse }
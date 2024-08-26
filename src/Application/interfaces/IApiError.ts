

export interface IApiError extends Error {
    isOperational: boolean;
    httpCode: number;
}
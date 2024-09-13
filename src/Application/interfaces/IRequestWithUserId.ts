export interface RequestWithUserId extends Request {
    userId?: string|number;
    role?: string;
}
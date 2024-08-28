import { User } from "@/Domain/entities/User";


export interface IAuthService {
    register: (user: User) => Promise<User>;
    login: (email: string, password: string) => Promise<string>;

    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (email: string, password: string) => Promise<string>;
    changePassword: (userId: number, oldPassword: string, newPassword: string) => Promise<string>;
    logout: (userId: number) => Promise<void>;
}
import { User } from "@/Domain/entities/User";


export interface IAuthService {
    register: (user: User) => Promise<User>;
    login: (email: string, password: string) => Promise<any>;

    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (email: string, password: string) => Promise<string>;
    refreshToken: (token: string) => Promise<string>;

    // logout: (token: string) => Promise<void>;

}
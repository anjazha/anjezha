import { User } from "@/Domain/entities/User";

export interface IProfileService {
    // getProfile
    getProfile(id:number): Promise<User>;
    updateProfile(userID:number, data: User): Promise<User>;
    dleteProfile(userID:number): Promise<any>;
    updateProfilePicture(userID:number, data: User): Promise<User>;
    changePassword: (userId: number, oldPassword: string, newPassword: string) => Promise<string>;
    logout: (userId: number) => Promise<void>;

    // getProfile(): Promise<any>;

}
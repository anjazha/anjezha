import { INTERFACE_TYPE } from "@/helpers";
import { inject, injectable } from "inversify";
import { IProfileService } from "../interfaces/User/IProfileService";
import { IUserRepository } from "../interfaces/User/IUserRepository";
import { comparePass, hasPass } from "@/helpers/bcryptHelper";
import { User } from "@/Domain/entities/User";


@injectable()
export class ProfileService implements IProfileService {
    constructor(@inject(INTERFACE_TYPE.UserRepository) private userRepository:IUserRepository){}

    async getProfile(userID:number) {
        try{
              const profile = await this.userRepository.findById(userID);
                return profile;
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateProfile(userID:number, data: User) {
        try{
            const profile = await this.userRepository.update(userID, data);
            return profile;

        }
        catch (error) {
            throw new Error(error)
        }
    }

    async dleteProfile(userID:number) {
        try{
            return await this.userRepository.delete(userID);
        }catch (error) {
            throw new Error(error)
        }
    }

    async updateProfilePicture(userID:number, profilePicture: User ) {
         
        // const profile = await this.userRepository.findById(userID);
        // if(!profile){
        //     throw new Error('User not found');
        // }
        //     profile.profilePicture = data;
        try{
         
           const profile = await this.userRepository.update(userID, profilePicture);
           return profile;
        }catch (error) {
            throw new Error(error)
        }
    }

    async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<string> {

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // check if old password is correct
        const isMatch = await comparePass(oldPassword, user.password);

        if (!isMatch) {
            throw new Error('Password is incorrect');
        }

        // hash new password
        const hashedPassword = await hasPass(newPassword, 10);
        user.password = hashedPassword;

        // update user
        await this.userRepository.update(user.id, user);

        return 'Password changed successfully';
    }


    logout(userId: number) : Promise<void>{

        throw new Error('Method not implemented.');
        // handle in front end

    }


}
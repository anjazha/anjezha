
import { injectable, inject } from "inversify";

import { IUserRepository } from "../interfaces/User/IUserRepository";
import { IUserService } from "../interfaces/User/IUserService";
import { UserRepository } from "../repositories/userRepository";
import { INTERFACE_TYPE } from "@/helpers";




// all business logic handle in here 

@injectable()
export class UserService implements IUserService{
    // use depencie injection
    // public  userRepostry: IUserRepository
    // inejct data from UserRepostry to handle instance dynamic
    constructor(@inject(INTERFACE_TYPE.UserRepository) private readonly userRepository: IUserRepository) {}

    async create(user: any): Promise<any> {
        return this.userRepository.create(user);
    }


    async findByEmail(email: string): Promise<any> {
        return this.userRepository.findByEmail(email);
    }

    async findById(id: number): Promise<any> {
        return this.userRepository.findById(id);
    }

    async update(id: number, data: any): Promise<any> {
        return this.userRepository.update(id, data);
    }

    async delete(id: number): Promise<boolean> {
        return this.userRepository.delete(id);
    }

    async findAll(): Promise<any> {
        return this.userRepository.findAll();
    }

}

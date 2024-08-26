
// working with the user repository interface  

import { User } from "@/Domain/entities/User";

// to define the methods that will be implemented in the user repository class


export interface IUserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    update(id:number, user: User): Promise<User>;
    delete(id: number): Promise<boolean>;
    findAll(): Promise<User[]>;
}


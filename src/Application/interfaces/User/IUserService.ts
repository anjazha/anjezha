import { User } from "@/Domain/entities/User";



export interface IUserService {
    create(user:User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    update(id: number, data:any): Promise<User>;
    delete(id: number): Promise<boolean>;
    findAll(): Promise<User[]>;
}
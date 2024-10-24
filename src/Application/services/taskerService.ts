import { injectable , inject} from "inversify";


import { Tasker } from "@/Domain/entities/Tasker";
import { ITaskerService } from "../interfaces/User/Tasker/ITaskerService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { ITaskerRepository } from "../interfaces/User/Tasker/ITaskerRepository";
import { IRoleRepository } from "../interfaces/User/IRoleRepository";
import { Role } from "@/Domain/entities/role";
import { generateToken } from "@/helpers/tokenHelpers";
import { HTTP500Error } from "@/helpers/ApiError";

@injectable()
export class TaskerService implements ITaskerService {

    constructor(
        @inject(INTERFACE_TYPE.TaskerRepository) private taskerRepository: ITaskerRepository,
        @inject(INTERFACE_TYPE.RoleRepository) private roleRepository?:IRoleRepository
    ) {}

    async createTasker(taskerData: Tasker): Promise<any | undefined> {
       
        const userId= taskerData.userId;

       try{
        
         const taskerExist = await this.taskerRepository.getTaskerByUserId(userId);

        if(taskerExist){
            throw new Error("tasker exist");
        }
        // craete tasker on db 
         const tasker= await this.taskerRepository.createTasker(taskerData);

         
         // update roles about user to become tasker 
         

         let role = await this.roleRepository!.getRoleByUserId(userId);

         if(role){
           role = await this.roleRepository!.updateRole(new Role(userId, 'tasker'))
         }




        //  console.log(role.name);

         // generte new token with new role

         //const token= await generateToken({userId, role: role.name});
         //retutn token with acess and refresh token update role
         return {tasker, role:role.name};
        }  catch (error) {
            throw error;
        }
    }

    async getTaskerByUserId(userId: number): Promise<Tasker | undefined> {
        return await this.taskerRepository.getTaskerByUserId(userId)
    }

    async getTaskerById(id: number): Promise<Tasker | undefined> {
        return await this.taskerRepository.getTaskerById(id)
    }

    async updateTasker(tasker: Tasker): Promise<string | undefined> {
         return await this.taskerRepository.updateTasker(tasker);
    }

    async deleteTasker(id: number): Promise<string | undefined> {
         return  await this.taskerRepository.deleteTasker(id);
    }

    async getTaskerFeed(match:any):Promise<any | undefined>{

        const {page, limit} = match;

        
        const offset = (page - 1) * limit;
        match.offset = offset;

        const taskers = await this.taskerRepository.getTaskerFeed(match);
        // HTTP500Error('not found any tasker about this data')
        if (!taskers) throw  [];

        const totalTaser = taskers[0].totaltaskerscount;

        const totalPages = Math.ceil(totalTaser / limit);

        let prevPage = 1, nextPage=1;

        if(page>1) prevPage = page -1;

        if (page<totalPages) nextPage = page +1;

        const pagination={
            page,
            totalPages,
            prevPage,
            nextPage,
            limit
        }

        return { taskers, pagination}


    }

    // async getTaskerByUserId(userId: number): Promise<Tasker | undefined> {
    //     return await this.taskerRepository.getTaskerByUserId(userId)
    // }

    // async getTaskerByCategoryId(categoryId: number): Promise<Tasker[] | undefined> {
    //     return this.taskerRepository.getTaskerByCategoryId(categoryId)
    // }

    // async getTaskerByLocation(location: string): Promise<Tasker[] | undefined> {
    //     return this.taskerRepository.getTaskerByLocation(location)
    // }

    // async getTaskerByRating(rating: number): Promise<Tasker[] | undefined> {
    //     return this.taskerRepository.getTaskerByRating(rating)
    // }

}
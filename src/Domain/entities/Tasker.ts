import { Skills } from "./Skills";
import { User } from "./User";


export class Tasker {
    constructor(
        public userId: number,  // {basic info profile}
        public bio: string,
        // public location: string,
        public pricing: number,
        public longitude: number,
        public latitude: number,
        public category_id: number,
        public bidding?: boolean,
        public id?: number,
        public avgRating?: number,
        public user?:User,
        public skills?: Skills[],
        // public reviews?: Review[],
        // public totalRating?: number,
        // public totalReviews?: number,
        // // public totalCompletedTasks?: number,
        // // public totalTaskerEarnings?: number,
        
    ) {}

}
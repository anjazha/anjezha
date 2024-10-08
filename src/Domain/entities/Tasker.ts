import { Category } from "./Category";
import { Review } from "./Review";
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
        public categoryId: number,
        public bidding?: boolean,
        public id?: number,
        public avgRating?: number,
        public profile?:User,
        public role?: string,
        
        // public  createdAt?: Date,
        public category?: any,
        public skills?: Skills[],
        public reviews: Review[]= [],
        // public totalRating?: number,
        // public totalReviews?: number,
        // // public totalCompletedTasks?: number,
        // // public totalTaskerEarnings?: number,
        
    ) {}

}
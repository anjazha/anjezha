

export class Tasker {
    constructor(
        public userId: number,
        public bio: string,
        public location: string,
        public pricing: number,
        public longitude: number,
        public latitude: number,
        public category_id: number,
        public biding?: boolean,
        public id?: number,
        public avgRating?: number,
        
    ) {}

}
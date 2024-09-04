
export class Review {
    constructor(
        public review: string,
        public rating: number,
        public taskerId: number,
        public userId: number,
        public id?: number,
        public timestamp?: Date
    ) { }
  
}
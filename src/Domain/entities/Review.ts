import { User } from "./User";

export class Review {
    constructor(
        public review?: string,
        public rating?: number,
        public taskerId?: number,
        public User?: any,
        public id?: number,
        public timestamp?: Date
    ) { }
  
}
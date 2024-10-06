
export class Conversation{
    constructor(
        public userId:number,
        public taskerId:number,
        // public message: string, 
        // public is_read:boolean,
        public createdAt?: Date,
        public conversationId?: number,
        // public attechments?:{file_type:string,file_path:string,file_size:number}[]
    ) {}
}
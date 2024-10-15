
export class Conversation{
    constructor(
        public senderId:number,
        public receiverId:number,
        // public message: string, 
        // public is_read:boolean,
        public updateAt?: Date,
        public conversationId?: number,
        // public attechments?:{file_type:string,file_path:string,file_size:number}[]
    ) {}
}
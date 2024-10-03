export enum MessageStatus{
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    READ = "READ",
    FAILED = "FAILED"
}

export class Message{
    constructor(
        public senderId:number,
        public conversationId:number,
        public message: string, 
        public messageStatus?:MessageStatus,
        public changeStatusAt?:Date,
        public reciverId?:number,
        public sentAt?: Date,
        public id?: number,
        public attechments?:{file_type:string,file_path:string,file_size:number}[],
    ) {}
}

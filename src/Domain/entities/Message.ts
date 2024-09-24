
enum MessageStatus{
    sent,
    recived,
    seen
}

export class Messages{
    constructor(
        public senderId:number,
        public caht_id:number,
        public message: string, 
        public messageStatus:MessageStatus,
        public change_status_at:Date,
        public reciverId?:number,
        public created_at?: Date,
        public id?: number,
        public attechments?:{file_type:string,file_path:string,file_size:number}[]
    ) {}
}
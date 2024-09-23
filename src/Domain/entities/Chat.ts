
export class Messages{
    constructor(
        public userId:number,
        public taskerId:number,
        // public message: string, 
        // public is_read:boolean,
        public created_at?: Date,
        public id?: number,
        // public attechments?:{file_type:string,file_path:string,file_size:number}[]
    ) {}
}
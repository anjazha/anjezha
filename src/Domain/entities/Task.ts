

export class Task {

    constructor(
        // public id?:number,
        public userId?:number,
        public title?:string,
        public description?:string,
        public date?:string,
        public budget?:number,
        public location?:{longitude:number,latitude:number},
        public address?:string,
        public status?:string,
        public category_id?:number,
        public schedule?:{start_time : Date, end_time: Date , schedule_type: string},
        public attachments?:{file_type:string,file_path:string,file_size:number}[],
        public skills ?:string[],
    ){}
}
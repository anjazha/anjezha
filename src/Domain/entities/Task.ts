

export class Task {

    constructor(
        private readonly id?:number,
        private readonly userId?:number,
        private readonly title?:string,
        private readonly description?:string,
        private readonly date?:string,
        private readonly budget?:number,
        private readonly location?:{longitude:number,latitude:number},
        private readonly address?:string,
        private readonly status?:string,
        private readonly category?:number,
        private readonly schedual?:{start_time : Date, end_time: Date , schedual_type: string},
        private readonly attachments?:string[],
        private readonly skills ?:string[],
    ){}
}
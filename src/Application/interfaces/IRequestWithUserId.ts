import { Request } from 'express';


export interface RequestWithUserId extends Request {
    userId?: string|number;
    role?: string;
    attachments?: {file_type:string,file_path:string,file_size:number}[];
}
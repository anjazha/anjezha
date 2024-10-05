import { Request } from "express";

interface RequestWithUserId extends Request  {

    userId?: Number  | null | undefined;
    role?: string | undefined;
    fielName?:string|undefined;
}


export default RequestWithUserId

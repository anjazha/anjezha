import { Request } from "express";

interface RequestWithUserId extends Request  {

    userId?: Number  | null | undefined;
    role?: string | undefined;
}


export default RequestWithUserId
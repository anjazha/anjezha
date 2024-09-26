import { IPaginagion } from "@/Application/interfaces/IPagination";

export const apiResponse = (
  data?: {},
  message: string = "Request success",
  success : boolean = true,
  pagination? : IPaginagion
) => {
  let res : any = { success, message,  data }
  if(pagination) res.pagination = pagination; 
  return res;
};

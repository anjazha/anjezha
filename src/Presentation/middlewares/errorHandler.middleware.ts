import { IApiError } from "../../Application/interfaces/IApiError";
import { Request, Response, NextFunction } from "express";

export const errorHandler = async (
  err: IApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, message, isOperational, httpCode, stack } = err;

  let resObj: any = { success: false, name, message, httpCode };
  if (process.env.MODE === "development") resObj = {...resObj , stack, isOperational};
  if (!err?.isOperational) {
    res.status(err.httpCode || 500).json(resObj);
    process.exit(1);
  }else{
    res.status(err.httpCode || 500).json(resObj);
  }
};

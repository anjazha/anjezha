import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export default (req:Request, res:Response, next:NextFunction) => {
// handle validation as midleware 

  const err = validationResult(req);

  if(err.isEmpty()) return next();

  res.status(400).json({
    success: false,
    errors: err.array(),})

}
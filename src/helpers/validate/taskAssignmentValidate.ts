import validationMiddleware from "@/Presentation/middlewares/validation.middleware";
import { check } from "express-validator";


export const assignTaskValidate = [
    check('taskId').isNumeric().withMessage('Task ID must be a number'),
    check('taskerId').isNumeric().withMessage('Tasker ID must be a number'),
    validationMiddleware
]
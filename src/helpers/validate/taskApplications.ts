import validationMiddleware from "@/Presentation/middlewares/validation.middleware";
import { check } from "express-validator";



export const taskApplicationValidate = [
    check('taskId').notEmpty().isNumeric().withMessage('Task Id is required'),
    check('taskerId').notEmpty().isNumeric().withMessage('Tasker Id is required'),
    check('content').notEmpty().withMessage('Content is required').isLength({ max: 500}).withMessage('Content must be less than 500 characters'),
    check('price').optional().isNumeric().withMessage('Price must be a number'),
    validationMiddleware
]
import validationMiddleware from "@/Presentation/middlewares/validation.middleware";
import { check, query } from "express-validator";

export const tasksSearchValidate = [
query('q').notEmpty().withMessage('q is required').isString(),
query('skills').optional().isString().withMessage('skills must be a string seperated by comma'),
query('minBudget').optional().isNumeric().toFloat().withMessage('minBudget must be a number'), 
query('maxBudget').optional().isNumeric().toFloat().withMessage('maxBudget must be a number').custom((value, { req }) => {
    if(req.query?.minBudget && req.query?.minBudget> value)
        throw new Error('maxBudget must be greater than minBudget');
    return true;
}),
query('status').optional().isIn(['open', 'closed', 'completed', 'cancelled', 'pending']).withMessage('status must be one of open, closed, completed, cancelled, pending'),
query('sortBy').optional().isIn(['relevance', 'newest', 'budget']).withMessage('sortBy must be one of relevance, newest, budget'),
query('fields').optional().isString().withMessage('fields must be a string'),
validationMiddleware
]
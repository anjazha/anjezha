import validationMiddleware from "@/Presentation/middlewares/validation.middleware";
import { check, query } from "express-validator";

export const tasksSearchValidate = [
query('q').optional().isString().withMessage('q must be a string'),
query('skills').optional().isString().withMessage('skills must be a string seperated by comma'),
query('minBudget').optional().isNumeric().toFloat().withMessage('minBudget must be a number'), 
query('maxBudget').optional().isNumeric().toFloat().withMessage('maxBudget must be a number').custom((value, { req }) => {
    if(req.query?.minBudget && req.query?.minBudget> value)
        throw new Error('maxBudget must be greater than minBudget');
    return true;
}),
query('status').optional().isIn(['open', 'closed', 'completed', 'cancelled', 'pending']).withMessage('status must be one of open, closed, completed, cancelled, pending'),
query('category').optional().isNumeric().toInt().withMessage('category must be a number'),
query('sortBy').optional().isIn(['relevance', 'newest', 'budget']).withMessage('sortBy must be one of relevance, newest, budget'),
query('fields').optional().isString().withMessage('fields must be a string'),
validationMiddleware
]


export const taskerSearchValidate = [
        query('q').optional().isString().withMessage('q must be a string'),
        query('skills').optional().isString().withMessage('skills must be a string seperated by comma'),
        query('minBudget').optional().isNumeric().toFloat().withMessage('minBudget must be a number'),
        query('maxBudget').optional().isNumeric().toFloat().withMessage('maxBudget must be a number').custom((value, { req }) => {
            if(req.query?.minBudget && req.query?.minBudget> value)
                throw new Error('maxBudget must be greater than minBudget');
            return true;
        }),

        query('sortBy').optional().isIn(['relevance', 'newest', 'budget']).withMessage('sortBy must be one of relevance, newest, budget'),
        query('minRating').optional().isNumeric().toFloat().withMessage('minRating must be a number'),
         query('maxRating').optional().isNumeric().toFloat().withMessage('maxRating must be a number').custom((value, { req }) => {
            if(req.query?.minRating && req.query?.minRating> value)
                throw new Error('maxRating must be greater than minRating');
            return true;
        }),
        // query('fields').optional().isString().withMessage('fields must be a string'),
        validationMiddleware
]
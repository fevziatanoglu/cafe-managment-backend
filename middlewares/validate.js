import { validationResult } from 'express-validator';
import { sendError } from '../utils/responseHandler.js';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => ({
            field: err.param,
            message: err.msg
        }));

        return sendError(res, 'Validation failed', extractedErrors, 422);
    }

    next();
};

import {Request, Response, NextFunction} from 'express'
import ErrorHandler from '../config/ErrorHandler';


const error = (err:any, req: Request, res: Response, next:NextFunction) => {
    err.message = err.message || 'Server internal error',
    err.statusCode = err.statusCode || 500


    //Other errors her
    let message;
    if(err.name === 'TokenExpiredError'){
        message = "JWT expired, Try again later"
        err = new ErrorHandler(message, err.statusCode)
    }


     return res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
export default error
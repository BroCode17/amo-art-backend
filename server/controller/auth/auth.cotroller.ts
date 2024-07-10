import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction, Request } from "express";
import CatchAsyncFunction from "../../config/CatchAsyncError";
import ErrorHandler from "../../config/ErrorHandler";
import userModel from '../../model/user.model';




const authUser = CatchAsyncFunction( async (req: Request, res:Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;;

    //check for validation
    if(!accessToken){
        //Forbidden
        return next(new ErrorHandler('Login to access to access this route', 403))
     
    }

    //verify with the refresh
    const decode = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN!,
    ) as JwtPayload
    if(!decode){
        return next(new ErrorHandler('Login to access to access this route', 403))
    }

    const userId = decode.id;
    const user  = await userModel.findById(userId);

    if(!user){
        return next(new ErrorHandler('Login to access to access this route', 403))
    }
    //user exist --- 
    req.user = user;

    next()
})

export const authUserRole = (...role: string[]) => {
    return  (req: Request, res: Response, next:NextFunction) => {
        if(!role.includes(req.user?.role!) || ''){
            return next(new ErrorHandler('Permission deniel', 403))
        }
        next();
    }
}



export default authUser
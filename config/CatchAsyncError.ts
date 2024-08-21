import { NextFunction, Request, Response } from 'express';



const CatchAsyncFunction = (func:any) => 
  (req:Request, res:Response, next:NextFunction) => {
        func(req, res, next).catch((err:any) => next(err))
    // }
   // Promise.resolve(func(req, res, next)).catch(next)
  }

export default CatchAsyncFunction
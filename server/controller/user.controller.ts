import  jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import CatchAsyncFunction from "../config/CatchAsyncError";
import ErrorHandler from "../config/ErrorHandler";
import userModel from "../model/user.model";
import { TokenAndActivationCodeGenerator } from "../utils/tokenGenerator";
import { ActivateUserInterface, LoginInterface, RegisterUserInterface } from "../types";
import sendMail from "../utils/sendMail";
import sendToken from '../utils/sendToken';

export const registerUser = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password }: RegisterUserInterface =
        req.body;

      if (!firstName || !lastName || !email || !password) {
        //Bad requesti
        return next(new ErrorHandler("All field are required", 400));
      }

      //check in the db if user exist
      const isUserExist = await userModel.findOne({ email });

      if (isUserExist) {
        //conflict
        return res.sendStatus(409); //user already exist
      }

      const newUser: RegisterUserInterface = {
        firstName,
        lastName,
        email,
        password,
      };
      //create tokens
      const { accessToken, activationCode } =
        TokenAndActivationCodeGenerator(newUser);

      //send email
      sendMail({
        email,
        subject: "Verification",
        template: "activation_mail.ejs",
        data: { user: { name: `${firstName} ${lastName}` }, activationCode },
      });

      res.status(201).json({
        success: true,
        accessToken,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);


//activate user
export const activateUser = CatchAsyncFunction( async (req:Request, res: Response, next: NextFunction) => {
    const {accessToken, activationCode}: ActivateUserInterface = req.body

    if(!accessToken || !activationCode){
        //bad request
        return res.sendStatus(400);
    }

    //verify jwt
    const decode = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN!,
    ) as JwtPayload

    if(!decode){
        //Unauthorized
        return res.sendStatus(401)
    }

    //check for code matches
    if(decode.activationCode !== activationCode){
        return next(new ErrorHandler('Invalid Activation Code', 403))
    }

    //create
    const user = decode.user
    //console.log(user)
    await userModel.create(user)

    res.status(201).json({
        success: true,
    })
})

//Login user
export const loginUser = CatchAsyncFunction( async (req: Request, res: Response, next: NextFunction) => {
  const {email, password}: LoginInterface = req.body;  

  //Validation
  if(!email || !password){
    //Bad request
    return next(new ErrorHandler('All field are required', 400))
  }

  //find use in db
  const isUserExist = await userModel.findOne({email}).select('+password');

  if(!isUserExist){
    //Not found
    return next(new ErrorHandler('User does not exist', 404))
  }

  //check for password
  if(!isUserExist.comparePasswrod(password)){
    //password do not match
    //Forbidden
    return next(new ErrorHandler('Invalid password', 403))
  }

  //auth user
  sendToken(res, 201, isUserExist)
})

//Logout User
export const logoutUser = CatchAsyncFunction( async (req: Request, res:Response, next: NextFunction) => {
    //clear cookies
    res.cookie('access_token', '', {maxAge: 1})
    res.cookie('refersh_token', '', {maxAge: 1});

    //Don't forget to delete from redis if redis is implemented
    res.status(201).json({
        success: true,
        message: 'Logged out successfully'
    })
})
//update user accessToken

export const updateUserAccessToken = CatchAsyncFunction( async (req: Request, res: Response, next: NextFunction) => {
    //get refresh token
    const refreshToken = req.cookies.refresh_token;

    // if refreshToken is underfined
    
    if(!refreshToken){
        //Forbidden
        return next(new ErrorHandler('Please, Login to access this route', 403))
    }
    //decode token
    const decode = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN!,
    ) as JwtPayload;
    
    //Token is underfined
    if(!decode){
        return next(new ErrorHandler('Please, Login to access this route', 403))
    }

    //get user id
    const userId = decode.id;

    //find user in db
    const isUserExist = await userModel.findById(userId);

    //user do not exist
    if(!isUserExist){
        //User not found -> Maybe admin deleted the user
        return next(new ErrorHandler('User do not exist', 404))
    }
    //if user exist
    //call send token method to generate new access/refresh tokne
    sendToken(res, 201, isUserExist!)
})
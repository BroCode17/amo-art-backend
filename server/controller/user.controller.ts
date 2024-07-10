import  jwt, { JwtPayload } from 'jsonwebtoken';
import e, { Request, Response, NextFunction } from "express";
import CatchAsyncFunction from "../config/CatchAsyncError";
import ErrorHandler from "../config/ErrorHandler";
import userModel from "../model/user.model";
import { TokenAndActivationCodeGenerator } from "../utils/tokenGenerator";
import { ActivateUserInterface, LoginInterface, RegisterUserInterface, UpdateUserInfo } from "../types";
import sendMail from "../utils/sendMail";
import sendToken from '../utils/sendToken';
import { getAllUsers } from '../service/user.services';

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

//update user info

export const getUserInfo = CatchAsyncFunction( async (req: Request, res: Response, next: NextFunction) => {
     const userId = req.user?._id;

     if(!userId){
        //Unauthorized
        return res.sendStatus(401)
     }

     const user = await userModel.findById(userId);
     if(!user){
       //If possible log the use out
       return next(new ErrorHandler('User Not Found', 404));
     }

     res.status(200).json(user)
})

//update User info
export const updateUserInfo = CatchAsyncFunction( async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  const{email}: UpdateUserInfo = req.body;


  const isEmailExist = await userModel.findOne({email});
  if(isEmailExist){
    //Bad request
    return next(new ErrorHandler('Email Already exist', 400));
  }

  //update user;
  const user = await userModel.findById(userId);
  if(!user){
    return res.sendStatus(404)
  }
  user.email = email;

  await user?.save();

  //redis
  res.status(201).json({
    success: true,
    user
  })
})


//update user password
export const updateUserPassword = CatchAsyncFunction( async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  const {oldPassword, password}: UpdateUserInfo = req.body;

  const user = await userModel.findById(userId).select('+password');
  if(!user){
    return res.sendStatus(404)
  }

  if(!user.comparePasswrod(oldPassword)){
    //Bad request
    return next(new ErrorHandler('Old password do not match', 400));
  }

  //update user;
  //hash the password
  
  user.password = password;

  await user?.save();

  //redis
  res.status(201).json({
    success: true,
    user
  })
})


// --------------Only for Admin-------------------
export const allUsers = CatchAsyncFunction( async (req: Request, res: Response, next:NextFunction) => {
  const users = await getAllUsers();

  res.status(200).json({
    success: true,
    user: users,
  })
})
import  jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import CatchAsyncFunction from "../config/CatchAsyncError";
import ErrorHandler from "../config/ErrorHandler";
import userModel from "../model/user.model";
import { TokenAndActivationCodeGenerator } from "../utils/tokenGenerator";
import { ActivateUserInterface, RegisterUserInterface } from "../types";
import sendMail from "../utils/sendMail";

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
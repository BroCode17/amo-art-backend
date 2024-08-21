import { Response } from "express";
import { CookieTokenOptions, UserInterface } from "../types";

//Fallback
//expires in 5 days
const accessTokenExpires = parseInt(process.env.ACESS_TOKEN_EXPIRE || '300', 10)

// expires in 3 days
const refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10)

  // cookie option
  export const accessTokenOptions: CookieTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpires * 60 *  60* 1000),
    maxAge: accessTokenExpires  * 60 *  60* 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true
  };


  export const refreshTokenOptions: CookieTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpires *24 * 60 *  60* 1000),
    maxAge: refreshTokenExpires  * 24 * 60 *  60* 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true
  };


const sendToken = (res:Response, statusCode: number, user: UserInterface, showUser?: boolean ) => {
    //generate access token
    const accessToken = user.SignAccessToken();
    const refreshToken = user.RefreshAccessToken();

  
    //For production 
    if(process.env.NODE_ENV === 'prod'){
       
       // accessTokenOptions.secure = true
    }
  

    // //For production 
    // if(process.env.NODE_ENV = 'prod'){
    //     refreshTokenOptions.httpOnly = true
    //     refreshTokenOptions.sameSite = 'lax'
    //    // refreshTokenOptions.secure = true
    // }


    //save in cookies
    // console.log('Refresh', refreshTokenOptions)
    res.cookie('accessToken', accessToken, accessTokenOptions)
    res.cookie('refresh_token', refreshToken, refreshTokenOptions);


   

   console.log('sendToken-fun')
    res.status(statusCode).json({
        success: true,
        accessToken,
        user: showUser ?
         {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            _id: user._id
        } : null
    
    })
   // res.status(statusCode).json({user: 'Ebenezer'})

}
export default sendToken;
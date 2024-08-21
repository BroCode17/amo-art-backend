import { RegisterUserInterface } from "../types";
import jwt from 'jsonwebtoken'

export const TokenAndActivationCodeGenerator =  (user: RegisterUserInterface) => {
    //generate code
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString() // generate 6 digits number in string format
    
    //generate accessToken
    const accessToken = jwt.sign(
        {user, activationCode}, 
        process.env.ACCESS_TOKEN!,
        {expiresIn: '5m'}
    )

    return {accessToken, activationCode}
}
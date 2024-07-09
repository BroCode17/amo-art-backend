import  jwt  from 'jsonwebtoken';
import { UserInterface } from './../types/index.d';
import mongoose, {Document, Model} from "mongoose";
import bcrypt from 'bcryptjs'



const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const userSchema = new mongoose.Schema<UserInterface>(
    {
        firstName: {
            type: String,
            required: [true, 'Enter your first name']
        },
        lastName: {
            type: String,
            required: [true, 'Enter your last name'],
        },
        email: {
            type: String,
            required: [true, 'Enter your email'],
            validate:{
                validator:  (emailValue: string) => {
                    return emailRegexPattern.test(emailValue)
                },
                message: 'Enter a valid email address'
            }
        },
        password: {
            type: String,
            required: [true, 'Enter your password'],
            select: false
        },
        role: {
            type: String,
            default: 'user'
        }

    }
) 


userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        //hash pasword
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    next();
})

userSchema.methods.comparePasswrod = async function(passwordValue: string){
    return await bcrypt.compare(passwordValue, this.password)
}

userSchema.methods.SignAccessToken = function(){
    return jwt.sign(
        {id: this._id},
        process.env.ACCESS_TOKEN!,
        {expiresIn: '5m'}
    )
}

userSchema.methods.RefreshAccessToken = function(){
    return jwt.sign(
        {id: this._id},
        process.env.REFRESH_TOKEN!,
        {expiresIn: '3d'}
    )
}


const userModel:Model<UserInterface> =  mongoose.model('User', userSchema)

export default userModel


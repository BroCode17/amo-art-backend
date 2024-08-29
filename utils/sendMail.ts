import nodemailer, {Transporter} from 'nodemailer'
import { EmailOptions } from '../types'
import path from 'path'
import ejs from 'ejs'
import ErrorHandler from '../config/ErrorHandler'
import { NextFunction, Response } from 'express'

interface EmailInteface {
    options: EmailOptions,
    next: NextFunction,
    res?: Response
}

const sendMail = async ({options, next, res}:EmailInteface) => {
   
    try {
        const transport: Transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })
        const filePath = path.join(__dirname, '../mail', options.template);
        const prices = options.data.products.map((p:any,index:number) => p.product.variants.find((variant:any) => variant.name === p.itemSize).price)

        //  const newData = {data: options.data, prices}
        // // console.log(ans)
        // res?.status(201).json(newData)
        // return;
        const html:string  = await ejs.renderFile(filePath, {data: options.data, prices})
        const mailOptions = {
            from: process.env.SMTP_MAIL!,
            to: options.email,
            subject: options.subject,
            html
        }
      await transport.sendMail(mailOptions)
        if(res)
            res?.status(201).json({sucess:true});   
    } catch (error: any) {
        console.log(error)
        return next(new ErrorHandler(error, 500))
      
    }
}

export default sendMail
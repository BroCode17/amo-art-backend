import nodemailer, {Transporter} from 'nodemailer'
import { EmailOptions } from '../types'
import path from 'path'
import ejs from 'ejs'

const sendMail = async (options: EmailOptions) => {
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

    const html:string  = await ejs.renderFile(filePath, options.data)
    const mailOptions = {
        from: process.env.SMTP_MAIL!,
        to: options.email,
        subject: options.subject,
        html
    }
    try {
        await transport.sendMail(mailOptions)

    } catch (error: any) {
        console.log(error)
    }
}

export default sendMail
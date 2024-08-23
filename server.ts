import "dotenv/config";
import express from "express";
import { Request, Response, NextFunction } from "express";
import connectDB from "./config/connectDb";
import mongoose from "mongoose";
import userRoute from "./router/user.route";
import error from "./middleware/error";
import cookieParser from "cookie-parser";
import cors from 'cors'
import {v2 as cloudinary} from 'cloudinary'
import homeRoute from "./router/homepage.route";
import productRoute from "./router/product.route";
import orderRouter from "./router/order.route";
import imageRoute from "./router/image.route";
const app = express();


//Database
connectDB();


//config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

// var corsOptions = function(req:Request, res:Response, next: NextFunction){ 
//   res.header('Access-Control-Allow-Origin', '*'); 
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 
//   'Content-Type, Authorization, Content-Length, X-Requested-With');
//    next();
// }


// var corsOptions = {
//   origin: ['http://localhost:3000', 'https://art-cvpms6e2x-ebenezer-frimpongs-projects.vercel.app/','192.168.4.132', '173.240.202.1' ],
//   optionsSuccessStatus: 200,
//   credential: true // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// const corsOptions = {
//   origin: '*', // Allows all origins
//   methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'], // Allows these HTTP methods
//   allowedHeaders: 'Content-Type, Authorization', // Allows these headers
//   credentials: true
// };

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// })
// app.use(cors(corsOptions))
app.use(cors({
  origin: ['http://localhost:3000','https://art-r2dv2b1he-ebenezer-frimpongs-projects.vercel.app', 'https://art-eight-indol.vercel.app', "https://amoarte.online/"], // Replace with your frontend URL
  credentials: true, // Allow cookies and credentials to be sent
}));
app.use(express.json({limit: '50mb'}))
app.use(cookieParser())

app.use('/api/v1/user', userRoute)
app.use('/api/v1/homepage', homeRoute)
app.use('/api/v1/layout', imageRoute)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/orders', orderRouter)

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello");
});

mongoose.connection.once("open", () => {
  app.listen(5050, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});


app.use(error)
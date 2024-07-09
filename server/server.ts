import "dotenv/config";
import express from "express";
import { Request, Response, NextFunction } from "express";
import connectDB from "./config/connectDb";
import mongoose from "mongoose";
import userRoute from "./router/user.route";
import error from "./middleware/error";
import cookieParser from "cookie-parser";
import cors from 'cors'
//Database




connectDB();

const app = express();


app.use(express.json({limit: '50mb'}))
app.use(cookieParser())

app.use('/api/v1/user', userRoute)

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello");
});

mongoose.connection.once("open", () => {
  app.listen(process.env.PORT || 5050, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});


app.use(error)
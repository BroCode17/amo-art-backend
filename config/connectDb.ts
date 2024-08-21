import mongoose from "mongoose";
import CatchAsyncFunction from "./CatchAsyncError";

const connectDB = () => {
  try {
    mongoose
      .connect(process.env.MONGODB_URL!)
      .then((data: any) => {
        console.log(`Db connected on ${data.connection.host}`);
      })
      .catch((err: any) => console.log('fun -> connectDB: ', err));
  } catch (error) {
    setTimeout(() => {
        connectDB()
    }, 10000);
  }
};

export default connectDB;

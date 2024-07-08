import mongoose from "mongoose";
import CatchAsyncFunction from "./CatchAsyncError";


const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL!).then((data: any) => {
        console.log(`Db connected on ${data.connection.host}`)
    }).catch((err:any) => console.log(err))
}

export default connectDB
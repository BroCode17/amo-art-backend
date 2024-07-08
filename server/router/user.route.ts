import express from 'express';
import { registerUser, activateUser } from '../controller/user.controller';
const userRoute = express.Router();


userRoute.post('/register', registerUser)
userRoute.post('/activate-user', activateUser)

export default userRoute
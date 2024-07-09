import express from 'express';
import { registerUser, activateUser, loginUser, logoutUser, updateUserAccessToken } from '../controller/user.controller';
import authUser from '../controller/auth/auth.cotroller';
const userRoute = express.Router();


userRoute.post('/register', registerUser)
userRoute.post('/activate-user', activateUser)
userRoute.post('/login', loginUser);
userRoute.get('/logout', authUser, logoutUser)
userRoute.get('/update-token', updateUserAccessToken)

export default userRoute
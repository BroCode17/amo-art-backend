import express from 'express';
import { registerUser, activateUser, loginUser, logoutUser, updateUserAccessToken, allUsers, getUserInfo, updateUserInfo, sendUserRequestToAdmin } from '../controller/user.controller';
import authUser, { authUserRole } from '../controller/auth/auth.cotroller';
const userRoute = express.Router();


userRoute.post('/register', registerUser)
userRoute.post('/activate-user', activateUser)
userRoute.post('/login', loginUser);
userRoute.get('/logout', authUser, logoutUser)
userRoute.get('/update-token', updateUserAccessToken)
userRoute.post('/user-request', sendUserRequestToAdmin)
userRoute.get('/user-info', authUser, getUserInfo)
userRoute.put('/update-user',authUser,  updateUserInfo)

//admin
userRoute.get('/all',authUser,authUserRole(''), allUsers)

export default userRoute
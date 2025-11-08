import { Router } from "express";
import { checkLogin, checkLogout } from "../middleware/auth.middleware";
import userController from "../controllers/user.controller";

const userRouter = Router()

userRouter.post('/signup', checkLogout, userController.addUser)
userRouter.post('/login', checkLogout, userController.loginUser)
userRouter.get('/logout', checkLogin, userController.logout)
userRouter.get('/check-auth', checkLogin, userController.getUserByUsername)

export default userRouter
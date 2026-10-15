import { Router } from "express";

import { container } from "../../container/container.js";
import { UserController } from "../controllers/UserController.js";
import { HttpStatus } from "../../constants/httpStatus.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = Router();
const userController = container.resolve(UserController);

userRouter.post("/signup", userController.signUp);
userRouter.post("/signin", userController.signIn);
userRouter.get("/me", authMiddleware, userController.getMe);



export default userRouter;

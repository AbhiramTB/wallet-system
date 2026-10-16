import { Router } from "express";

import { container } from "../../container/container.js";
import { UserController } from "../controllers/UserController.js";
import { HttpStatus } from "../../constants/httpStatus.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { rateLimitMiddleware } from "../middleware/rateLimitMiddleware.js";

const userRouter = Router();
const userController = container.resolve(UserController);

userRouter.post("/signup", userController.signUp);
userRouter.post("/signin", userController.signIn);
userRouter.get("/me", authMiddleware,rateLimitMiddleware, userController.getMe);



export default userRouter;

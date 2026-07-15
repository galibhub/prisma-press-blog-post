import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import auth from "../../middlewares/auth";

const router = Router();



router.post("/register", userController.registerUser);



//get user profile
// router.get(
//   "/me",
// //   (req: Request, res: Response, next: NextFunction) => {
// //     console.log(req.cookies);

// //     const { accessToken } = req.cookies;
// //     console.log(accessToken);

// //     const verifiedToken = jwtUtils.verifyToken(
// //       accessToken,
// //       config.jwt_access_secret,
// //     );

// //     if (!verifiedToken.success) {
// //       throw new Error(verifiedToken.error);
// //     }

// //     //check roles
// //     const { email, id, name, role } = verifiedToken.data as JwtPayload;
// //     // const requiredRoles =["ADMIN","USER","AUTHOR"]
// //     const requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER];
// //     if (!requiredRoles.includes(role)) {
// //       return res.status(403).json({
// //         success: false,
// //         statusCode: httpStatus.FORBIDDEN,
// //         message: "Forbidden. You dont have permission tp access this resource",
// //       });
// //     }

// //     req.user = {
// //       email,
// //       name,
// //       id,
// //       role,
// //     };

// //     next();
// //   },
//   userController.getMyProfle,
// );

router.get(
  "/me",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  userController.getMyProfle,
);

export const userRoutes = router;

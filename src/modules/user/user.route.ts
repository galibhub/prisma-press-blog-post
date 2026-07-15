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

const router = Router();

//global type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};

router.post("/register", userController.registerUser);

//auth(Role.ADMIN, Role.AUTHOR, Role.USER)
//auth()=> ...requiredRoles  => [Role.ADMIN, Role.AUTHOR, Role.USER]
const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization);

    if (!token) {
      throw new Error(
        "You are not logged in. Please login to access this resource",
      );
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { email, id, name, role } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource",
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
        name,
        id,
        role,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.activeStatus === "BLOCKED") {
      throw new Error("Your account has been blocked.Please contact support");
    }

    req.user = {
      email,
      name,
      id,
      role,
    };

    next();
  });
};

export default auth;

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

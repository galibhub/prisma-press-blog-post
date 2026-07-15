import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";

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

//get user profile
router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies);

    const { accessToken } = req.cookies;
    console.log(accessToken);

    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );
    console.log(verifiedToken);

    if (typeof verifiedToken === "string") {
      throw new Error(verifiedToken);
    }

    //check roles
    const { email, id, name, role } = verifiedToken;
    // const requiredRoles =["ADMIN","USER","AUTHOR"]
    const requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER];
    if (!requiredRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "Forbidden. You dont have permission tp access this resource",
      });
    }
    
    req.user ={
        email,
        name,
        id,
        role
    }


    next();
  },
  userController.getMyProfle,
);

export const userRoutes = router;

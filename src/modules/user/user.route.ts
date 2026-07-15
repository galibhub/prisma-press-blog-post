import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);

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
            success:false,
            statusCode:httpStatus.FORBIDDEN,
            message:"Forbidden. You dont have permission tp access this resource"
        })
    }

    next();
  },
  userController.getMyProfle,
);

export const userRoutes = router;

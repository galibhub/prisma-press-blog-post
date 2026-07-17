import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

//error handler higher-order-function

// import { NextFunction, Request, RequestHandler, Response } from "express";
// import httpStatus  from 'http-status';

// export const catchAsync = (fn: RequestHandler) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//       res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//         message: "Something went wrong",
//         error: (error as Error).message,
//       });
//     }
//   };
// };

// const registerUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;

//     const user = await userService.registerUserIntoDb(payload);

//     res.status(httpStatus.CREATED).json({
//       success: true,
//       statusCode: httpStatus.CREATED,
//       message: "User Created Successfully",
//       data: {
//         user,
//       },
//     });
//   } catch (error) {}
// };

//send response for response handeling

// type TMeta ={
//         page:number;
//         limit:number;
//         total:number
// }

// type TResponseData<T>={
//     success:boolean;
//     statusCode:number;
//     message:string;
//     data: T;
//     meta ? : TMeta
// }

// const sendResponse =<T>(res:Response,data:TResponseData<T>)=>{
//   res.status(data.statusCode).json({
//     success:data.success,
//     statusCode:data.statusCode,
//     message:data.message,
//     data:data.data,
//     meta:data.meta
//   })
// }

//=> Register user
const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userService.registerUserIntoDb(payload);
    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   statusCode: httpStatus.CREATED,
    //   message: "User Created Successfully",
    //   data: {
    //     user,
    //   },
    // });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: { user },
    });
  },
);

//get my profile

const getMyProfle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //  const cookies = req.cookies;
    // const { accessToken } = req.cookies;
    // console.log(req.user,"User request");

    // const verifiedToken = jwtUtils.verifyToken(
    //   accessToken,
    //   config.jwt_access_secret,
    // );
    // console.log(verifiedToken);

    // if (typeof verifiedToken === "string") {
    //   throw new Error(verifiedToken);
    // }

    // const profile = await userService.getMyProfileFromDB(verifiedToken.id);
    const profile = await userService.getMyProfileFromDB(req.user?.id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile fetched successfully",
      data: {
        profile,
      },
    });
  },
);






//update my profile
const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedProfile = await userService.updateMyProfileIntoDB(
      userId,
      payload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile updated successfully",
      data: {updatedProfile},
    });
  }
);









export const userController = {
  registerUser,
  getMyProfle,
  updateMyProfile,
  
};

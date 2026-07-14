import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

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
const registerUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
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
    sendResponse(res,{
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: {user,}
    })
})

export const userController = {
  registerUser,
};

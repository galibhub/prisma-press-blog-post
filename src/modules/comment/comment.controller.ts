import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus  from 'http-status';





//=> Create or Post Comment API
const createComment = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.id as string;

  const result = await commentService.createComment(
    authorId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment created successfully",
    data: result,
  });
});




const getCommentByAuthorId = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

})







const getCommentByCommentId = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

})





const updateComment = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

})





const deleteComment = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

})





const moderateComment = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

})





export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}
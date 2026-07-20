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




//=> Get all comments by Author ID
const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response) => {

    const authorId = req.params.authorId as string;

    const result = await commentService.getCommentByAuthorId(authorId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments retrieved successfully",
      data: result,
    });

  }
);






//=> get comment by comment Id
const getCommentByCommentId = catchAsync(
  async (req: Request, res: Response) => {

    const commentId = req.params.commentId as string; ;

    const result = await commentService.getCommentByCommentId(commentId);

    sendResponse(res,{
      success:true,
      statusCode:httpStatus.OK,
      message:"Comment retrieved successfully",
      data:result
    });

  }
);





//=> Update Comment
const updateComment = catchAsync(
  async (req: Request, res: Response) => {

    const authorId = req.user?.id as string;
    const commentId = req.params.commentId as string;

    const result = await commentService.updateComment(
      authorId,
      commentId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment updated successfully",
      data: result,
    });

  }
);





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
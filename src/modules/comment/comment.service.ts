import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload } from "./comment.interface";



const createComment = async (
  authorId: string,
  payload: ICreateCommentPayload
) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
  });

  return comment;
};










const getCommentByAuthorId = () => {

}

const getCommentByCommentId = async (
  commentId:string
) => {

  const result = await prisma.comment.findUniqueOrThrow({

    where:{
      id:commentId
    },

    include:{

      author:{
        select:{
          id:true,
          name:true,
          email:true
        }
      },

      post:{
        select:{
          id:true,
          title:true
        }
      }

    }

  });

  return result;

};

const updateComment = () => {

}

const deleteComment = () => {

}

const moderateComment = () => {

}

export const commentService = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}
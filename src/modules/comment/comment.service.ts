import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload } from "./comment.interface";

const createComment = async (
  authorId: string,
  payload: ICreateCommentPayload,
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

const getCommentByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },

    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getCommentByCommentId = async (commentId: string) => {
  const result = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },

    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return result;
};

//=>update comment API
const updateComment = async (
  authorId: string,
  commentId: string,
  payload: {
    content: string;
  },
) => {
  // Comment exists কিনা
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  // Ownership check
  if (comment.authorId !== authorId) {
    throw new Error("You are not authorized to update this comment");
  }

  // Update
  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: payload.content,
    },
  });

  return result;
};

//=>Delete comment
const deleteComment = async (authorId: string, commentId: string) => {
  // Comment exists
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  // Ownership check
  if (comment.authorId !== authorId) {
    throw new Error("You are not authorized to delete this comment");
  }

  // Delete
  const result = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return result;
};

import { CommentStatus } from "../../../generated/prisma/enums";

const moderateComment = async (
  commentId: string,
  payload: {
    status: CommentStatus;
  },
) => {
  await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status: payload.status,
    },
  });

  return result;
};

export const commentService = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};

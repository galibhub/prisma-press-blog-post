import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

//create post
const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

//get all post
const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return posts;
};

//get post by id
const getPostById = async (postId: string) => {
  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  // });

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  const post = await prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: {
        where: {
          status: CommentStatus.APPROVED,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return post;
};

//update post
const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authId) {
    throw new Error("You are not the owner of this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return result;
};

//delete post
const deletePost = async (postId: string, authId: string, isAdmin: boolean) => {
  const post = await prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authId) {
    throw new Error("You are not the owner of this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

//get my post
const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return result;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
};

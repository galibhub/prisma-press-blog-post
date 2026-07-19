import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
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

  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });

  // const post = await prisma.post.findFirstOrThrow({
  //   where: {
  //     id: postId,
  //   },

  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: {
  //       where: {
  //         status: CommentStatus.APPROVED,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     },
  //     _count: {
  //       select: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });

  // return post;

  //-=====transanction - rollback

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // throw new Error("Fake")

    const post = await tx.post.findUniqueOrThrow({
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
  });

  return transactionResult;
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

const getPostsStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const totalPosts = await tx.post.count();
    const totalPublishedPost = await tx.post.count({
      where: {
        status: PostStatus.PUBLISHED,
      },
    });

    const totalDraftPosts = await tx.post.count({
      where: {
        status: PostStatus.DRAFT,
      },
    });

    const totalArchivedPosts = await tx.post.count({
      where: {
        status: PostStatus.ARCHIVED,
      },
    });
    const totalComments = await tx.comment.count();
    const totalApprovedComments = await tx.comment.count({
      where: {
        status: CommentStatus.APPROVED,
      },
    });

    const totalRejectedComments = await tx.comment.count({
      where: {
        status: CommentStatus.REJECT,
      },
    });
    // total view count - not a good approch
    // const allPosts = await tx.post.findMany();
    // let totalPostViews = 0;

    // allPosts.forEach((post)=>{
    //   totalPostViews = totalPostViews + post.views
    // })


    //totalpostview using aggregate 
    const totalPostViewsAggregate = await tx.post.aggregate({
      _sum: {
        views: true,
      },
    });

    const totalPostViews = totalPostViewsAggregate._sum.views;

    return {
      totalPosts,
      totalPublishedPost,
      totalArchivedPosts,
      totalDraftPosts,
      totalApprovedComments,
      totalComments,
      totalRejectedComments,
      totalPostViews,
    };
  });

  return transactionResult;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  getPostsStats,
};

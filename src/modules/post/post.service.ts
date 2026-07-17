import { prisma } from "../../lib/prisma"
import { ICreatePostPayload } from "./post.interface"



//create post
const createPost = async (payload: ICreatePostPayload,userId:string) => {
    const result = await prisma.post.create({
        data:{
            ...payload,
            authorId:userId
        }
    })
    return result
}


//get all post
const getAllPosts = async () => {
    const posts = await prisma.post.findMany(
        {
            include:{
                author:{
                    omit:{
                        password:true
                    }
                },
                comments:true
            }
        }
    );
    return posts
}

//get post by id
const getPostById = async (postId : string) => {

    
}


//update post
const updatePost = async () => {
    
}

//delete post
const deletePost = async () => {
  
}

//get my post
const getMyPosts = async (authorId : string) => {

    

}

export const postService = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
  
}
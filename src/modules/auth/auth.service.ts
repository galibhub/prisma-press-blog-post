import { prisma } from "../../lib/prisma";
import { IloginUser } from "./auth.interface"
import  bcrypt  from 'bcryptjs';

const loginUser =async(payload:IloginUser)=>{
    const  {email,password}= payload;

    // const user = await prisma.user.findUnique({
    //     where:{email}
    // })

    // if(!user){
    //     throw new Error("User not found");
    // }

    const user = await prisma.user.findUniqueOrThrow({
        where:{email}
    })

    const isPasswordMatched = await bcrypt.compare(password , user.password);
    if(!isPasswordMatched){
        throw new Error("Password is incorrect");
    }
    return user;
}

export const authService ={
    loginUser
}
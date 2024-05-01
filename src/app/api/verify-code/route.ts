import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";


export async function POST(request : Request){
    await dbConnect()
    try{
        const {code, username} = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({
            username : decodedUsername
        })

        if(!user){
            return Response.json({
                success : false,
                message : "User not found"
            },
            {
                status : 500
            })
        }

        const isCodeValid = user.verifyCode === code && user.verifyCodeExpiry > new Date()

        if(isCodeValid){
            user.isVerified = true
            await user.save()
            return Response.json({
                success : true,
                message : "User verified"
            },{status : 200}
        )}
        
        return Response.json({
            success : false,
            message : "Invalid code"
        },{status : 400})
    
    }catch(error){
        console.log("Error verifying code", error)
        return Response.json({
            success : false,
            message : 'Internal server error'
        },{status : 500})
    }
}
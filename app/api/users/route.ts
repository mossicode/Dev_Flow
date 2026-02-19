import { NextResponse } from "next/server";
import User from "../../../database/user.model";
import handleError from "../../../lib/handlers/error";
import { connectDB } from "../../../lib/mongodb";
import { APIErrorResponse } from "../../../types/global";
import { UserSchema } from "../../../lib/validation";
import { ValidationError } from "../../../lib/http-errors";
import { success } from "zod";

export async function GET() {
    try {
        await connectDB();
        const users=await User.find();
        return NextResponse.json({success:true, data:users}, {status:200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}
export async function POST(request:Request){
    try {
        await connectDB();
        const body=await request.json();
        const validationData=UserSchema.safeParse(body);
        if(!validationData.success){
            throw new ValidationError(validationData.error.flatten().fieldErrors)
        }
        const {email, username}=validationData.data;

        const existingUser=await User.findOne({email});
        if(existingUser) throw new Error("User already exists");

        const existingUserName=await User.findOne({username});
        if(existingUserName) throw new Error("UserName already exists. ");
        const newUser= await User.create(validationData.data);
        return NextResponse.json({success:true, data:newUser}, {status:201});
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
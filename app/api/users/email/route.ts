import { NextResponse } from "next/server";
import handleError from "../../../../lib/handlers/error";
import { NotfoundError, ValidationError } from "../../../../lib/http-errors";
import { connectDB } from "../../../../lib/mongodb";
import { UserSchema } from "../../../../lib/validation";
import User from "../../../../database/user.model";
import { APIErrorResponse } from "../../../../types/global";

export async function POST(request:Request){
    const {email}=await request.json();
    try {
        await connectDB();
        const validationData=UserSchema.safeParse({email});
        if(!validationData.success){
            throw new ValidationError(validationData.error.flatten().fieldErrors)
        }
        const user=await User.findOne({ email });
        if(!user) throw new NotfoundError("User")
        return NextResponse.json({success:true, data:user}, {status:201});
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
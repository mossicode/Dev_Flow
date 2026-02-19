import { NextResponse } from "next/server";
import handleError from "../../../../lib/handlers/error";
import { NotfoundError, ValidationError } from "../../../../lib/http-errors";
import { connectDB } from "../../../../lib/mongodb";
import { AccountSchema } from "../../../../lib/validation";
import { APIErrorResponse } from "../../../../types/global";
import Account from "../../../../database/account.model";

export async function POST(request:Request){
    const {providerAccountId}=await request.json();
    try {
        await connectDB();
        const validationData=AccountSchema.safeParse({providerAccountId});
        if(!validationData.success){
            throw new ValidationError(validationData.error.flatten().fieldErrors)
        }
        const account=await Account.findOne({ providerAccountId });
        if(!account) throw new NotfoundError("User")
        return NextResponse.json({success:true, data:account}, {status:201});
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
import { NextResponse } from "next/server";
import handleError from "../../../lib/handlers/error";
import { connectDB } from "../../../lib/mongodb";
import { APIErrorResponse } from "../../../types/global";
import { AccountSchema } from "../../../lib/validation";
import { ForbiddenError } from "../../../lib/http-errors";
import Account from "../../../database/account.model";

export async function GET() {
    try {
        await connectDB();
        const accounts=await Account.find();
        return NextResponse.json({success:true, data:accounts}, {status:200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}
export async function POST(request:Request){
    try {
        await connectDB();
        const body=await request.json();
        const validationData=AccountSchema.parse(body);
        const existAccount=await Account.findOne({
            provider:validationData.provider,
            providerAccountId:validationData.providerAccountId
        });
        if(existAccount) throw new ForbiddenError("Account already exists");


        const newAccount= await Account.create(validationData);
        return NextResponse.json({success:true, data:newAccount}, {status:201});
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
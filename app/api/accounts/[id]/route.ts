import { NextResponse } from "next/server";
import handleError from "../../../../lib/handlers/error";
import { NotfoundError, ValidationError } from "../../../../lib/http-errors";
import { connectDB } from "../../../../lib/mongodb";
import { APIErrorResponse } from "../../../../types/global";
import { AccountSchema, } from "../../../../lib/validation";
import Account from "../../../../database/account.model";

export async function GET(request:Request, {params}:{params:Promise<{id:string}>}) {
    const {id}=await params;
    if(!id) throw new NotfoundError("Account");
    try {
        await connectDB();
        const account=await Account.findById(id);
        if(!account) throw new NotfoundError("Account");
        return NextResponse.json({success:true, data:account}, {status:200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }

}

export async function DELETE(request:Request, {params}:{params:Promise<{id:string}>}) {
    const {id}=await params;
    if(!id) throw new NotfoundError("Account");
    try {
        await connectDB();
        const account=await Account.findByIdAndDelete(id);
        if(!account) throw new NotfoundError("Account");
        return NextResponse.json({success:true, data:account},{status:200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}) {
    const {id}=await params;
    if(!id) throw new NotfoundError("Account");

    try {
        await connectDB();
        const body=await request.json();
        const validateData=AccountSchema.partial().safeParse(body);
        if(!validateData.success) throw new ValidationError(validateData.error.flatten().fieldErrors)
        const account=await Account.findByIdAndUpdate(id, validateData, {new:true
        })
        if(!account) throw new NotfoundError("User");
        return NextResponse.json({success:true, data:account}, {status:200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
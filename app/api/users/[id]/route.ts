import { NextResponse } from "next/server";
import User from "../../../../database/user.model";
import handleError from "../../../../lib/handlers/error";
import { NotfoundError } from "../../../../lib/http-errors";
import { connectDB } from "../../../../lib/mongodb";
import { APIErrorResponse } from "../../../../types/global";
import { UserSchema } from "../../../../lib/validation";

export async function GET(request:Request, {params}:{params:Promise<{id:string}>}) {
    const {id}=await params;
    if(!id) throw new NotfoundError("User");
    try {
        await connectDB();
        const user=await User.findById(id);
        if(!user) throw new NotfoundError("User");
        return NextResponse.json({success:true, data:user}, {status:200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }

}

export async function DELETE(request:Request, {params}:{params:Promise<{id:string}>}) {
    const {id}=await params;
    if(!id) throw new NotfoundError("User");
    try {
        await connectDB();
        const user=await User.findByIdAndDelete(id);
        if(!user) throw new NotfoundError("User");
        return NextResponse.json({success:true, data:user},{status:200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}) {
    const {id}=await params;
    if(!id) throw new NotfoundError("User");

    try {
        await connectDB();
        const body=await request.json();
        const validateData=UserSchema.partial().parse(body);
        const user=await User.findByIdAndUpdate(id, validateData, {new:true,
            runValidators:true,
        })
        if(!user) throw new NotfoundError("User");
        return NextResponse.json({success:true, data:user}, {status:200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
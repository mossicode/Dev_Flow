import { NextResponse } from "next/server";
import handleError from "../../../../lib/handlers/error";
import { NotfoundError, ValidationError } from "../../../../lib/http-errors";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../database/user.model";
import { APIErrorResponse } from "../../../../types/global";
import z from "zod";

const EmailLookupSchema = z.object({
    email: z.string().email({ message: "Please provide a valid email." }),
});

export async function POST(request:Request){
    const body = await request.json();
    try {
        await connectDB();
        const validationData = EmailLookupSchema.safeParse(body);
        if(!validationData.success){
            throw new ValidationError(validationData.error.flatten().fieldErrors)
        }
        const { email } = validationData.data;
        const user=await User.findOne({ email });
        if(!user) throw new NotfoundError("User")
        return NextResponse.json({success:true, data:user}, {status:201});
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

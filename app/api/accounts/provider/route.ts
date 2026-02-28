import { NextResponse } from "next/server";
import handleError from "../../../../lib/handlers/error";
import { NotfoundError, ValidationError } from "../../../../lib/http-errors";
import { connectDB } from "../../../../lib/mongodb";
import { APIErrorResponse } from "../../../../types/global";
import Account from "../../../../database/account.model";
import z from "zod";

const ProviderLookupSchema = z.object({
    providerAccountId: z.string().min(1, { message: "providerAccountId is required" }),
});

export async function POST(request:Request){
    const body = await request.json();
    try {
        await connectDB();
        const validationData = ProviderLookupSchema.safeParse(body);
        if(!validationData.success){
            throw new ValidationError(validationData.error.flatten().fieldErrors)
        }
        const { providerAccountId } = validationData.data;
        const account=await Account.findOne({ providerAccountId });
        if(!account) throw new NotfoundError("User")
        return NextResponse.json({success:true, data:account}, {status:201});
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

import {openai} from "@ai-sdk/openai";
import { generateText } from "ai";
import handleError from "../../../../lib/handlers/error";
import { AIAnswerSchema } from "../../../../lib/validation";
import { NextResponse } from "next/server";
export async function POST (req:Request){
    try {
        const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
        const body = await req.json();
        const validatedData = AIAnswerSchema.safeParse(body);
        if(!validatedData.success){
            return handleError(validatedData.error, "api");

        }
        if(!process.env.OPENAI_API_KEY){
            return NextResponse.json(
                { success: false, error: { message: "OPENAI_API_KEY is missing" } },
                { status: 500 }
            );
        }
        const { question, content } = validatedData.data;
        const {text}=await generateText({
            model:openai(modelName),
            maxRetries: 0,
            prompt:`Generate a markdown-formatted response to the following question: ${question} based on the provided content:${content} `,
            system:"you are a helpfull assistant that provides inforamtive responses in markdown format, Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. for code blocks, use short-form smaller case language identifiers(e.g., 'js' for javascript, 'py' for python .",


        });
        return NextResponse.json({success:true, data:text}, {status:200})
    } catch (error) {
        console.error("AI answer route error:", error);
        if (
            typeof error === "object" &&
            error !== null &&
            "statusCode" in error &&
            (error as { statusCode?: number }).statusCode === 429
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: "You dont have permission to use this faeture.",
                    },
                },
                { status: 429 }
            );
        }
        try {
            return handleError(error, "api");
        } catch {
            return NextResponse.json(
                { success: false, error: { message: "An unexpected error occured" } },
                { status: 500 }
            );
        }
    }
}

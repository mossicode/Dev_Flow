import { NextResponse } from "next/server";
import { RequestError, ValidationError } from '../http-errors';
import { ZodError } from "zod";

export type ResponseType= 'api' | 'server';

const getHumanReadableErrorMessage = (error: Error): string => {
    const rawMessage = error.message || "";
    const errorCode = (error as Error & { code?: string }).code;
    const combined = `${errorCode ?? ""} ${rawMessage}`.toLowerCase();

    // Mongo/network DNS failures should be presented with actionable language.
    if (
        combined.includes("enotfound") ||
        combined.includes("getaddrinfo") ||
        combined.includes("mongodb")
    ) {
        return "Database connection failed. Please check your internet connection and MongoDB host configuration, then try again.";
    }

    if (combined.includes("etimedout") || combined.includes("timeout")) {
        return "Database request timed out. Please try again in a moment.";
    }

    return rawMessage || "An unexpected error occured";
};

const formatResponse=(
    responseType:ResponseType,
    status:number,
    message:string,
    errors?:Record<string, string[]> | undefined,
)=> {
    const responseContent={
        success : false,
        error:{
            message,
            details:errors,
        },
    };
    return responseType ==="api"
    ?NextResponse.json(responseContent, {status})
    : {status, ...responseContent}
}

const handleError=(error:unknown, responseType:ResponseType="server")=>{
    if(error instanceof RequestError){
        return formatResponse(
            responseType, 
            error.statusCode,
            error.message,
            error.errors
        )
    }
    if(error instanceof ZodError){
        const validationError = new ValidationError(error.flatten().fieldErrors as Record<string, string[]>)
        return formatResponse(
            responseType,
            validationError.statusCode,
            validationError.message,
            validationError.errors
        )
    }
    if(error instanceof Error){
        return formatResponse(
            responseType,
            500,
            getHumanReadableErrorMessage(error))
    }
    return formatResponse(responseType, 500, "An unexpected error occured")
}
export default handleError

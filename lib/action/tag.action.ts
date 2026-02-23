import { ActionResponse, ErrorResponse, PaginatedSearchParams, Tag } from "../../types/global";
import handleError from "../handlers/error";
import { PaginatedSearchParamsSchema } from "../validation";

export const getTags = async (params:PaginatedSearchParams

):Promise<ActionResponse<{tags:Tag[]; isNext:boolean}>>=>{
    const validationResult= await 
    action({
        params,
        schema,
        PaginatedSearchParamsSchema
    })
    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }
    const {page=1, pageSize=10, filter, query}=params
}
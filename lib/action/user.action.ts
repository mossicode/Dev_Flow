"use server"
import { ActionResponse, ErrorResponse, PaginatedSearchParams } from "../../types/global";
import UserModel, { type IUser } from '../../database/user.model';
import action from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validation";
import handleError from "../handlers/error";
import { SortAsc } from "lucide-react";

type UserListItem = IUser & { _id: string };

export async function getUser(params:PaginatedSearchParams):Promise<ActionResponse<{users:UserListItem[], isNext:boolean}>>{
    const valadationResult=await action({
        params:params,
        schema:PaginatedSearchParamsSchema
    });
    if(valadationResult instanceof Error){
        return handleError(valadationResult) as ErrorResponse;
    }
    const {page=1, pageSize=10, query, filter}=params;
    const skip=(Number(page) -1)*pageSize;
    const limit=pageSize;
    const filterQuery: Record<string, unknown> = {};
    
    if(query){
        filterQuery.$or=[
            {name:{$regex:query, $options:"i"}},
            {email:{$regex:query, $options:"i"}}
        ]
    }

    let sorCriteria={};
    switch (filter) {
        case 'newest':
            sorCriteria={createdAt:-1}
            break;
        case 'oldest' : 
            sorCriteria={createdAt:1}
            break;
        case 'popular' : 
            sorCriteria={createdAt:-1}
            break;
    
        default:
            sorCriteria={createdAt:-1}
            break;
    }
    try {
        const totalUsers=await UserModel.countDocuments(filterQuery);
        const users=await UserModel.find(filterQuery)
            .sort(sorCriteria)
            .skip(skip)
            .limit(limit);
            const isNext=totalUsers>skip + users.length;
            return {
                success:true,
                data:{
                    users:JSON.parse(JSON.stringify(users)),
                    isNext,

                }
            }

    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

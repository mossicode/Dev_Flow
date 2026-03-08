"use server"
import { ActionResponse, ErrorResponse, PaginatedSearchParams, type Answer as AnswerType, type Question as QuestionType, type User as UserType } from "../../types/global";
import UserModel, { type IUser } from '../../database/user.model';
import action from "../handlers/action";
import { GetUserSchema, PaginatedSearchParamsSchema } from "../validation";
import handleError from "../handlers/error";
import type {  GetUerAnswersParams, QetUsersParams } from "../../types/action";
import { Answer as AnswerModel, Question as QuestionModel } from "../../database";

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

    let sorCriteria: Record<string, 1 | -1>={};
    switch (filter) {
        case 'newest':
            sorCriteria={createdAt:-1}
            break;
        case 'oldest' : 
            sorCriteria={createdAt:1}
            break;
        case 'popular' : 
            sorCriteria={reputation:-1}
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
export async function getUsers(params:QetUsersParams):Promise<ActionResponse<{
    user:UserType,
    totalQuestion:number,
    totalAnswer:number,
}>>{
    const validationResult=await action({
        params,
        schema:GetUserSchema,

    })
    if(validationResult instanceof Error){
        return handleError(validationResult) as ErrorResponse;
    }
    const {userId}=params;
    try {
        const user=await UserModel.findById(userId);
        if(!user) throw new Error("User Not Found");
        const totalQuestions=await QuestionModel.countDocuments({author:userId});
        const totalAnswers=await AnswerModel.countDocuments({author:userId});
        return {
            success:true,
            data:{
                user:JSON.parse(JSON.stringify(user)),
                totalAnswer: totalAnswers,
                totalQuestion: totalQuestions
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
export async function getUserQuestion(params:QetUsersParams):Promise<ActionResponse<{
    questions:QuestionType[],
    isNext:boolean
}>>{
    const validationResult=await action({
        params,
        schema:GetUserSchema,

    })
    if(validationResult instanceof Error){
        return handleError(validationResult) as ErrorResponse;
    }
    const {userId, page=1, pageSize=10}=params;
    const skip=(Number(page) -1) * pageSize;
    const limit = pageSize;
    try {
        const totalQuestion=await QuestionModel.countDocuments({author:userId})
        const questions=await QuestionModel.find({author:userId})
            .populate("tags", "name")
            .populate("author", "name image")
            .skip(skip)
            .limit(limit);
        
        const isNext=totalQuestion > skip + questions.length;
        return {
            success:true,
            data:{
                questions:JSON.parse(JSON.stringify(questions)),
                isNext
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
export async function getUserAnswer(params:GetUerAnswersParams):Promise<ActionResponse<{
    answers:AnswerType[],
    isNext:boolean
}>>{
    const validationResult=await action({
        params,
        schema:GetUserSchema,

    })
    if(validationResult instanceof Error){
        return handleError(validationResult) as ErrorResponse;
    }
    const {userId, page=1, pageSize=10}=params;
    const skip=(Number(page) -1) * pageSize;
    const limit = pageSize;
    try {
        const totalAnswers=await AnswerModel.countDocuments({author:userId})
        const answers=await AnswerModel.find({author:userId})
            
            .populate("author", "_id name image")
            .skip(skip)
            .limit(limit);
        
        const isNext=totalAnswers > skip + answers.length;
        return {
            success:true,
            data:{
                answers:JSON.parse(JSON.stringify(answers)),
                isNext
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}



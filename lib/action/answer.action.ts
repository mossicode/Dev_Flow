"use server"

import { AnswerQuestionParams, GetAnswerParams } from "../../types/action";
import { ActionResponse, ErrorResponse } from "../../types/global";
import Answer from '../../database/answer.model';
import action from "../handlers/action";
import { AnswerQuestionSchema, GetAnswerQuestionSchema } from "../validation";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Question } from "../../database";
import { revalidatePath } from "next/cache";
import ROUTES from "../../constants/Route";
import type { Answer as AnswerType } from "../../types/global";

export async function createAnswer(params:AnswerQuestionParams):Promise<ActionResponse<AnswerType>>{
    const validationResult=await action({
        params,
        schema:AnswerQuestionSchema,
        authorize:true
    })
    if(validationResult instanceof Error){
        return handleError(validationResult) as ErrorResponse;
    }
    const {content, questionId}=validationResult.params as AnswerQuestionParams;
    const userId=validationResult?.session?.user?.id;
    const session=await mongoose.startSession();
    session.startTransaction();
    try {
        const question=await Question.findById(questionId).session(session);
        if(!question){
            throw new Error("Question not Found")
        }
        const [newAnswer]=await Answer.create([
            {
                author:userId,
                question:questionId,
                content
            }
        ], {session});
        question.answers+=1;
        await question.save({session});
        await session.commitTransaction();
        revalidatePath(ROUTES.QUESTION(questionId));
        return {
            success:true,
            data:JSON.parse(JSON.stringify(newAnswer))
        }
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    }finally{
        await session.endSession();
    }
}
export async function getAnswer(params:GetAnswerParams):Promise<ActionResponse<{
    answers:AnswerType[];
    isNext:boolean;
    totalAnswers:number

}>>{
    const validationResult=await action({
        params,
        schema:GetAnswerQuestionSchema
    });
    if(validationResult instanceof Error){
        return handleError(validationResult) as ErrorResponse;
    }
    const {questionId, page=1, pageSize=10, filter}=validationResult.params as GetAnswerParams;
    const skip =(Number(page - 1) * pageSize);
    const limit=pageSize;
    
    let sortCriteria:Record<string, 1 | -1>={};
    switch (filter) {
        case "latest":
            sortCriteria={createdAt: - 1};
            break;
        case "oldest":
            sortCriteria={createdAt:1};
            break;
        case "popular":
            sortCriteria={upvotes:-1};
            break;
        default:
            sortCriteria={createdAt:-1}
            break;
    }
    try {
        const totalAnswers=await Answer.countDocuments({question:questionId});
        const answers=await Answer.find({question:questionId})
            .populate("author", "_id name image")
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);
        const isNext = totalAnswers > skip + answers.length;
        return {
            success:true,
            data:{
                answers:JSON.parse(JSON.stringify(answers)),
                isNext,
                totalAnswers
            }
        }   
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

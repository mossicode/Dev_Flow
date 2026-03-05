"use server"
import { revalidatePath } from 'next/cache';
import { Question as QuestionModel } from '../../database';
import { CollectionBaseParams } from '../../types/action';
import { ActionResponse, ErrorResponse, PaginatedSearchParams } from '../../types/global';
import type { Question } from '../../types/global';
import action from '../handlers/action';
import handleError from '../handlers/error';
import { CollectionBaseSchema, PaginatedSearchParamsSchema } from '../validation';
import ROUTES from '../../constants/Route';
import { auth } from '../../auth';
import CollectionModel from '../../database/collection.model';
import mongoose, { PipelineStage } from 'mongoose';

type SavedCollectionItem = {
    _id: string;
    author: string;
    question: Question;
};

export async function toggleSaveQuestion(params:CollectionBaseParams):Promise<ActionResponse<{saved:boolean}>> {
    const validationResult=await action({
        params,
        schema:CollectionBaseSchema,
        authorize:true
    });
    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }
    const {questionId}=validationResult.params;
    const userId=validationResult.session.user.id;
    try {
        const question=await QuestionModel.findById(questionId);
        if(!question) throw new Error("Question not Found");

        const collection=await CollectionModel.findOne({
            question:questionId,
            author:userId
        });
        if(collection){
            await CollectionModel.findByIdAndDelete(collection.id);
            revalidatePath(ROUTES.QUESTION(questionId));
            return {
                success:true,
                data:{
                    saved:false
                }
            }
        }

        await CollectionModel.create({
            question:questionId,
            author:userId
        });

        revalidatePath(ROUTES.QUESTION(questionId));
        return {
            success:true,
            data:{
                saved:true
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
} 
export async function hasSavedQuestion(params:CollectionBaseParams):Promise<ActionResponse<{saved:boolean}>> {
    const validationResult=await action({
        params,
        schema:CollectionBaseSchema,
        authorize:false
    });
    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }
    const {questionId}=validationResult.params;
    const session = await auth();
    const userId=session?.user?.id;

    if(!userId){
        return {
            success:true,
            data:{saved:false}
        };
    }

    try {

        const collection=await CollectionModel.findOne({
            question:questionId,
            author:userId
        });

        return {
            success:true,
            data:{
                saved:!!collection
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
} 
export async function getSavedQuestion(params:PaginatedSearchParams):Promise<ActionResponse<{collection:SavedCollectionItem[]; isNext:boolean}>>{
    const validationResult=await action({
        params,
        schema:PaginatedSearchParamsSchema,
        authorize:true
    });
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }
    const userId=validationResult.session?.user?.id;
    const {page=1, pageSize=10, query, filter}=params;
    const skip=(Number(page) -1)*pageSize;
    const limit=pageSize;
    const sortOptions:Record<string, Record<string, 1| -1>> ={
        mostrecent:{"question.createdAt":-1},
        oldest:{"question.createdAt":1},
        mostvoted:{"question.upvotes":-1},
        mostviewed:{"question.views":-1},
        mostanswered:{"question.answers":-1},
    };
    const sortCriteria=sortOptions[filter as keyof typeof sortOptions] || {
        "question.createdAt":-1
    };
    try {
        const pipline:PipelineStage[]=[
            {$match:{author:new mongoose.Types.ObjectId(userId)}},
            {$lookup:{
                from:"questions",
                localField:"question",
                foreignField:"_id",
                as:"question"
            }},
            {$unwind:"$question"},
            {
                $lookup:{
                    from:"users",
                    localField:"question.author",
                    foreignField:"_id",
                    as:"question.author"
                }
            },
            {$unwind:"$question.author"},
            {
                $lookup:{
                    from:"tags",
                    localField:"question.tags",
                    foreignField:"_id",
                    as:"question.tags",
                }
            }
        ]
        if(query){
            pipline.push({
                $match:{
                    $or:[
                       {"question.title":{$regex:query, $options:"i"}},
                       {"question.content":{$regex:query, $options:"i"}} 
                    ]
                }
            })
        }   
        const [totalCount]=await CollectionModel.aggregate([
            ...pipline,
            {$count:"count"},
        ])
        pipline.push({$sort:sortCriteria}, {$skip:skip}, {$limit:limit});
        pipline.push({$project:{question:1, author:1}});
        const questions = await CollectionModel.aggregate(pipline) as SavedCollectionItem[];
        const totalItems = totalCount?.count ?? 0;
        const isNext=totalItems>skip +questions.length;
        return {
            success:true,
            data:{
                collection:JSON.parse(JSON.stringify(questions)),
                isNext
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

"use server"
import { revalidatePath } from 'next/cache';
import { Collection, Question } from '../../database';
import { CollectionBaseParams } from '../../types/action';
import { ActionResponse, ErrorResponse } from '../../types/global';
import action from '../handlers/action';
import handleError from '../handlers/error';
import { CollectionBaseSchema } from '../validation';
import ROUTES from '../../constants/Route';
import { auth } from '../../auth';

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
        const question=await Question.findById(questionId);
        if(!question) throw new Error("Question not Found");

        const collection=await Collection.findOne({
            question:questionId,
            author:userId
        });
        if(collection){
            await Collection.findByIdAndDelete(collection.id);
            revalidatePath(ROUTES.QUESTION(questionId));
            return {
                success:true,
                data:{
                    saved:false
                }
            }
        }

        await Collection.create({
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

        const collection=await Collection.findOne({
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

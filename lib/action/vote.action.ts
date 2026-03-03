"use server"

import { ActionResponse, ErrorResponse } from "../../types/global";
import { CreateVoteParams, HasVoteResponse, UpdatedVoteCountParams, HasVoteParams } from "../../types/action";
import action from "../handlers/action";
import { CreateVoteSchema, HasVoteSchema, UpdateVoteCountSchema } from "../validation";
import handleError from "../handlers/error";
import mongoose, { ClientSession } from "mongoose";
import { Answer, Question, Vote } from "../../database";
import { revalidatePath } from "next/cache";
import ROUTES from "../../constants/Route";

async function updatedVoteCount({
    params,
    session,
}: {
    params: UpdatedVoteCountParams;
    session?: ClientSession;
}): Promise<ActionResponse> {
    const validationResult = await action({
        params,
        schema: UpdateVoteCountSchema,
    });
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ActionResponse;
    }

    const { targetId, targetType, voteType, change } = validationResult.params!;
    const Model = targetType === "question" ? Question : Answer;
    const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

    try {
        const result = await Model.findByIdAndUpdate(
            targetId,
            { $inc: { [voteField]: change } },
            { new: true, session }
        );
        if (!result) {
            return handleError(new Error("Failed to update vote count")) as ErrorResponse;
        }
        return { success: true };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function createVote(params: CreateVoteParams): Promise<ActionResponse> {
    const validationResult = await action({
        params,
        schema: CreateVoteSchema,
        authorize: true,
    });
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ActionResponse;
    }

    const { targetId, targetType, voteType } = validationResult.params!;
    const userId = validationResult.session?.user?.id;
    if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingVote = await Vote.findOne({
            author: userId,
            id: targetId,
            type: targetType,
        }).session(session);

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                await Vote.deleteOne({ _id: existingVote._id }).session(session);
                await updatedVoteCount({
                    params: { targetId, targetType, voteType, change: -1 },
                    session,
                });
            } else {
                await Vote.findByIdAndUpdate(existingVote._id, { voteType }, { new: true, session });
                await updatedVoteCount({
                    params: { targetId, targetType, voteType: existingVote.voteType, change: -1 },
                    session,
                });
                await updatedVoteCount({
                    params: { targetId, targetType, voteType, change: 1 },
                    session,
                });
            }
        } else {
            await Vote.create(
                [
                    {
                        author: userId,
                        id: targetId,
                        type: targetType,
                        voteType,
                    },
                ],
                { session }
            );
            await updatedVoteCount({
                params: { targetId, targetType, voteType, change: 1 },
                session,
            });
        }

        const revalidateQuestionId =
            targetType === "question"
                ? targetId
                : (await Answer.findById(targetId).select("question").lean())?.question?.toString();

        await session.commitTransaction();
        if (revalidateQuestionId) {
            revalidatePath(ROUTES.QUESTION(revalidateQuestionId));
        }
        return { success: true };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }
}

export async function hasVoted(params: HasVoteParams): Promise<ActionResponse<HasVoteResponse>> {
    const validtationResult=await action({
        params,
        schema:HasVoteSchema,
        authorize:false
    })
    if(validtationResult instanceof Error){
        return handleError(validtationResult) as ErrorResponse;
    }
    const {targetId, targetType} =validtationResult.params!;
    const userId=validtationResult.session?.user?.id;
    if(!userId){
        return {
            success:true,
            data:{hasUpvoted:false, hasDownvoted:false}
        };
    }
    try {
        const vote=await Vote.findOne({
            author:userId,
            id:targetId,
            type:targetType
        })
        if(!vote){
            return {
                success:true,
                data:{hasUpvoted:false, hasDownvoted:false}
            }
        }
        return {
            success:true,
            data:{
                hasUpvoted:vote.voteType==="upvote",
                hasDownvoted:vote.voteType==="downvote",
             }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

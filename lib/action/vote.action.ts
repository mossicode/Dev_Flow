"use server"

import { ActionResponse, ErrorResponse } from "../../types/global";
import { CreateVoteParams, UpdatedVoteCountParams } from "../../types/action";
import action from "../handlers/action";
import { CreateVoteSchema, UpdateVoteCountSchema } from "../validation";
import handleError from "../handlers/error";
import mongoose, { ClientSession } from "mongoose";
import { Answer, Question, Vote } from "../../database";

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

async function createVote({ params }: { params: CreateVoteParams }): Promise<ActionResponse> {
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

        await session.commitTransaction();
        return { success: true };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }
}

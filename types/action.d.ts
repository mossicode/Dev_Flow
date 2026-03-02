import type { PaginatedSearchParams } from './global';

export interface SignInWithOAuthParams {
    provider: "github" | "google";
    providerAccountId: string;
    user: {
        email: string;
        name: string;
        image?: string | null;
        username: string;
    };
}

export interface AuthCredentials {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface SignInCredentials {
    email: string;
    password: string;
}

export interface GetTagQuestionParams extends Omit<PaginatedSearchParams, "filter">{
    tagId:string
}

export interface IncrementViewParams{
    questionId:string;
}

export interface AnswerQuestionParams{
    questionId:string;
    content:string;
}

export interface GetAnswerParams extends PaginatedSearchParams{
    questionId:string;
}
export interface CreateVoteParams{
    targetId:string;
    targetType:"question" | "answer";
    voteType:"upvote"| "downvote";
}
export interface UpdatedVoteCountParams extends CreateVoteParams{
    change:1 | -1
}

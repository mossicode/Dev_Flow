import { NextResponse } from "next/server";

export interface Tag {
    _id: string;
    name: string;
    question?: number;
    questions?: number;
}

export interface Author {
    _id: string;
    name: string;
    image?: string;
}

export interface Question {
    _id: string;
    title: string;
    content:string;
    tags: Tag[];
    author: Author;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
    answers: number;
    views: number;
}

export type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: Record<string, string[]>;
    };
    status?: number;
};

export type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
export type ErrorResponse = ActionResponse<never> & { success: false };
export type APIErrorResponse = NextResponse<ErrorResponse>;
export type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;
interface RouteParams{
    params:Promise<Record<string, string>>;
    searchParams:Promise<Record<string, string>>
}
interface PaginatedSearchParams{
    page?:number;
    pageSize?:number;
    query?:string;
    filter?:string;
    sort?:string
}
interface Answer{
    _id:string;
    author:Author;
    content:string;
    createdAt:Date;
}
interface User{
    _id:string;
    name:string;
    username:string;
    email:string;
    bio?:string;
    image?:string;
    location?:string;
    portfolio?:string;
    reputation?:number;
}

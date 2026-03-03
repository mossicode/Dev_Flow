'use client'
import Image from 'next/image';
import React, { use, useState } from 'react'
import { toast } from '../../hooks/use-toast';
import { ActionResponse } from '../../types/global';
import { HasVoteResponse } from '../../types/action';
import { createVote } from '../../lib/action/vote.action';
import { cn } from '../../lib/utils';
interface Props{
    targetType:"question" | "answer";
    targetId:string;
    upVotes:number;
    downVotes:number;
    hasVotedPromise:Promise<ActionResponse<HasVoteResponse>>
}
function Vote({hasVotedPromise, upVotes,  downVotes,  targetType, targetId}:Props) {
    const [isLoading, setIsLoading]=useState(false);
    const {data}=use(hasVotedPromise)
    const {hasUpvoted, hasDownvoted}=data|| {};
    const handleVote=async (voteType:'upvote'| 'downvote')=>{
         if (isLoading) return;
         setIsLoading(true);
         try {
            const result=await createVote({
                targetId,
                targetType,
                voteType
            })
            if(!result.success){
                const errorMessage = result.error?.message || "An Error accured while voting";
                const isUnauthorized =
                    result.status === 401 || /unauthorized/i.test(errorMessage);
                return toast({
                    title: isUnauthorized ? "Please login to vote" : "Failed to vote",
                    description: isUnauthorized ? "Only logged user can vote" : errorMessage,
                    variant:"destructive"
                })
            }
            toast({
                title: "Vote updated",
                description: voteType === "upvote" ? "Your upvote was processed." : "Your downvote was processed.",
            })
         } catch {
            toast({
                title:"Failed to vote.",
                description:"An error accured while voting",
                variant:"destructive"
            })
         }finally{
            setIsLoading(false);
         }
    }
  return (
    <div className='flex items-center justify-center gap-3'>
        <div className='flex gap-x-1.5'>
            <Image src="/up.png" height={16} width={16} alt='up' 
                className={cn('cursor-pointer  ', hasUpvoted ? "dark:invert  text-green-500 font-extrabold" : "text-white dark:invert bg-transparent")}
                onClick={()=>!isLoading && handleVote('upvote')}
                />
                {upVotes}
        </div>
        <div className='flex gap-x-1.5'>
            
            <Image src="/down.png"  height={16} width={16} alt='up' 
                className={cn('cursor-pointer dark:invert text-white font-extrabold', hasDownvoted && "text-green-500")}
                onClick={()=>!isLoading && handleVote('downvote')}
                />
                {downVotes}
        </div>
    </div>
  )
}

export default Vote

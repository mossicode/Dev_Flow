'use client'
import { useSession } from 'next-auth/react';
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
    const session=useSession();
    const isAuthenticated = session.status === "authenticated";
    const {success, data}=use(hasVotedPromise)
    const {hasUpvoted, hasDownvoted}=data|| {};
    const handleVote=async (voteType:'upvote'| 'downvote')=>{
         if (session.status === "loading") {
            return;
         }
         if (!isAuthenticated) {
            return toast({
                title:"Please login to vote",
                description:"Only logged ueser can vote"
            })
         }
         setIsLoading(true);
         try {
            const result=await createVote({
                targetId,
                targetType,
                voteType
            })
            if(!result.success){
                return toast({
                    title:"Failed to vote",
                    description:result.error?.message || "An Error accured while voting",
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
                className={cn('cursor-pointer  ', success?"dark:invert  text-green-500 font-extrabold":"text-white dark:invert bg-transparent")}
                onClick={()=>!isLoading && handleVote('upvote')}
                />
                {upVotes}
        </div>
        <div className='flex gap-x-1.5'>
            
            <Image src="/down.png"  height={16} width={16} alt='up' 
                className='cursor-pointer dark:invert text-white font-extrabold'
                onClick={()=>!isLoading && handleVote('downvote')}
                />
                {downVotes}
        </div>
    </div>
  )
}

export default Vote

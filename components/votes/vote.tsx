'use client'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react'
import { toast } from '../../hooks/use-toast';
interface Props{
    upVotes:number;
    hasUpVotes:boolean;
    downVotes:number;
    hasdownVotes:boolean
}
function Vote({upVotes, hasUpVotes, downVotes, hasdownVotes}:Props) {
    const [isLoading, setIsLoading]=useState(false);
    const session=useSession();
    const userId=session.data?.user?.id;
    const handleVote=(voteType:'upvote'| 'downvote')=>{
         if (!userId) {
            return toast({
                title:"Please login to vote",
                description:"Only logged ueser can vote"
            })
         }
         try {
            const successMessage=
            voteType == "upvote" ? `Upvote ${hasUpVotes ?"added":"removed"} successfully `
                                 :`Downvote ${hasdownVotes ? "added":"removed"} successfully`;
                                 toast({
                                    title:successMessage,
                                    description:"your vote has been voted"
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
                className='cursor-pointer dark:invert bg-transparent text-white'
                onClick={()=>!isLoading && handleVote('upvote')}
                />
                {upVotes}
        </div>
        <div className='flex gap-x-1.5'>
            
            <Image src="/down.png"  height={16} width={16} alt='up' 
                className='cursor-pointer dark:invert text-white font-extrabold'
                onClick={()=>!isLoading && handleVote('upvote')}
                />
                {downVotes}
        </div>
    </div>
  )
}

export default Vote
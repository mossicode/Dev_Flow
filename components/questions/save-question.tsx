"use client"
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import React, { use, useEffect, useState } from 'react'
import { toast } from '../../hooks/use-toast';
import { toggleSaveQuestion } from '../../lib/action/collection.action';
import { ActionResponse } from '../../types/global';

function SaveQuestion({questionId,hasSavedQuestionPromise}:{
    questionId:string;
    hasSavedQuestionPromise:Promise<ActionResponse<{saved:boolean}>>;
    }) {
    const [isLoading, setIsLoading]=useState(false);
    const session=useSession();
    const userId=session?.data?.user?.id
    const {data}=use(hasSavedQuestionPromise)
    const [hasSaved, setHasSaved] = useState(Boolean(data?.saved));

    useEffect(() => {
        setHasSaved(Boolean(data?.saved));
    }, [data?.saved, questionId]);

    const handleSave= async ()=>{
        if(isLoading) return;
        if(!userId) {
            return toast({
                title:"You need to be logged in to save a question",
                variant:"destructive"
            })
           
        }
            const previousSaved = hasSaved;
            const nextSaved = !previousSaved;
            setHasSaved(nextSaved);
            setIsLoading(true)
            try {
                const {success, data, error}=await toggleSaveQuestion({questionId})
                if(!success) throw new Error(error?.message || "An error accured");

                setHasSaved(Boolean(data?.saved));
                toast({
                    title:`Question ${data?.saved? "saved":"unsaved"} successfully`,
                   
                })
                
            } catch (error) {
                setHasSaved(previousSaved);
                toast({
                    title:"Error",
                    description:error instanceof Error?error.message: "An error accured",
                    variant:"destructive"
                })
            } finally {
                setIsLoading(false);
            }

        
    }

  return (
    <Image 
        key={hasSaved ? "saved" : "unsaved"}
        src={`${hasSaved ?"/image.png":"/empty_image.svg"}`}
        alt='Save'
        width={23}
        height={23}
        className={`cursor-pointer ${isLoading && 'opacity-50'}`}
        aria-label='Save Question'
        onClick={handleSave}
        />
  )
}

export default SaveQuestion

"use client"
import { useEffect } from "react"
import { incrementView } from "../../../../lib/action/question.action"
import { toast } from "../../../../hooks/use-toast"

function View({questionId}:{questionId:string}) {
    useEffect(()=>{
        const handleIncrement=async ()=>{
            const result=await incrementView({questionId})
            if(!result.success){
                toast({
                    title:"Failed",
                    description:"Could not update view count."
                })
            }
        }
        handleIncrement();
    },[questionId])
  return null
}

export default View

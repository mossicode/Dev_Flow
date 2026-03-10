"use client"
import React from 'react'
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "../../components/ui/alert-dialog"
import { Button } from '../ui/button';
import { Edit, Trash } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import { useRouter } from 'next/navigation';
import { deleteQuestionById } from '../../lib/action/question.action';
import { deleteAnswerById } from '../../lib/action/answer.action';
interface Props{
    type:"question" | "answer";
    itemId:string;
}
function EditDeleteAction({type, itemId}:Props) {
    const router=useRouter();
    const handleEdit= async ()=>{
        if (type === "answer") {
            toast({
                title: "Edit unavailable",
                description: "Answer edit page is not implemented yet."
            });
            return;
        }

        router.push(`/question/${itemId}/edit`);
    }
    const handleDelete=async()=>{
        const result = type === "question"
            ? await deleteQuestionById({ questionId: itemId })
            : await deleteAnswerById({ answerId: itemId });

        if (!result.success) {
            toast({
                title: "Delete failed",
                description: result.error?.message || "Something went wrong",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: `${type === "question" ? "Question" : "Answer"} Deleted`,
            description: `Your ${type} has been deleted successfully.`,
        });
        router.refresh();
    }
  return (
    <div> 
        <Edit size={20} onClick={handleEdit} />
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="border-none bg-transparent" variant="outline"><Trash size={20} /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="">
        <AlertDialogHeader className="">
          <AlertDialogTitle className="">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="">
            This action cannot be undone. This will permanently delete your
            {type==='question' ?"question":"Answer"} from our server. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="">
          <AlertDialogCancel className="">Cancel</AlertDialogCancel>
          <AlertDialogAction className="" onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  )
}

export default EditDeleteAction

"use client"
import { MDXEditorMethods } from "@mdxeditor/editor"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z, success } from 'zod';
import { AnswerSchema, AskQuestionSchema } from "../../lib/validation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,

  FormMessage,
} from "../ui/form"
import { Button } from "../ui/button"
import { useRef, useState, useTransition, type KeyboardEvent } from "react"
import dynamic from "next/dynamic"
import { Loader2Icon } from "lucide-react"
import { createAnswer } from "../../lib/action/answer.action"
import { toast } from "../../hooks/use-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { api } from "../../lib/api"

interface Props{
  questionId:string;
  questionTitle:string;
  questionContent:string;

}

export default function AnswerForm({questionId, questionTitle,questionContent }:Props) {
    // const [isAnswering, setSubmittting]=useState(false);
    const [isAnswering, startAnsweringTransion]=useTransition();
    const [isAISubmitting, setIsAISubmitting]=useState(false);
    const session=useSession();
    const router = useRouter();
  const editRef = useRef<MDXEditorMethods>(null)
  const Editor = dynamic(() => import("../editor"), {
    ssr: false,
  })

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  })


  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransion(async () => {
      const result = await createAnswer({
        questionId,
        content: values.content,
      })

      if (result.success) {
        form.reset()
        toast({
          title: "Answer posted successfully",
          description: "Your answer has been posted successfully",
        })
        if(editRef.current){
          editRef.current.setMarkdown("");
        }
        setTimeout(() => {
          router.refresh();
        }, 300);
      } else {
        toast({
          title: "Error",
          description: result.error?.message,
          variant: "destructive",
        })
      }
    })
  }
  const generateAIAnswer=async ()=>{
    if(session.status !== "authenticated"){
      return toast({
        title:"Please log in",
        description:"You need to be logged in to use this feature"
      });
      
      }
      setIsAISubmitting(true);
      try {
       const {success, data, error}= await api.ai.getAnswer(questionTitle, questionContent);
       if(!success){
        return toast({
          title:"Error",
          description:error.message,
          variant:"destructive"
        })
       }
       const formatedAnwer=data.replace(/<br>/g, "").toString().trim();
       if(editRef.current){
        editRef.current.setMarkdown(formatedAnwer);
        form.setValue("content", formatedAnwer);
        form.trigger("content");
       }
       toast({
        title:"Success",
        description:"AI generated answer has been generated"
       })
      } catch (error) {
        toast({
          title:"Error",
          description:error instanceof Error?error.message:"There was a problem with your request",
          variant:"destructive"
        })
      }finally{
        setIsAISubmitting(false);
      }
    
  }
  return (
    <div>
        <div className="flex flex-col justify-between gap-5 sm:flex-row">
           <div className="w-full">
             <h4 className="font-semibold ">Write your answer here</h4>
          <div className="mx-auto text-center">
              <Button
               className="btn px-8 rounded-md border mx-auto text-orange-500 font-bold gap-1.5 bg-dark hover:bg-border py-2.5 shadow-none" 
               disabled={isAISubmitting}
               onClick={generateAIAnswer}
               >
	                 {isAISubmitting?
	                <><Loader2Icon size={4} className="animate-spin mr-2" />Generating... </>
                 :
                 <>
                 Generate AI Answer
                 </>}
            </Button>
          </div>
           </div>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex mt-8 w-full flex-col gap-10 ">

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              {/* <FormLabel className="text-slate-900 dark:text-slate-100 max-sm:text-xs">
                Detailed explanation of your problem <span className="text-red-500">*</span>
              </FormLabel> */}
              <FormControl>
                <Editor value={field.value} fieldChange={field.onChange} editorRef={editRef} />
              </FormControl>
              {/* <FormDescription className="mt-2.5 text-slate-600 dark:text-slate-300 max-sm:text-xs">
                Introduce the problem and expand what you wrote in the title.
              </FormDescription>
              <FormMessage className="text-red-600 dark:text-red-400" /> */}
              <FormMessage className="text-red-600 dark:text-red-400" />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button className="w-fit" type="submit">
	            {isAnswering?
	            <><Loader2Icon size={4} className="animate-spin mr-2" />Posting... </>
            :"Post Answer"}
          </Button>
        </div>

      </form>
    </Form>
    </div>
  )
}

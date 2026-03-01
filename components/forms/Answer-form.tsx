"use client"
import { MDXEditorMethods } from "@mdxeditor/editor"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AnswerSchema, AskQuestionSchema } from "../../lib/validation"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRef, useState, useTransition, type KeyboardEvent } from "react"
import dynamic from "next/dynamic"
import TagCard from "../card/TagCard"
import { createQuestion, editQuestion } from "../../lib/action/question.action"
import { useRouter } from "next/navigation"
import ROUTES from "../../constants/Route"
import { useToast } from "../../hooks/use-toast"
import { ActionResponse, Question } from "../../types/global"
import { type } from '../../.next/dev/types/routes';
import { Loader2Icon } from "lucide-react"

interface Params {
  question?: Question
  isEdit?: boolean
}

export default function AnswerForm() {
    const [isSubmitting, setSubmittting]=useState(false);
    const [isAISubmitting, setIsAISubmitting]=useState(false);
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
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


const handleSubmit=async (values:z.infer<typeof AnswerSchema>) =>{
    console.log(values)
}
  return (
    <div>
        <div className="flex flex-col justify-between gap-5 sm:flex-row">
           <div className="w-full">
             <h4 className="font-semibold ">Write your answer here</h4>
          <div className="mx-auto text-center">
              <Button className="btn px-8 rounded-md border mx-auto text-orange-500 font-bold gap-1.5 bg-dark hover:bg-border py-2.5 shadow-none" disabled={isAISubmitting}>
                 {isAISubmitting?
                <><Loader2Icon size={4} className="animate-spin mr-2" />"Generating..." </>
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
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button className="w-fit" type="submit">
            {isSubmitting?
            <><Loader2Icon size={4} className="animate-spin mr-2" />"posting..." </>
            :"Post Answer"}
          </Button>
        </div>

      </form>
    </Form>
    </div>
  )
}

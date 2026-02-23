"use client"
import { MDXEditorMethods } from "@mdxeditor/editor"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AskQuestionSchema } from "../../lib/validation"
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
import { useRef, useTransition, type KeyboardEvent } from "react"
import dynamic from "next/dynamic"
import TagCard from "../card/TagCard"
import { createQuestion, editQuestion } from "../../lib/action/question.action"
import { useRouter } from "next/navigation"
import ROUTES from "../../constants/Route"
import { LoaderIcon } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { Question } from "../../types/global"

interface Params {
  question?: Question
  isEdit?: boolean
}

export function QuesitonForm({ question, isEdit = false }: Params) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const editRef = useRef<MDXEditorMethods>(null)
  const Editor = dynamic(() => import("../editor"), {
    ssr: false,
  })

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags?.map((tag) => tag.name) || [],
    },
  })

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    form.setValue(
      "tags",
      field.value.filter((currentTag) => currentTag !== tag)
    )
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>, field: { value: string[] }) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const tagInput = e.currentTarget.value.trim()

      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput])
        e.currentTarget.value = ""
        form.clearErrors("tags")
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag should be less than 15",
        })
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        })
      }
    }
  }

  async function onSubmit(values: z.infer<typeof AskQuestionSchema>) {
    startTransition(async () => {
      const result = isEdit && question?._id
        ? await editQuestion({ questionId: question._id, ...values })
        : await createQuestion(values)

      if (result.success && result?.data?._id) {
        toast({
          title: isEdit ? "Question updated" : "Question created",
          description: isEdit
            ? "Your question was updated successfully."
            : "Your question was submitted successfully.",
        })
        router.push(ROUTES.QUESTION(result.data._id))
        return
      }

      toast({
        variant: "destructive",
        title: isEdit ? "Failed to update question" : "Failed to create question",
        description: result.error?.message || "Please try again.",
      })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>
                Question Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your title" {...field} />
              </FormControl>
              <FormDescription className="mt-2.5 text-slate-600 dark:text-slate-300">
                Be specific and imagine your question is someone else&apos;s problem.
              </FormDescription>
              <FormMessage className="text-red-600 dark:text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="text-slate-900 dark:text-slate-100">
                Detailed explanation of your problem <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor value={field.value} fieldChange={field.onChange} editorRef={editRef} />
              </FormControl>
              <FormDescription className="mt-2.5 text-slate-600 dark:text-slate-300">
                Introduce the problem and expand what you wrote in the title.
              </FormDescription>
              <FormMessage className="text-red-600 dark:text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-slate-900 dark:text-slate-100">
                Tags <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
                    type="text"
                    placeholder="Add your tags and press Enter"
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2.5">
                      {field.value.map((tag: string) => (
                        <TagCard
                          key={tag}
                          _id={tag}
                          name={tag}
                          compact
                          remove
                          isButton
                          handleRemove={() => handleTagRemove(tag, field)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="mt-2.5 text-slate-600 dark:text-slate-300">
                You can add up to 3 tags.
              </FormDescription>
              <FormMessage className="text-red-600 dark:text-red-400" />
            </FormItem>
          )}
        />

        <div className="mt-16 flex justify-end">
          <Button
            className="flex items-center justify-end bg-orange-500 px-8 py-4 text-xl text-white"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <LoaderIcon className="mr-2 size-4 animate-spin" />
                <span>{isEdit ? "Updating" : "Submitting"}</span>
              </>
            ) : (
              <>{isEdit ? "Update Question" : "Ask A Question"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

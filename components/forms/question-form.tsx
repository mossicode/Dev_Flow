"use client"
import { MDXEditorMethods } from '@mdxeditor/editor'
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { z } from "zod"
import { AskQuestionSchema } from '../../lib/validation'
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
import { useRef, type KeyboardEvent } from "react"
import dynamic from 'next/dynamic'
import TagCard from '../card/TagCard'

export function QuesitonForm() {
  const editRef=useRef<MDXEditorMethods>(null)
  const Editor = dynamic(() => import('../editor'), {
  // Make sure we turn SSR off
  ssr: false
})
 const form=useForm<z.infer<typeof AskQuestionSchema>>({
        resolver:zodResolver(AskQuestionSchema),
        defaultValues:{
            title:"",
            content:"",
            tags:[]
        }
    })
    const handleTagRemove=(tag: string, field: { value: string[] })=>{
      form.setValue(
        "tags",
        field.value.filter((currentTag) => currentTag !== tag)
      );
    }
const handleInputKeyDown =(e: KeyboardEvent<HTMLInputElement>, field:{value:string[]})=>{
if(e.key==="Enter"){
  e.preventDefault();
  const tagInput=e.currentTarget.value.trim();

  if(tagInput && tagInput.length<15 && !field.value.includes(tagInput)){
    form.setValue("tags", [...field.value, tagInput])
    e.currentTarget.value=""
    form.clearErrors("tags")
  }else if(tagInput.length>15){
    form.setError("tags", {
      type:"manual",
      message:"Tag should be less than 15"
    })
  }else if(field.value.includes(tagInput)){
    form.setError("tags",{
      type:'manual',
      message:"tag already exists"
    })
  }
}
}
  // 3. Define a submit handler
  function onSubmit(values: z.infer<typeof AskQuestionSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10 w-full">
        {/* 4. Use FormField for each input */}
        <FormField
          control={form.control} // Pass the control object from useForm
          name="title"        // Specify the field name
          render={({ field }) => ( // Render the actual input component
            <FormItem className="flex flex-col w-full">
              <FormLabel className="">
                Question Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                {/* The shadcn/ui Input component receives the necessary props from { ...field } */}
                <Input placeholder="enter your title" {...field} /> 
              </FormControl>
              <FormDescription className="text-gray-600 mt-2.5">
                Be specific and image your question is someone problem
              </FormDescription>
              <FormMessage className="" /> {/* Displays Zod validation errors */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control} // Pass the control object from useForm
          name="content"        // Specify the field name
          render={({ field }) => ( // Render the actual input component
            <FormItem className="flex flex-col w-full text-white">
              <FormLabel className="text-white">
                Detailed explanation of your problem <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                 <Editor
                     value={field.value} 
                     fieldChange={field.onChange}
                     editorRef={editRef}   />
              </FormControl>
              <FormDescription className="text-white mt-2.5">
                Introduce the problem and expand what you have put in the title
              </FormDescription>
              <FormMessage className="text-white" /> {/* Displays Zod validation errors */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control} // Pass the control object from useForm
          name="tags"        // Specify the field name
          render={({ field }) => ( // Render the actual input component
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="">
                Tags <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                    <Input 
                      className=""
                      type="text"
                      placeholder="add your tags" 
                    //  {...field} 
                     onKeyDown={(e)=>handleInputKeyDown(e, field)} /> 
                       {field.value.length>0 &&(
                      <div className='flex mt-2.5 flex-wrap gap-2.5'>
                        {field.value.map((tag:string)=>
                          <TagCard key={tag} _id={tag} name={tag} compact remove isButton handleRemove={()=>handleTagRemove(tag, field)} />)}
                      </div>
                    )}
                </div>
                
              </FormControl>
              <FormDescription className="text-gray-600 mt-2.5">
                You can add tags up to 3 tags
              </FormDescription>
              <FormMessage className="" /> {/* Displays Zod validation errors */}
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-16 ">
          <Button className="flex justify-end bg-orange-500 text-white px-8 text-xl items-center py-4" type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}

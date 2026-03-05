import Link from "next/link"
import ROUTES from "../../constants/Route"
import { ChevronRightIcon } from "lucide-react"
import TagCard from "../card/TagCard"
import { getHotQuestions } from "../../lib/action/question.action"
import DataRender from "../DataRender"
import { getTopTags } from "../../lib/action/tag.action"

async function RightSidebar() {
    const [
        {success, data:hotQuestions, error},
        {success:tagSuccess, data:popularTags, error:tagError}
    ]= await Promise.all([getHotQuestions(), getTopTags()]) 
    const safeHotQuestions = hotQuestions ?? [];
    const safePopularTags = popularTags ?? [];
  
  return (
    <section className="pt-30 border-gray-800  no-scrollbar flex h-full w-64 gap-6 flex-col overflow-y-auto border-l p-6 shadow dark:shadow-none  ">
        <div>
            <h3 className="font-bold text-lg  ">Top Questions</h3>
            <div className="mt-4 flex w-full flex-col gap-5 text-base">
              <DataRender success={success} error={error} data={hotQuestions} empty={{
                title:"No Question Found",
                message:"No Question has been asked yet. "
              }} >
                {
                    safeHotQuestions.map((question)=>(
                        <div  key={question._id} className="flex flex-col gap-y-2.5">
                            <Link href={ROUTES.QUESTION(question._id)} >
                                <div className="flex justify-between items- gap-x-4 space-y-6 ">
                                    <p className="text-sm">{question.title}</p>
                                    <ChevronRightIcon />
                                </div>
                                
                            </Link>
                        </div>
                    ))
                }
              </DataRender>
            </div>
        </div>
        <div className="mt-0 ">
            <h3 className="font-bold text-xl">Popular Tags</h3>
            <div className="mt-5 flex flex-col gap-4 !dark:bg-white ">
              <DataRender error={tagError} success={tagSuccess} data={popularTags} empty={{
                title:"Not Found Tag",
                message:"You dont have any tag yet."
              }} >
                   <div className="space-y-2.5">
                     {safePopularTags.map((tag)=>(
                        <div className="flex justify-between items-center gap-3 space-y-3 " key={tag._id}>
                            <TagCard {...tag}/>
                            {tag.question}
                        </div>
                    ))}
                   </div>
              </DataRender>
              
            </div>
        </div>
    </section>
   
  )
}

export default RightSidebar

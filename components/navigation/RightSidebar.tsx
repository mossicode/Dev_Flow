import Link from "next/link"
import ROUTES from "../../constants/Route"
import { LucideChevronsLeftRight } from "lucide-react"
import TagCard from "../card/TagCard"

function RightSidebar() {
    const hotQuestions = [
        {_id:"1", title:"how to create a custom hook in React ?"},
        {_id:"2", title:"how to use React Query ?"},
        {_id:"3", title:"how to use Redux ?"},
        {_id:"4", title:"how to React Router ?"},
        {_id:"5", title:"how to React Context ?"},
    ]
    const popularTags = [
        {_id:"1", name:"React", questions:100},
        {_id:"2", name:"javascript", questions:200},
        {_id:"3", name:"typescript", questions:40},
        {_id:"4", name:"nextjs", questions:30},
        {_id:"5", name:"react-query", questions:1009},
    ]
  return (
    <section className="pt-36 border-gray-800 fixed right-0 top-0 z-40 flex h-screen w-87.5 gap-6 flex-col overflow-y-auto border-l p-6 shadow dark:shadow-none max-xl:hidden ">
        <div>
            <h3 className="font-bold  ">Top Questions</h3>
            <div className="mt-7 flex w-full flex-col gap-7.5 ">
                {
                    hotQuestions.map(({_id, title})=>(
                        <Link key={_id} href={ROUTES.PROFILE(_id)} className="flex items-center justify-between gap-7 cursor-pointer " >
                            <p className="">{title}</p>
                            <LucideChevronsLeftRight />
                        </Link> 
                    ))
                }
            </div>
        </div>
        <div className="mt-36 ">
            <h3>Popular Tags</h3>
            <div className="mt-7 flex flex-col gap-4 !dark:bg-white ">
                {popularTags.map(({_id, name, questions})=> (
                    <TagCard key={_id} _id={_id} name={name} questions={questions} showCount compact />
                ))

                }
            </div>
        </div>
    </section>
   
  )
}

export default RightSidebar

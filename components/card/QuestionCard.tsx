import Link from "next/link"
import { getTimeStamp } from "../../lib/utils"
import { Question, Tag } from "../../types/global"
import ROUTES from "../../constants/Route"
import TagCard from "./TagCard"
import Metric from "../metric"

interface Props{
    question:Question
}
 function QuestionCard({question:{_id, title, tags,author, createdAt, upvotes, answers, views}}:Props) {
  return (
    <div className="car-wrapper rounded-sm p-9 sm:px-11">
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
           <Link href={ROUTES.QUESTION(_id)} >
                <span className="text-gray-200">{getTimeStamp(createdAt)}</span>
                 <div>

                <h3 className="sm:font-bold line-clamp-1 flex-1 text-lg">{title}</h3>
            </div>
           </Link>
        </div>
        <div className="mt-3.5 flex w-full flex-wrap gap-2">
            {
                tags.map((tag: Tag)=>(
                    <TagCard 
                    key={tag._id} 
                    _id={tag._id}
                    name={tag.name}
                    compact
                     />
                ))
            }
        </div>
        <div className="flex-between mt-6 flex-wrap w-full gap-3">
            <Metric 
                   imgUrl={author.image} 
                   alt={author.name}
                   value={author.name} 
                   title={`asked${getTimeStamp(createdAt)}`}
                   href={ROUTES.PROFILE(author._id)}
                   textStyle="font-mediuem "
                   isAuthor 
            />
            <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
                 <Metric
                imgUrl="/vote.png"
                alt="like"
                value={upvotes}
                title="vote"
                textStyle="font-light" 
                />
                <Metric
                imgUrl="/vote.png"
                alt="answers"
                value={answers}
                title="answers"
                textStyle="font-light" 
                />
                <Metric
                imgUrl="/vote.png"
                alt="views"
                value={views}
                title="views"
                textStyle="font-light" 
                />
               
            </div>
                
        </div>
    </div>
  )
}

export default QuestionCard

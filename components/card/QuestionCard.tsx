import Link from "next/link"
import { getTimeStamp } from "../../lib/utils"
import { Question, Tag } from "../../types/global"
import ROUTES from "../../constants/Route"
import TagCard from "./TagCard"
import Metric from "../metric"
import EditDeleteAction from "../user/edit-delete-action"

interface Props{
    question:Question;
    compact?: boolean;
    showActionBtns?:boolean
}
 function QuestionCard({question:{_id, title, tags,author, createdAt, upvotes, answers, views}, compact = false, showActionBtns=false}:Props) {
  const shortTitle = title.length > 30 ? `${title.slice(0, 30)}...` : title;
  const displayedTitle = compact ? shortTitle : title;
  return (
    <div className="car-wrapper rounded-sm p-3 sm:px-0 sm:py-6 ">
        <div className="flex flex-col-reverse items-start justify-between gap-0 sm:flex-row">
           <Link href={ROUTES.QUESTION(_id)} >
                <span className="text-gray-200">{getTimeStamp(createdAt)}</span>
                 <div>

                <h3 className={`sm:font-bold text-sm ${compact ? "" : "line-clamp-1"}`}>{displayedTitle}</h3>
            </div>
           </Link>
           {compact && (
            <Link href={ROUTES.QUESTION(_id)} className="text-xs underline text-blue-500">
              Read more
            </Link>
           )}
           {showActionBtns && <EditDeleteAction type="question" itemId={_id} />}
        </div>
        <div className="mt-3.5 flex w-full flex-wrap gap-2">
            {
                tags.map((tag: Tag)=>(
                    <TagCard 
                    key={tag._id} 
                    _id={tag._id}
                    name={tag.name}
                    
                     />
                ))
            }
        </div>
        <div className="flex-between flex justify-between   mt-3 flex-wrap w-full gap-3">
            <Metric 
                   imgUrl={author.image} 
                   alt={author.name}
                   value={author.name} 
                   title={`asked${getTimeStamp(createdAt)}`}
                   href={ROUTES.PROFILE(author._id)}
                   textStyle="font-normal "
                   isAuthor 
            />
            <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
                 <Metric
                imgUrl="/vote.png"
                alt="like"
                value={upvotes}
                title="vote"
                textStyle="font-light text-sm" 
                />
                <Metric
                imgUrl="/vote.png"
                alt="answers"
                value={answers}
                title="answers"
                textStyle="font-light text-sm" 
                />
                <Metric
                imgUrl="/vote.png"
                alt="views"
                value={views}
                title="views"
                textStyle="font-light text-sm" 
                />
               
            </div>
                
        </div>
    </div>
  )
}

export default QuestionCard

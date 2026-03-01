
import Image from "next/image";
import UserAvatar from "../../../../components/userAvatar"
import { RouteParams } from "../../../../types/global"
import Metric from "../../../../components/metric";
import { formatNumber, getTimeStamp } from "../../../../lib/utils";
import TagCard from "../../../../components/card/TagCard";
import Preview from "../../../../components/editor/Preview";

import { getQuestion, incrementView } from "../../../../lib/action/question.action";
import { redirect } from "next/navigation";
import AnswerForm from "../../../../components/forms/Answer-form";


async function QuestionDetails({params}:RouteParams) {
  const {id}= await params
  const [_, {success, data:question}] = await Promise.all([
    incrementView({questionId:id}),
    getQuestion({quesitionId:id}),
  ]);

   if(!success || !question) return redirect("/404")
  const {author, views, tags, answers, createdAt, upvotes,content, title}=question;

    
  return (
    <div className="w-full flex flex-col gap-y-2">
         <div className="flex justify-start items-center gap-x-2">
          {author.image ? (
            <Image src={author.image} alt={author.name} width={20} height={20} />
          ) : (
            <div className="h-5 w-5 rounded-full bg-gray-300" aria-hidden="true" />
          )}
          <span>{author.name}</span>
         </div>
         <h2>
          {title}
         </h2>
         <div className="flex gap-x-2">
            <Metric 
            imgUrl="/logo1.png"
            alt="hi"
            value={`asked ${getTimeStamp(new Date(createdAt))}`}
            title=""
            textStyle=""
            />
              <Metric 
            imgUrl="/logo1.png"
            alt="hi"
            value={answers}
            title=""
            textStyle=""
            />
              <Metric 
            imgUrl="/logo1.png"
            alt="hi"
            value={formatNumber(views)}
            title=""
            textStyle=""
            />
         </div>
         
          <Preview content={content} />
       
         <div className="flex">
          {tags.map((tag)=>(
            
              <TagCard 
              key={tag._id}
              _id={tag._id as string}
              name={tag.name}
            />
            
          ))}
         </div>
         <div className="mt-8">
          <AnswerForm />
         </div>
    </div>
  )
}

export default QuestionDetails

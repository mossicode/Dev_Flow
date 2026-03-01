
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
import { getAnswer } from "../../../../lib/action/answer.action";
import AllAnswers from "../../../../components/answers/all-answers";
import { success } from 'zod';


async function QuestionDetails({params}:RouteParams) {
  const {id}= await params
  const [_, {success, data:question}] = await Promise.all([
    incrementView({questionId:id}),
    getQuestion({quesitionId:id}),
  ]);

   if(!success || !question) return redirect("/404")
    const {success:areAnswersLoaded, data:answerResult, error:answerError}=await getAnswer({
     questionId:id,
    page:1,
    pageSize:10,
    filter:"latest"
    })
    console.log("answer: ", answerResult)
  const {author, views, tags, answers, createdAt, upvotes,content, title}=question;
    const initial = author?.name?.trim()?.charAt(0)?.toUpperCase() || "?";

    
  return (
    <div className="w-full flex flex-col gap-y-2">
         <div className="flex justify-start items-center gap-x-2">
         {author?.image ? (
                              <Image src={author.image} alt={author.name} height={21} width={20} />
                            ) : (
                              <div
                                className="flex h-[23px] w-[23px] items-center bg-amber-600 text-white justify-center rounded-full border border-gray-300 text-[11px] font-semibold text-gray-700"
                                aria-label={author?.name || "User"}
                              >
                                {initial}
                              </div>
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
         <section>
            <AllAnswers
              data={answerResult?.answers}
              success={areAnswersLoaded}
              error={answerError}
              totalAnswers={answerResult?.totalAnswers || 0}
            />
         </section>
         <div className="mt-8">
          <AnswerForm questionId={question._id} />
         </div>
    </div>
  )
}

export default QuestionDetails

import QuestionCard from "../../components/card/QuestionCard";
import HomeFilter from "../../components/filters/home-filter";
import LocalSearch from "../../components/search/LocalSearch";
import ROUTES from "../../constants/Route";
import Link from "next/link";
import { getQuestions } from "../../lib/action/question.action";
import DataRender from "../../components/DataRender";
import { EMPTY_QUESTION } from "../../constants/states";
import HomeRefresh from "../../components/HomeRefresh";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

  interface SearchParams{
    searchParams:Promise<{[key:string]:string}>
  }

export default async function Home({searchParams}:SearchParams) {  
  const {page, pageSize, query, filter}=await searchParams;
  const {success, data, error}=await getQuestions({
    page:Number(page) || 1,
    pageSize:Number(pageSize) || 10,
    query:query || "",
    filter:filter||""
  })
  const questions = Array.isArray((data as any)?.question) ? (data as any).question : [];
  const normalizedQuery = (query || "").trim().toLowerCase();
  return (
   <>
   <Suspense fallback={<div>loading...</div>}>
       <HomeRefresh />
    <section className=" px-3 flex w-full flex-col-reverse sm:flex-row sm:items-center max-sm:px-2 justify-between">
      <h1 className="font-bold mt-2">All questions</h1>
     <button className="min-h-11.5 rounded-sm max-sm:min-h-5 px-4 py-3 max-sm:py-2 max-sm:text-sm  bg-chart-5 text-white">
      <Link href={ROUTES.ASK_QUESTION}>Ask a Quesitons</Link>
     </button>
    </section>
    <section className="mt-11 max-sm:px-2 max-sm:mt-6">
      <LocalSearch imgSrc="./dd" placeholder="Search Question..." otherClasses="flex-1" route="/" />
    </section>
    <HomeFilter />
     <div className="max-sm:px-3">
        <DataRender
          success={success}
          error={error}
          data={questions}
          empty={EMPTY_QUESTION}
        >
          {questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}
        </DataRender>
     </div>
   </Suspense>
   </>
  );
}

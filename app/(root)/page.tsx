import QuestionCard from "../../components/card/QuestionCard";
import HomeFilter from "../../components/filters/home-filter";
import LocalSearch from "../../components/search/LocalSearch";
import ROUTES from "../../constants/Route";
import Link from "next/link";
import { getQuestions } from "../../lib/action/question.action";
import DataRender from "../../components/DataRender";
import { EMPTY_QUESTION } from "../../constants/states";
  // const questions = [
  //   {
  //     _id:"1",
  //     title:"how to learn react", 
  //     description:"i want to learn react can you help me?", 
  //     tags:[
  //       {_id:"1", name:"React"},
  //       {_id:"3", name:"laravel"},
  //       {_id:"4", name:"typescript"},
  //     ],
  //     author:{_id:"1", name:'mostafa', image:"/avatar.png"},
  //     upvotes:10,
  //     answers:5,
  //     views:100,
  //     createdAt:new Date("2026/2/8")
  //   },
  //   {
  //     _id:"2",
  //     title:"how to learn javascript", 
  //     description:"i want to learn react can you help me?", 
  //     tags:[
  //       {_id:"2", name:"javascript"},
  //       {_id:"3", name:"laravel"},
  //       {_id:"4", name:"typescript"},
  //     ],
  //     author:{_id:"1", name:'mostafa', image:"/avatar.png"},
  //     upvotes:10,
  //     answers:5,
  //     views:100,
  //     createdAt:new Date("2026")
  //   },
  // ]

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

  // const filteredQuestions=questions.filter((question)=> {
  //   const matchesQuery = normalizedQuery
  //     ? question.title.toLowerCase().includes(normalizedQuery) ||
  //       question.tags.some((tag) =>
  //         tag.name.toLowerCase().includes(normalizedQuery)
  //       )
  //     : true;

  //   const matchesFilter = filter
  //     ? question.tags.some(
  //         (tag) => tag.name.toLowerCase() === filter.toLowerCase()
  //       )
  //     : true;

  //   return matchesQuery && matchesFilter;
  // });
  return (
   <>
    <section className=" px-3 flex w-full flex-col-reverse sm:flex-row sm:items-center max-sm:px-2 justify-between">
      <h1 className="font-bold mt-2">All questions</h1>
     <button className="min-h-11.5 rounded-sm max-sm:min-h-5 px-4 py-3 max-sm:py-2 max-sm:text-sm  bg-amber-700 text-gray-200">
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
    {/* {
      success 
      ?
      <div>
        <div className="mt-10 flex w-full flex-col gap-6">
      {
       questions && questions.length >0 ?(
         questions.map((question)=>(
          <QuestionCard key={question._id} question={question} />

        ))
       ):(
        <>
        <div className="mt-10 flex justify-center items-center w-full">
          <p className="">No Question Found</p>
        </div>
        </>
       )
      }
    </div>
      </div>
      :
      <>
       <div className="mt-10 flex justify-center items-center w-full">
          <p className="">{error?.message || "Failed to fetch Questions"}</p>
        </div>
      </>
    } */}
   </>
  );
}

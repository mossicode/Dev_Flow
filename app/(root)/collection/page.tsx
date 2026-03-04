import { Suspense } from "react";
import HomeRefresh from "../../../components/HomeRefresh";
// import { Link } from "lucide-react";
import ROUTES from "../../../constants/Route";
import LocalSearch from "../../../components/search/LocalSearch";
import HomeFilter from "../../../components/filters/home-filter";
import DataRender from "../../../components/DataRender";
import QuestionCard from "../../../components/card/QuestionCard";
import { EMPTY_QUESTION } from "../../../constants/states";
import Link from "next/link";
import { getSavedQuestion } from "../../../lib/action/collection.action";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

  interface SearchParams{
    searchParams:Promise<{[key:string]:string}>
  }

export default async function Home({searchParams}:SearchParams) {  
  const session = await auth();
  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  const {page, pageSize, query, filter}=await searchParams;
  const {success, data, error}=await getSavedQuestion({
    page:Number(page) || 1,
    pageSize:Number(pageSize) || 10,
    query:query || "",
    filter:filter||""
  })
  const collection = data?.collection ?? [];
  return (
   <>
   <Suspense fallback={<div>loading...</div>}>
       <HomeRefresh />
    <section className=" px-3 flex w-full flex-col-reverse sm:flex-row sm:items-center max-sm:px-2 justify-between">
      <h1 className="font-bold mt-2">Saved Question</h1>
   
    </section>
    <section className="mt-11 max-sm:px-2 max-sm:mt-6">
      <LocalSearch imgSrc="./dd" placeholder="Search Question..." otherClasses="flex-1" route={ROUTES.COLLECTION} />
    </section>
    <HomeFilter />
     <div className="max-sm:px-3">
        <DataRender
          success={success}
          error={error}
          data={collection}
          empty={EMPTY_QUESTION}
        >
          {collection.map((item) => (
            <QuestionCard key={item._id} question={item.question} />
          ))}
        </DataRender>
     </div>
   </Suspense>
   </>
  );
}


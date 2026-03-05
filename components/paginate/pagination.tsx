"use client"

import React from 'react'
import { cn } from '../../lib/utils';
import { formUrlQuery, removeKeysFromQuery } from '../../lib/url';
import { useRouter, useSearchParams } from 'next/navigation';
interface Props{
    page:number| undefined | string;
    isNext:boolean;
    containerClasses?:string;
}

function Pagination({page=1, isNext, containerClasses}:Props) {
    const searchParams=useSearchParams();
    const router=useRouter();
    const currentPage = Number(page) || 1;
    const handleNavigation=(type:'prev' | "next")=>{
    const nextPageNumber=
        type==='prev' ? currentPage - 1 : currentPage + 1;
    const newUrl = nextPageNumber <= 1
      ? removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["page"],
        })
      : formUrlQuery({
          params:searchParams.toString(),
          key:"page",
          value:nextPageNumber.toString()
        });
    router.push(newUrl)
}
  return (
    <div className={cn("mx-auto flex w-full mt-20 items-center justify-center gap-2", containerClasses)}>
        {currentPage > 1 &&( 
            <button className="bg-gray-400 text-white hover:bg-gray-300 cursor-pointer rounded-sm px-2 py-0.5" onClick={()=>handleNavigation('prev')}  >
                Prev
            </button >
        ) }
        <div className='btn bg-chart-5 text-white px-3 py-0.5 rounded-md'>{currentPage}</div>
        {isNext && (
            <button className='bg-gray-400 text-white hover:bg-gray-300 cursor-pointer py-0.5 px-2 rounded-sm' onClick={()=>handleNavigation('next')}>
                Next
            </button>
        )}
    </div>
  )
}

export default Pagination

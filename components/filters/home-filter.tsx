"use client"
import React from 'react'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '../../lib/utils';
import { removeKeysFromQuery } from '../../lib/url';
import qs from "query-string";
const filters =[
    {name:"React", value:"react"},
    {name:"JavaScript", value:"javascript"},
]

function HomeFilter() {
    const router=useRouter();
    const searchParams=useSearchParams();
    const active=searchParams.get("filter") || ""
    const HandleClickType = (filter:string)=>{
        let newUrl = "";
        if(filter===active){
            newUrl= removeKeysFromQuery({
                params:searchParams.toString(),
                keysToRemove:["filter", "query"]
            })
        }else{
            const queryString = qs.parse(searchParams.toString());
            delete queryString.query;
            queryString.filter = filter.toLowerCase();

            newUrl = qs.stringifyUrl({
                url: window.location.pathname,
                query: queryString,
            });
        }
      router.push(newUrl,{scroll:false})
    }
  return (
    <div className='mt-10 hidden flex-wrap gap-3 sm:flex '>
        {
            filters.map((filter)=>(
                <Button onClick={()=>HandleClickType(filter.value)} className={cn(`rounded-md shadow-none  px-6 py-3 font-medium capitalize cursor-pointer`, 
                    active===filter.value?"":
                    "dark:bg-gray-800 text-light bg-gray-300 hover:bg-gray-100"
                )} key={filter.name}  >
                    {filter.name}
                </Button>
            ))
        }
    </div>
  )
}

export default HomeFilter

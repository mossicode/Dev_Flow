"use client"

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { formUrlQuery } from "../../lib/url";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Filter{
    name:string;
    value:string;
}
interface Props{
    filters:Filter[];
    otherClasses?:string;
    containerClasses?:string;
}
export default function CommonFilter({filters, otherClasses='', containerClasses=''}:Props) {
    const router=useRouter();
    const searchParams=useSearchParams();
    const paramsFilter=searchParams.get("filter");
    const handleUpdateParams=(value:string)=>{
        const newUrl=formUrlQuery({
            params:searchParams.toString(),
            key:"filter",
            value
        })
        router.push(newUrl, {scroll:false})
    };

  return (
    <div className={cn("relative mx-auto w-full", containerClasses)}>
      <Select onValueChange={handleUpdateParams} value={paramsFilter || undefined}>
        <SelectTrigger className={cn("w-full sm:w-fit", otherClasses)}>
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent className="">
          {filters.map((item) => (
            <SelectItem value={item.value} key={item.value} className="">
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

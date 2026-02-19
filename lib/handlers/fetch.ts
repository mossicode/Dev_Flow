import { ActionResponse } from "../../types/global";
import { RequestError } from "../http-errors";
import handleError from "./error";

interface fetchOption extends RequestInit{
    timeout?:number
}
function isError(error:unknown):error is Error{
    return error instanceof Error;
}
export async function fetchHandler<T>(url:string, options:fetchOption ={}):Promise<ActionResponse<T>>{
    const {timeout=5000, headers:customHeaders={}, ...restOption}=options;
    const controller=new AbortController();
    const id = setTimeout(()=> controller.abort(), timeout);
    const defaultHeaders:HeadersInit={
        "Content-Type":"application/json",
        Accept:"application/json"
    }
    const headers:HeadersInit ={...defaultHeaders, ...customHeaders};
    const config:RequestInit={
        ...restOption,
        headers,
        signal:controller.signal,
    }
    try {
        const response=await fetch(url, config)
        clearTimeout(id)
        if(!response.ok){
            throw new RequestError(response.status, `HTTP error: ${response.status}`)
        }
        return await response.json();
    } catch (err) {
        const error=isError(err) ? err:new Error("Unknow error");
        if(error.name==="AbortError"){
            console.log(`timeout`)
        }else{
            console.log(`${error.message}`)
        }
        return handleError(error) as ActionResponse<T>
    }
}
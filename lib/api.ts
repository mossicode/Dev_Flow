import { IAccount } from "../database/account.model";
import { IUser } from "../database/user.model";
import { SignInWithOAuthParams } from "../types/action";
import { fetchHandler } from "./handlers/fetch";

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) return process.env.NEXT_PUBLIC_API_BASE_URL;
  if (process.env.AUTH_URL) return `${process.env.AUTH_URL}/api`;
  if (process.env.NEXTAUTH_URL) return `${process.env.NEXTAUTH_URL}/api`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`;
  return "http://localhost:3000/api";
};

const API_BASE_URL = getApiBaseUrl();
export const api = {
    auth:{
        oAuthSignIn:({user, provider, providerAccountId}:SignInWithOAuthParams)=>{
            return fetchHandler(`${API_BASE_URL}/auth/signin-with-oauth`,{
                method:"POST",
                body:JSON.stringify({user, provider, providerAccountId})
            })
        }
    },
    users:{
        getAll:()=>fetchHandler(`${API_BASE_URL}/users`),
        getById:(id:string)=>fetchHandler(`${API_BASE_URL}/users/${id}`),
        getByEmail:(email:string)=>fetchHandler(`${API_BASE_URL}/users/email/`, {
            method:"POST",
            body:JSON.stringify({email})
        }),
        create:(userData:Partial<IUser>)=>fetchHandler(`${API_BASE_URL}/users`, {
            method:"POST",
            body:JSON.stringify(userData),
        }),
        update:(id:string, userData:Partial<IUser>)=>fetchHandler(`${API_BASE_URL}/users/${id}`, {
            method:"PUT",
            body:JSON.stringify(userData)
        }),
        delete:(id:string)=>fetchHandler(`${API_BASE_URL}/users/${id}`, {
            method:"DELETE"
        })
    },
      accounts:{
        getAll:()=>fetchHandler(`${API_BASE_URL}/accounts`),
        getById:(id:string)=>fetchHandler(`${API_BASE_URL}/accounts/${id}`),
        getByProvider:(providerAccountId:string)=>fetchHandler(`${API_BASE_URL}/accounts/provider/`, {
            method:"POST",
            body:JSON.stringify({providerAccountId})
        }),
        create:(accountData:Partial<IAccount>)=>fetchHandler(`${API_BASE_URL}/accounts`, {
            method:"POST",
            body:JSON.stringify(accountData),
        }),
        update:(id:string, accountData:Partial<IAccount>)=>fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
            method:"PUT",
            body:JSON.stringify(accountData)
        }),
        delete:(id:string)=>fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
            method:"DELETE"
        })
    }
}

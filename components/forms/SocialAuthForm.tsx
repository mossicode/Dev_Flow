"use client"
import React from 'react'
// import { signIn } from '../../auth';
import ROUTES from '../../constants/Route';
import { signIn } from 'next-auth/react';
import { cn } from '../../lib/utils';


export default function SocialAuthForm() {
    const buttonClass='min-h-12 flex-1 text-gray-900 rounded-sm px-4 py-3.5 max-sm:px-1 max-sm:text-xs font-bold max-sm:py-1';
    const handleSignIn =async(provider:'github')=>{
      try{
      //  throw new Error ("not implemented")
      await signIn(provider,{
        callbackUrl:ROUTES.HOME,
        redirect:true
      })
      } catch(error){
        console.log(error)
        alert("fialed")
      }
    }
  return (
    <div className='flex flex-wrap mt-10 gap-2.5'>
     <button className={cn("bg-blue-400",buttonClass)} onClick={()=>(handleSignIn("github"))}>
        Login with GitHub
     </button>
    </div>
  )
}

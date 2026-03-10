"use client"
import React, { useEffect, useMemo, useState } from 'react'
// import { signIn } from '../../auth';
import ROUTES from '../../constants/Route';
import { getProviders, signIn } from 'next-auth/react';
import { cn } from '../../lib/utils';


export default function SocialAuthForm() {
    const [availableProviders, setAvailableProviders] = useState<string[]>([]);

    useEffect(() => {
      let mounted = true;

      const loadProviders = async () => {
        const providers = await getProviders();
        if (!mounted || !providers) return;
        setAvailableProviders(Object.keys(providers));
      };

      loadProviders();

      return () => {
        mounted = false;
      };
    }, []);

    const oauthProviders = useMemo(
      () => availableProviders.filter((provider) => provider !== "credentials"),
      [availableProviders]
    );

    const buttonClass='min-h-12 flex-1 text-gray-900 rounded-sm px-4 py-3.5 max-sm:px-1 max-sm:text-xs font-bold max-sm:py-1';
    const handleSignIn =async(provider:string)=>{
      try{
      //  throw new Error ("not implemented")
      await signIn(provider,{
        callbackUrl:ROUTES.HOME,
        redirect:true
      })
      } catch(error){
        console.log(error)
        
      }
    }
  return (
    <div className='flex flex-wrap mt-10 gap-2.5'>
     {oauthProviders.includes("github") && <button className={cn("bg-blue-400",buttonClass)} onClick={()=>(handleSignIn("github"))}>
        Login with GitHub
     </button>}
     {oauthProviders.includes("google") && <button className={cn("bg-red-400",buttonClass)} onClick={()=>(handleSignIn("google"))}>
        Login with Google
     </button>}
    </div>
  )
}

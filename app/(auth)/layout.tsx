
import Image from 'next/image'
import React, { ReactNode } from 'react'
import SocialAuthForm from '../../components/forms/SocialAuthForm'

export default function AuthLayout({children}:{children:ReactNode}) {
  return (
    <main className='flex justify-center items-center h-screen bg-amber-100 '>
        <section className=' w-lg shadow  rounded-lg p-4 border bg-gray-900'>
          <div className='flex items-center justify-between gap-2'>
            <div className='space-y-1 mb-4 text-gray-50 '>
              <h1 className='font-bold text-black'>Joined DewFlow</h1>
              <p className='text-gray-600'>To get your answer</p>
            </div>
            <Image src="/logo.png" alt='P' height={20} width={23} />
          </div>
            {children}
            <SocialAuthForm />
        </section>

        
    </main>
  )

}

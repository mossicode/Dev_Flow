import  { ReactNode } from 'react'
import Navbar from '../../components/navigation/navbar'
import LeftSidebar from '../../components/navigation/LeftSidebar'
import RightSidebar from '../../components/navigation/RightSidebar'

export default function RootLayout({children}:{children:ReactNode}) {
  return (
    <main className=''>
       <Navbar />
        <div className='h-screen flex'>
          <LeftSidebar />
          <section className='px-0 pb-6 pt-30 max-md:pb-14 sm:px-14 lg:ml-60 w-full lg:me-64 xl:mr-60'>
            <div className='mx-auto w-full  '>
              {children}
            </div>
          </section>
          <RightSidebar />
        </div>
        
    </main>
  )
}

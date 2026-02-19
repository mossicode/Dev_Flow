import  { ReactNode } from 'react'
import Navbar from '../../components/navigation/navbar'
import LeftSidebar from '../../components/navigation/LeftSidebar'
import RightSidebar from '../../components/navigation/RightSidebar'

export default function RootLayout({children}:{children:ReactNode}) {
  return (
    <main className=''>
       <Navbar />
        <div className='h-screen'>
          <LeftSidebar />
          <section className='px-6 pb-6 pt-36 max-md:pb-14 sm:px-14 lg:ml-66.5 xl:mr-87.5'>
            <div className='mx-auto w-full max-w-5xl '>
              {children}
            </div>
          </section>
          <RightSidebar />
        </div>
        
    </main>
  )
}

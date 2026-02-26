import  { ReactNode } from 'react'
import Navbar from '../../components/navigation/navbar'
import LeftSidebar from '../../components/navigation/LeftSidebar'
import RightSidebar from '../../components/navigation/RightSidebar'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar */}
        <div className="w-56 max-sm:hidden max-lg:w-52 mt-26">
          <LeftSidebar />
        </div>

        {/* Main Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6 pt-30">
          
          {children}
        </main>

        {/* Right Sidebar */}
        <div className="w-64 max-lg:hidden no-scrollbar">
          <RightSidebar />
        </div>

      </div>
    </div>
  )
}
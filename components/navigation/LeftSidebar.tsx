import Link from "next/link"
import NavLinks from "./navbar/nav-links"
import ROUTES from "../../constants/Route"
import { Github,  LogInIcon } from "lucide-react"

function LeftSidebar() {
  return (
    <section className="custom-scrollbar fixed left-0 top-0 z-40 h-screen flex flex-col
     justify-between overflow-y-auto border-r border-gray-800 p-6 pt-36 shadow dark:shadow-none  max-sm:hidden max-sm:bg-amber-100 lg:w-66.5 ">
      <div className="flex flex-1 flex-col gap-6 ">
        <NavLinks />
      </div>
      <div className="flex flex-col gap-3">
      
    
    
        <button className="w-full py-2 rounded-lg bg-slate-800 
          text-center mx-auto flex flex-col items-center
        text-white font-semibold hover:bg-slate-700 
          transition duration-200 border border-slate-600">
            <Link href={ROUTES.SIGN_IN}
            className="flex py-2 gap-x-2" >
           <LogInIcon />
            <span className="max-lg:hidden">Log in</span>
            </Link>
        </button>
        
        
        <button className="w-full py-2 rounded-lg text-white font-semibold  text-center mx-auto flex flex-col items-center
              bg-linear-to-r from-indigo-600 to-purple-600 
              hover:from-indigo-700 hover:to-purple-700 
              transition-all duration-300 shadow-lg hover:shadow-xl ">
          <Link href={ROUTES.SIGN_UP} className="flex py-2 gap-x-2">
          <Github />
            <span >Sign Up</span>
            </Link>
        </button>
        
    
      </div>
    </section>
  )
}

export default LeftSidebar

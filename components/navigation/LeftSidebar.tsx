import Link from "next/link"
import NavLinks from "./navbar/nav-links"
import ROUTES from "../../constants/Route"
import { Github,  LogInIcon, } from "lucide-react"
import { auth, signOut } from "../../auth"
import { LogOutIcon } from "lucide-react"

async function LeftSidebar() {
  const session=await auth();
  const userId=session?.user.id;
  return (
    <section className="flex h-full flex-col justify-between overflow-y-auto no-scrollbar border-r border-gray-800/70 bg-white/90 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:bg-slate-950/85 dark:shadow-none max-sm:hidden">
      <div>
             <div className="flex flex-1 flex-col gap-3">
        <NavLinks userId={userId} />
      </div>
      {
        userId 
        ?
        <>
          <form action={
            async ()=>{
              "use server";
              await signOut();
            }
          } className="flex gap-x-2 mt-3">
            <LogOutIcon />
            <button type="submit" className="text-gray-400">Logout</button>
          </form>
        </>
        :
        <>
    <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
        <Link
          href={ROUTES.SIGN_IN}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 max-md:px-2 max-md:py-1.5 text-center max-md:bg-transparent max-md:border-none font-semibold text-white transition hover:bg-slate-700"
        >
          <LogInIcon size={18}  className="max-md:w-12 max-md:h-5" />
          <span className="max-md:hidden">Sign In</span>
        </Link>
        <Link
          href={ROUTES.SIGN_UP}
          className="flex w-full  items-center justify-center gap-2 rounded-xl md:bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-4 py-2.5 max-md:px-1 max-md:py-1.5 text-center font-semibold text-white shadow-md transition hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400  max-md:bg-transparent max-md:border-none "
        >
          <Github size={18} className="max-md:w-16" />
          <span className="max-md:hidden">Create Account</span>
        </Link>
      </div>
        </>
      }
      
      </div>
    </section>
  )
}

export default LeftSidebar

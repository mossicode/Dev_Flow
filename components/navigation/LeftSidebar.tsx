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
    <section className="custom-scrollbar fixed left-0 top-20 z-40 flex h-[calc(100vh-5rem)] w-64 flex-col justify-between overflow-y-auto border-r border-gray-800/70 bg-white/90 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:bg-slate-950/85 dark:shadow-none max-sm:hidden">
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
          }>
            <LogOutIcon />
            <button type="submit">Logout</button>
          </form>
        </>
        :
        <>
    <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
        <Link
          href={ROUTES.SIGN_IN}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-center font-semibold text-white transition hover:bg-slate-700"
        >
          <LogInIcon size={18} />
          <span>Sign In</span>
        </Link>
        <Link
          href={ROUTES.SIGN_UP}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-4 py-2.5 text-center font-semibold text-white shadow-md transition hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400"
        >
          <Github size={18} />
          <span>Create Account</span>
        </Link>
      </div>
        </>
      }
      
    </section>
  )
}

export default LeftSidebar

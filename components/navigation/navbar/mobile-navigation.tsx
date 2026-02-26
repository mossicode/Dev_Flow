"use client"
import Link from "next/link"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet"
import ROUTES from "../../../constants/Route"
import NavLinks from "./nav-links";
import {  Menu } from "lucide-react";
import Image from "next/image";
export default function MobileNavigation({ userId }: { userId?: string }) {
  return (
    <div className="hidden max-sm:block">
        
 <Sheet >
  <SheetTrigger  >
    <Menu className="text-white" />
  </SheetTrigger>
  <SheetContent className="">
    
      <SheetTitle className="hidden">Navigation</SheetTitle>
      {/* <SheetDescription className="">This action cannot be undone.</SheetDescription> */}
       <Link href="/" className="flex items-center gap-1 pt-4 ps-4">
       <Image src="/logo.png" alt="logo" width={20} height={20} /> 
       <p className="font-medium  text-gray-900 dark:text-white ">Dew
          <span className="text-amber-600">
              Flow
          </span>
         </p>
       </Link>
       <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-visible ">
            <SheetClose >
                <section className="flex h-full flex-col gap-4 pt-4 px-2">
                    <NavLinks isMobileNav userId={userId} />
                </section>
            </SheetClose>
            <div className="flex flex-col gap-3 px-3 mt-2">
                <SheetClose asChild >
                    
                    <Link href={ROUTES.SIGN_IN} >
                       <button className="w-full  p-1.5 text-xs bg-gray-900 rounded-sm">
                           <span className="">Log in</span>
                       </button>
                    </Link>
                </SheetClose>
                <SheetClose asChild >
                    
                    <Link href={ROUTES.SIGN_UP} >
                       <button className="w-full bg-gray-700 p-2 rounded-sm">
                           <span className="">Sign Up</span>
                       </button>
                    </Link>
                </SheetClose>
            </div>
       </div>
  </SheetContent>
</Sheet>
    </div>
  )
}


"use client"
import React from 'react'
import { sidebrarLinks } from '../../../constants'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '../../../lib/utils'
import { SheetClose } from '../../ui/sheet'

function NavLinks({isMobileNav=false}:{isMobileNav?:boolean}) {
    const pathName=usePathname()
  return (
    <div >
      {
        sidebrarLinks.map((item)=>{
            const isActive =
              (item.route.length > 1 && pathName.startsWith(item.route)) ||
              pathName === item.route;

            const LinkComponent =(
                <Link href={item.route} className={cn("p-3 rounded-lg cursor-pointer transition-colors duration-500 ease-in-out",
                    isActive?"bg-indigo-500 text-white shadow-md shadow-indigo-400/50 animate-pulse"
                        :"bg-transparent text-gray-700 dark:text-gray-300",
                    "flex items-center justify-start gap-4 p-3"
                )} key={item.label}>
                    <p className={cn(
                        isActive ? "font-bold" :"font-light"
                    )}>{item.label}</p>
                </Link>
            )
            return isMobileNav ?(
                <SheetClose asChild key={item.route}>
                    {LinkComponent}
                </SheetClose>
            ):(
                <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
            )
        })
      }
   
    </div>
  )
}

export default NavLinks

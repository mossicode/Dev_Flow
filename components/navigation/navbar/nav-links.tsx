"use client"
import React from 'react'
import { sidebrarLinks } from '../../../constants'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '../../../lib/utils'
import ROUTES from '../../../constants/Route'
import { SheetClose } from '../../ui/sheet';
function NavLinks({ isMobileNav = false, userId }: { isMobileNav?: boolean, userId?: string }) {
  const pathName = usePathname();
  return (
    <div className=''>
      {sidebrarLinks.map((item) => {
        const Icons=item.imgURL;
        const href = item.label === "profile"
          ? (userId ? ROUTES.PROFILE(userId) : ROUTES.SIGN_IN)
          : item.route

        const isActive =
          (href.length > 1 && pathName.startsWith(href)) ||
          pathName === href

        const LinkComponent = (
          <Link
            href={href}
            className={cn(
              "px-3 rounded-lg cursor-pointer no-scrollbar transition-colors duration-500 ease-in-out",
              isActive ? "bg-chart-5" : "text-orange-700",
              "flex items-center justify-start gap-3 p-1.5"
            )}
            key={item.label}
          >
            <Icons className={cn("" ,isActive ? "text-white":"text-gray-500")} size={20} />
            <p className={cn("",isActive ? "font-bold text-white" : "font-light dark:text-white text-black",
              isMobileNav?"":"max-md:hidden"
            )}>{item.label}</p>
          </Link>
        )

        return isMobileNav ? (
          <SheetClose asChild key={item.route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
        )
      })}
    </div>
  )
}

export default NavLinks

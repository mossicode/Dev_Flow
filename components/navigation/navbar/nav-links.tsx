"use client"
import React from 'react'
import { sidebrarLinks } from '../../../constants'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '../../../lib/utils'
import ROUTES from '../../../constants/Route'
import { SheetClose } from '../../ui/sheet'

function NavLinks({ isMobileNav = false, userId }: { isMobileNav?: boolean, userId?: string }) {
  const pathName = usePathname()

  return (
    <div>
      {sidebrarLinks.map((item) => {
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
              "px-3 rounded-lg cursor-pointer transition-colors duration-500 ease-in-out",
              isActive ? "bg-indigo-950 text-white shadow-md shadow-indigo-400/50" : "bg-transparent text-gray-700 dark:text-gray-300",
              "flex items-center justify-start gap-3 p-1.5"
            )}
            key={item.label}
          >
            <p className={cn(isActive ? "font-bold" : "font-light")}>{item.label}</p>
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

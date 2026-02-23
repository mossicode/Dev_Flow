"use client"
import { Search } from "lucide-react"
import { cn } from "../../lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { removeKeysFromQuery } from "../../lib/url"
import qs from "query-string"

interface SearchTypeProps {
  route: string
  imgSrc: string
  placeholder: string
  otherClasses?: string
}

function LocalSearch({ imgSrc, route, placeholder, otherClasses }: SearchTypeProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchParamsString = searchParams.toString()
  const query = searchParams.get("query") || ""
  const [searchQuery, setSearchQuery] = useState(query)

  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const trimmedSearchQuery = searchQuery.trim()
      const trimmedCurrentQuery = query.trim()

      // Avoid pushing identical URL state, which creates a rerender loop.
      if (trimmedSearchQuery === trimmedCurrentQuery) return

      if (trimmedSearchQuery) {
        const queryString = qs.parse(searchParamsString)
        delete queryString.filter
        queryString.query = trimmedSearchQuery

        const newUrl = qs.stringifyUrl({
          url: pathname,
          query: queryString,
        })

        router.push(newUrl, { scroll: false })
        return
      }

      if (pathname === route && query) {
        const newUrl = removeKeysFromQuery({
          params: searchParamsString,
          keysToRemove: ["query"],
        })

        router.push(newUrl, { scroll: false })
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, query, pathname, route, router, searchParamsString])

  return (
    <div className={cn("min-h-14 flex grow items-center rounded-sm px-4 bg-gray-100 gap-x-2 ", otherClasses)}>
      <Search className="cursor-pointer text-black" />

      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
        }}
        className="no-focus border-none shadow-none ring-0 outline-0 text-black"
      />
    </div>
  )
}

export default LocalSearch

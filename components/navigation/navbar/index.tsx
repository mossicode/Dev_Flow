import Image from "next/image";
import Link from "next/link";
// import Theme from "./Theme";
import MobileNavigation from "./mobile-navigation";
import { Theme } from "./Theme";
import { auth } from "../../../auth";

export default async function Navbar() {
  const session=await auth();
  return (
    <div className=" flex-between fixed z-50 w-full gap-5 bg-blend-lighten px-5 bg-gray-800 py-4 ">
      <Link href="/" className="flex items-center gap-1">
         <Image src="/logo.png" width={23} height={23} alt="an image" />
         <p className="font-medium  text-gray-900 dark:text-white ">Dew
          <span className="text-amber-600">
              Flow
          </span>
         </p>
      </Link>
      <p className="text-nowrap bg-chart-3">Global Search</p>
      <div className="flex gap-x-2 items-center ">
        <MobileNavigation />
          
       
        <Theme />
        <Image src={session.user.image} alt={session.user.name} height={35} width={35} className="rounded-full object-fit" />
      </div>
    </div>
  )
}

import Image from "next/image";
import Link from "next/link";
import MobileNavigation from "./mobile-navigation";
import { Theme } from "./Theme";
import { auth } from "../../../auth";

export default async function Navbar() {
  let session = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }
  const userImage = session?.user?.image || "/avatar.png";
  const userName = session?.user?.name || "User";
  const userId = session?.user?.id;

  return (
    <div className=" flex-between fixed z-50 w-full gap-5 bg-blend-lighten px-5 bg-neutral-900 py-4 max-sm:px-2 ">
      <Link href="/" className="flex items-center gap-1">
         <Image src="/logo1.png" width={23} height={23} alt="an image" />
         <p className="font-medium  text-gray-900 dark:text-white max-sm:hidden">Dew
          <span className="text-amber-600 ">
              Flow
          </span>
         </p>
      </Link>
      <p className="text-nowrap text-white">Global Search</p>
      <div className="flex gap-x-2 items-center ">
        <MobileNavigation userId={userId} />

        <div className="max-sm:hidden">
          <Theme />
        </div>
        <Image src={userImage} alt={userName} height={35} width={35} className="rounded-full object-fit max-sm:w-6" />
      </div>
    </div>
  )
}

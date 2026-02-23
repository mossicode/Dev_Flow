import Image from "next/image";
import Link from "next/link";
// import Theme from "./Theme";
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
        <MobileNavigation userId={userId} />

        <Theme />
        <Image src={userImage} alt={userName} height={35} width={35} className="rounded-full object-fit" />
      </div>
    </div>
  )
}

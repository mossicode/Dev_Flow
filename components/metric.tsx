import Image from "next/image";
import Link from "next/link";

interface Props{
    imgUrl?:string;
    alt:string;
    value:number | string;
    title:string;
    href?:string;
    textStyle:string;
    imgStyle?:string;
    isAuthor?:boolean

}
function Metric({imgUrl, alt, value, title, href, textStyle, imgStyle, isAuthor}:Props) {
    const hasProfileImage = Boolean(
        imgUrl &&
        imgUrl.trim() &&
        imgUrl !== "/avatar.png" &&
        !imgUrl.includes("placehold.co")
    );
    const fallbackInitial = String(value || alt || "U").trim().charAt(0).toUpperCase();
    const metricContent =(
        <>
        {hasProfileImage ? (
            <Image src={imgUrl as string} alt={alt} width={16} height={16}
            className={`rounded-full object-contain ${imgStyle}`} />
        ) : isAuthor ? (
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-semibold text-white">
                {fallbackInitial}
            </div>
        ) : null
        }
            <p className={`${textStyle} flex items-center gap-1`}>
                {value}
                <span className={`line-clamp-1${isAuthor?"max-sm:hidden":""}`}>{title}</span>
            </p>
        </>
    )
  return href ? (
    <Link href={href} className="flex-center gap-1 ">
        {metricContent}
    </Link >
  ): <div className="flex-center gap-1 ">
    {metricContent}
  </div>
}

export default Metric

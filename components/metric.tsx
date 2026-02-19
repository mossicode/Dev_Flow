import Image from "next/image";
import Link from "next/link";

interface Props{
    imgUrl:string;
    alt:string;
    value:number | string;
    title:string;
    href?:string;
    textStyle:string;
    imgStyle?:string;
    isAuthor?:boolean

}
function Metric({imgUrl, alt, value, title, href, textStyle, imgStyle, isAuthor}:Props) {
    const metricContent =(
        <>
        <Image src={imgUrl} alt={alt} width={16} height={16}
            className={`rounded-full object-contain ${imgStyle}`} />
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
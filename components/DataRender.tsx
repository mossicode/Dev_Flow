import { DEFAULT_EMPTY, DEFAULT_ERROR } from '../constants/states';
import Image from 'next/image';
import Link from 'next/link';
interface Props<T>{
success:boolean,
error?:{
  message:string;
  details?:Record<string, string[]>; 
}
 data:T[] | null | undefined,
children?:React.ReactNode
 empty:{
    title:string;
    message:string;
    button?:{
      text:string;
      href:string;
    }
  };
}
interface StateSkeletonProps{
  image:{
    light:string;
    dark:string;
    alt:string;
  };
  title:string;
  message:string;
  button?:{
    text:string;
    href:string
  }
}
const StateSkeleton=({image, title, message, button}:StateSkeletonProps)=>{
  return (
    <div className='mt-16 max-sm:mt-6 flex w-full flex-col items-center justify-center sm:mt-10 gap-y-2'>
      <>
        <Image src={image.dark} alt={image.alt} height={200} width={200} className='hidden dark:block' />
        <Image src={image.light} alt={image.alt} height={200} width={200} className='block dark:hidden' />
        <h2 className='font-bold w-full text-wrap'>{title}</h2>
        <p className='text-gray-400 text-center'>{message}</p>
        {button && <Link href={button.href}><button className='bg-white text-black mb-5 px-3 py-1 rounded-sm font-serif'>{button.text}</button></Link>}
      </>
    </div>
  );
}
export default function DataRender<T>({
  success,
  error,
  data,
  empty={EMPTY_TAGS},
  children
}:Props<T>) {
  if(!success){
    return <StateSkeleton
     image={
    { light:"/close.png",
      dark:"/close.png",
      alt:"empty"
    }
  }
  title={error?.message || DEFAULT_ERROR.title}
  message={error?.details 
    ? JSON.stringify(error.details, null, 2)
    : DEFAULT_ERROR.message

  }
  button={DEFAULT_ERROR.button}
    />
  }
  if(!data || data.length===0) return <StateSkeleton 
  image={
    { light:"/close.png",
      dark:"/close.png",
      alt:"empty"
    }
  }
  title={empty.title}
  message={empty.message}
  button={empty.button}

/> 
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

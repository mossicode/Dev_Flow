import Link from 'next/link';
import ROUTES from '../../constants/Route';
import { X } from 'lucide-react';
import { getTechDescription } from '../../lib/utils';

interface Props{
    _id:string;
    name:string,
    question?:number;
    questions?:number;
    showCount?:boolean;
    compact?:boolean;
    remove?:boolean;
    isButton?:boolean;
    handleRemove?:()=>void
    
}
function TagCard({
  _id,
  name,
  question,
  questions,
  showCount,
  compact=false,
  remove,
  isButton,
  handleRemove
  }:Props) {
    const desc=getTechDescription(name);
    const questionCount = question ?? questions ?? 0;

    const showRemove = Boolean(remove && handleRemove);
    const content = <div className='w-full flex justify-between items-center gap-1'>
           <div className='flex items-center gap-1 px-4 py-1.5 border-none rounded-md uppercase text-xs bg-gray-200 text-slate-900 dark:bg-gray-900 dark:text-slate-100'>
            <span className='font-semibold text-xs'>{name}</span>
            {showRemove && (
              <button
                type='button'
                aria-label={`Remove ${name} tag`}
                onClick={handleRemove}
                className='inline-flex items-center justify-center rounded hover:text-red-500'
              >
                <X size={14} />
              </button>
            )}
        </div>
        <div>
          {showCount && <p className='text-base'>{questionCount}</p>}
        </div>
        
       </div>
  if (isButton || showRemove ) {
    return content;
  }

  if (!compact) {
    return (
    <Link href={ROUTES.TAG(_id)} >
      
      {content}
    </Link>
  )
  } else{
    return (
     <div className='flex size-46 justify-between border rounded-md p-4'>
       <Link href={ROUTES.TAG(_id)}>
         <h2 className='pb-2 font-bold text-lg '>{name}</h2>
         <p className=''>{questionCount} questions</p>
         {desc}
      </Link>
     </div>
    )
  }
}

export default TagCard

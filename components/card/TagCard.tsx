import Link from 'next/link';
import ROUTES from '../../constants/Route';
import { X } from 'lucide-react';

interface Props{
    _id:string;
    name:string,
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
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove
  }:Props) {
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
          {showCount && <p className='text-base'>{questions}</p>}
        </div>
        
       </div>
  if (isButton || showRemove) {
    return content;
  }

  return (
    <Link href={ROUTES.TAG(_id)} >
      {content}
    </Link>
  )
}

export default TagCard

import Image from 'next/image';
import type { Answer } from '../../types/global';
import { getTimeStamp } from '../../lib/utils';
import Preview from '../editor/Preview';

function AnswerCard({ _id, author, content, createdAt }: Answer) {
  const initial = author?.name?.trim()?.charAt(0)?.toUpperCase() || "?";
  return (
    <article className='border-b py-6 '>
        <span id={JSON.stringify(_id)}>
            <div className="flex items-center ">
                <div className="flex items-center gap-x-1.5">                    
                    {author?.image ? (
                      <Image src={author.image} alt={author.name} className='rounded-full object-cover' height={23} width={23} />
                    ) : (
                      <div
                        className="flex h-[23px] w-[23px] items-center bg-amber-600 text-white justify-center rounded-full border border-gray-300 text-[11px] font-semibold text-gray-700"
                        aria-label={author?.name || "User"}
                      >
                        {initial}
                      </div>
                    )}
                    <div className='flex  gap-x-1.5 max-sm:flex-col'>
                        <span>{author.name }</span> 
                        <span className='text-gray-400'> Answered {getTimeStamp(createdAt)}</span>
                    </div>
                </div>
            </div>
            <div className='ps-7'>
                    <Preview content={content} />
                </div>
        </span>
    </article>
  )
}

export default AnswerCard

import Image from 'next/image';
import Link from 'next/link';
import type { Answer } from '../../types/global';
import { getTimeStamp } from '../../lib/utils';
import Preview from '../editor/Preview';
import { Suspense } from 'react';
import Vote from "../../components/votes/vote"
import { hasVoted } from '../../lib/action/vote.action';
import ROUTES from '../../constants/Route';
import EditDeleteAction from '../user/edit-delete-action';

interface Props extends Answer {
  compact?: boolean;
  showActionBtns?:boolean
}

function AnswerCard({ _id, author, question, content, createdAt, upvotes, downvotes, compact = false, showActionBtns=false }: Props) {
  const initial = author?.name?.trim()?.charAt(0)?.toUpperCase() || "?";
  const shortContent = content.length > 30 ? `${content.slice(0, 30)}...` : content;
  const questionId = typeof question === "string" ? question : question?._id;
  const readMoreHref = questionId ? `${ROUTES.QUESTION(questionId)}#${_id}` : "#";
  const hasVotedPromise=hasVoted({
    targetId:_id,
    targetType:"answer"
  })
  return (
    <article className='border-b py-3 sm:py-6 '>
        <span id={String(_id)}>
          {showActionBtns && (
            <div>
              <EditDeleteAction type='answer' itemId={_id} />
            </div>
          )}
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-x-1.5">                    
                    {author?.image ? (
                      <Image src={author.image} alt={author.name} className='rounded-full object-cover' height={23} width={23} />
                    ) : (
                      <div
                        className="flex h-5.75 w-5.75 items-center bg-amber-600 text-white justify-center rounded-full border border-gray-300 text-[11px] font-semibold "
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
               <div>
                 <Suspense fallback={<div>Loading...</div>}>
                           <Vote
                           upVotes={upvotes} 
                           targetType="answer"
                           downVotes={downvotes} 
                            targetId={_id}
                           hasVotedPromise={hasVotedPromise}
                           />
                </Suspense>
               </div>
            </div>
            <div className='ps-3 sm:ps-7'>
              {compact ? (
                <div className='space-y-2'>
                  <p className='text-sm break-words'>{shortContent}</p>
                  <Link href={readMoreHref} className='text-xs underline text-blue-500'>
                    Read more
                  </Link>
                </div>
              ) : (
                <Preview content={content} />
              )}
            </div>
        </span>
    </article>
  )
}

export default AnswerCard

import React from 'react'
import type { Answer } from '../../types/global'
import DataRender from '../DataRender';
import { EMPTY_ANSWERS } from '../../constants/states';
import AnswerCard from '../card/answer-card';
import CommonFilter from '../filter/common-filter';
import { AnswerFilters } from '../../constants/filters';
import Pagination from '../paginate/pagination';

interface Props {
  data?: Answer[];
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  totalAnswers: number;
  page: number | string;
  isNext: boolean;
}

function AllAnswers({ data, success, error, totalAnswers, page, isNext }: Props) {
  return (
    <div className='mt-6'>
        <div className='flex justify-between items-center max-sm:flex-col max-sm:items-stretch gap-2'>
            <h3 className='text-orange-600 font-semibold'>{totalAnswers} {totalAnswers===1?"answer":"answers"}</h3>
            <div className='w-full sm:w-auto'>
                <CommonFilter filters={AnswerFilters} otherClasses='w-full' containerClasses='w-full' />
            </div>
        </div>
        <DataRender data={data} empty={EMPTY_ANSWERS} success={success} error={error} >
            {data?.map((answer)=>(
               <AnswerCard key={answer._id} {...answer} />
            ))}
        </DataRender>
        <Pagination page={page} isNext={isNext} containerClasses='mt-4' />
    </div>
  )
}

export default AllAnswers

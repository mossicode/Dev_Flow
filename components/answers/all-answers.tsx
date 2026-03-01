import React from 'react'
import type { Answer } from '../../types/global'
import DataRender from '../DataRender';
import { EMPTY_ANSWERS } from '../../constants/states';
import AnswerCard from '../card/answer-card';

interface Props {
  data?: Answer[];
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  totalAnswers: number;
}

function AllAnswers({ data, success, error, totalAnswers }: Props) {
  return (
    <div className='mt-6'>
        <div className='flex justify-between items-center'>
            <h3 className='text-orange-600 font-semibold'>{totalAnswers} {totalAnswers===1?"answer":"answers"}</h3>
            <div>
                filters
            </div>
        </div>
        <DataRender data={data} empty={EMPTY_ANSWERS} success={success} error={error} >
            {data?.map((answer)=>(
               <AnswerCard key={answer._id} {...answer} />
            ))}
        </DataRender>
    </div>
  )
}

export default AllAnswers

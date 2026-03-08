import React from 'react';
import { BadgeCount } from '../../types/global';
import { formatNumber } from '../../lib/utils';
import Image from 'next/image';

interface Props {
  totalAnswers: number;
  totalQuestions: number;
  badges: BadgeCount;
}

interface StatsCardProps {
  imgUrl:string;
  title: string;
  value: number;
}

const StatsCard = ({imgUrl, title, value }: StatsCardProps) => (
  <div className='rounded-xl flex border justify-start gap-x-3 items-center border-border bg-card p-2 shadow-sm w-full lg:min-w-full'>
    <Image src={imgUrl} alt={title} width={40} height={40}  />
    <div>
      <p className='text-lg font-semibold'>{formatNumber(value)}</p>
    <p className='mt-1 text-sm text-muted-foreground font-bold text-nowrap'>{title}</p>
    </div>
  </div>
);

function Stats({ totalAnswers, totalQuestions, badges }: Props) {
  return (
    <section className='mt-6 grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-4  xl:grid-cols-4'>
      <div className='p-4 rounded-xl flex justify-start gap-x-3 border shadow-md'>
        <div >
          <h1>{totalQuestions}</h1>
          <p className='font-bold text-sm mt-2'>Questions</p>
        </div>
        <div>
          <h1>{totalAnswers}</h1>
          <p className='font-bold text-sm mt-2'>Answers</p>
        </div>
      </div>
      
      <StatsCard imgUrl='/goldjpg.jpg' title='Gold Badges' value={badges.GOLD} />
      <StatsCard imgUrl='/silver.png'  title='Silver Badges' value={badges.SILVER} />
      <StatsCard imgUrl='/bronze.jpg'  title='Bronze Badges' value={badges.BRONZE} />
    </section>
  );
}

export default Stats;

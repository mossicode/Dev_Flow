import { getUserQuestion, getUsers } from '../../../../lib/action/user.action'
import { notFound } from 'next/navigation';
import { auth } from '../../../../auth';
import Image from 'next/image';
import dayjs from "dayjs"
import { Calculator, Locate } from 'lucide-react';
import Stats from '../../../../components/user/stats';
import DataRender from '../../../../components/DataRender';
import { EMPTY_QUESTION } from '../../../../constants/states';
import QuestionCard from '../../../../components/card/QuestionCard';
import Pagination from '../../../../components/paginate/pagination';

type ProfilePageProps = Promise<{ id: string }>;
type ProfileSearchParams = Promise<{ page?: string; pageSize?: string }>;

async function page({ params, searchParams }: { params: ProfilePageProps; searchParams: ProfileSearchParams }) {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  if (!id) notFound();

  const loggedInUser = await auth();
  const loggedInUserId = loggedInUser?.user?.id;
  const isOwnProfile = loggedInUserId === id;

  const { data, error, success } = await getUsers({ userId: id });

  if (!success) {
    return <div className='text-red-700'>{error?.message}</div>;
  }

  const { user, totalQuestion, totalAnswer } = data;
  const { name, username, location, bio, image, portfolio, createdAt } = user;
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  const {
    success: userQuestionSuccess,
    data: userQuestions,
    error: userQuestionError,
  } = await getUserQuestion({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const { questions, isNext: hasMoreQuestions } = userQuestions!;

  return (
    <>
      <section className='flex justify-between '>
        <div className='flex flex-col items-start max-md:mx-auto gap-2 lg-flex-row '>
          <div className='flex gap-x-3 max-md:flex-col gap-2 '>
            {image ? (
              <Image src={image} alt={name} height={100} width={100} className='rounded-full min-w-24' />
            ) : (
              <div className='w-25 h-25 min-w-24 items-center text-center flex flex-col justify-center border rounded-full bg-amber-500 font-bold text-white text-lg'>
                {initial}
              </div>
            )}

            <div>
              <div className='flex flex-col justify-between items-start space-y-3 max-md:space-y-1.5 '>
                <div className=''>
                  <h1>{name}</h1>
                  <p>@{username}</p>
                </div>

                <div className='flex flex-wrap items-center gap-x-4 gap-y-2 max-sm:gap-x-1 max-xs:flex-col max-xs:items-start'>
                  <div className='max-xs:w-full'>
                    {location && (
                      <div className='flex items-center gap-x-1.5'>
                        <Locate />
                        <h1>{location}</h1>
                      </div>
                    )}
                  </div>

                  <div>
                    {portfolio && <div className='flex items-center gap-x-1.5'>{portfolio}</div>}
                  </div>

                  <div className='flex items-center gap-x-1.5'>
                    <Calculator size={16} />
                    <h1>Created {dayjs(createdAt).format("MMM YYYY")}</h1>
                  </div>
                </div>
              </div>

              {bio && (
                <div className='my-4'>
                  <p>{bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='mt-3 sm:mt-0'>
          {isOwnProfile && (
            <div className='max-xs:mt-6'>
              <button className='bg-gray-400 px-5 py-1 rounded-sm text-white'> Edit</button>
            </div>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={totalQuestion}
        totalAnswers={totalAnswer}
        badges={{
          GOLD: 0,
          SILVER: 0,
          BRONZE: 0,
        }}
      />

      <DataRender success={userQuestionSuccess} error={userQuestionError} data={questions} empty={EMPTY_QUESTION}>
        {questions.map((question) => (
          <QuestionCard question={question} key={question._id} />
        ))}
      </DataRender>

      <Pagination page={page} isNext={hasMoreQuestions} />
    </>
  )
}

export default page

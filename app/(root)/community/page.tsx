import React from 'react'
import { RouteParams } from '../../../types/global'
import { getUser } from '../../../lib/action/user.action';
import LocalSearch from '../../../components/search/LocalSearch';
import ROUTES from '../../../constants/Route';
import DataRender from '../../../components/DataRender';
import { EMPTY_USERS } from '../../../constants/states';
import UserCard from '../../../components/card/user-card';

async function page({searchParams}:RouteParams) {
  const {page, pageSize, query, filter}=await searchParams;
  const {success, data, error}=await getUser({
    page:Number(page) | 1,
    pageSize:Number(pageSize) | 10,
    query,
    filter
  })
  const {users}=data || {};
  console.log(users)

  return (
    <div>
        <h1 className='font-bold mt-4'>All Users</h1>
        <div className='mt-6'>
          <LocalSearch 
            imgSrc='/home'
            placeholder='Search developers'
            route={ROUTES.COMMUNITY}
          />

          <DataRender data={users} success={success} error={error} empty={EMPTY_USERS}>
             <div className='flex flex-wrap gap-5' >
            {users.map((user)=>(
             
                <UserCard key={user._id}  {...user} />
            ))}
            </div>
          </DataRender>

        </div>
    </div>
  )
}

export default page

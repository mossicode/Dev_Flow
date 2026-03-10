import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import ROUTES from '../../constants/Route';
import type { User } from '../../types/global';


function UserCard({_id, name, image, username}:User) {
   const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
  return (
    <div className='mt-4 mx-auto text-center flex-1'>
        {image ? <Image  src={image} alt={name} width={72} height={72} className='border rounded-full mx-auto' />:
        (
            <div
                className="flex h-20 w-20 mx-auto items-center bg-amber-400 text-white justify-center rounded-full border border-gray-300 text-2xl font-semibold "
                aria-label={name || "User"}
                >
                {initial}
             </div>
        )
        }
           <h3 className='font-bold text-xl'>{name}</h3>
        <Link href={ROUTES.PROFILE(_id)}>
             <p className='font-light text-gray-700 dark:text-gray-200'>@{username}</p>
        </Link>
       

    </div>
  )
}

export default UserCard

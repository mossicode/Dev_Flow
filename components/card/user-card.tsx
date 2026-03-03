import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import ROUTES from '../../constants/Route';
import type { User } from '../../types/global';


function UserCard({_id, name, image, username}:User) {
   const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
  return (
    <div className='mt-4'>
        {image ? <Image  src={image} alt={name} width={60} height={60} className='border rounded-full' />:
        (
            <div
                className="flex h-15 w-15 items-center bg-amber-400 text-white justify-center rounded-full border border-gray-300 text-base font-semibold "
                aria-label={name || "User"}
                >
                {initial}
             </div>
        )
        }
           <h3 className='font-bold text-xl'>{name}</h3>
        <Link href={ROUTES.PROFILE(_id)}>
             <p className='font-light text-gray-700'>@{username}</p>
        </Link>
       

    </div>
  )
}

export default UserCard

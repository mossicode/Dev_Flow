import Link from 'next/link'
import ROUTES from '../constants/Route'

function notFound() {
  return (
    <div className='fixed top-0 left-0 h-screen w-screen '>
      <div className='flex h-full w-full flex-col items-center justify-center'>
          <h1>This page not Found you come to the wrong route</h1>
          <Link href={ROUTES.HOME}>HOME</Link>
      </div>
    </div>
  )
}

export default notFound

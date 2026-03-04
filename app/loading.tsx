import React from 'react'

function loading() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-linear-to-br from-neutral-50 via-white to-primary-50">
          <div className="loader" />
        </div>
  )
}

export default loading
import React from 'react'

const BigTitle = ( { text } : { text: string} ) => {
  return (
    <div className='w-full'>
        <h1 className='font-medium text-[35px] text-black tracking-wide'>{text}</h1>
    </div>
  )
}

export default BigTitle
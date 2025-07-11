import React from 'react'

export default function TypingIndicator() {
  return (
    <div className='flex flex-row items-center space-x-5 max-w-fit bg-gray dark:bg-boxdark-2 py-2 px-3.5 rounded-2xl '>
      <div className='ticontainer'>
        <div className='flex items-center h-[17px]'>
          <div className='tidot'></div>
          <div className='tidot'></div>
          <div className='tidot'></div>
        </div>
      </div>
    </div>
  )
}

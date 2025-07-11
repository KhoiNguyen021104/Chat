import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

export default function index() {
  return (
    <div className='h-screen overflow-hidden sm:h-screen bg-[#2e2e2e] pt-5 pr-5 pl-2 pb-5'>
      <div className='h-full rounded-sm   dark:bg-[#2e2e2e] xl:flex'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

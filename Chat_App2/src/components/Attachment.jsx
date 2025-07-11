import { File, Image, Paperclip } from '@phosphor-icons/react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ToogleDocumentModal, ToogleMediaModal } from '../redux/slices/app'

export default function Attachment() {
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const dispatch = useDispatch()
  const trigger = useRef(null)
  const dropdown = useRef(null)

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;

      if (!dropdown || dropdown.current.contains(target) || trigger.current.contains(target)) { return; }

      setDropDownOpen(false)
    }

    document.addEventListener("click", clickHandler)
    return () => {
      document.removeEventListener("click", clickHandler)
    }
  })

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdown.current || keyCode !== 27) return;
      setDropDownOpen(false)
    }
    document.addEventListener("keydown", keyHandler)
    return () => {
      document.removeEventListener("keydown", keyHandler)
    }
  })

  return (
    <div className='relative flex '>
      <button className='text-[#7f8a8f] hover:text-primary ' ref={trigger} onClick={(e) => { e.preventDefault(), setDropDownOpen((prev) => !prev) }}>
        <Paperclip weight='bold' size={20} />
      </button>

      <div ref={dropdown} onFocus={() => setDropDownOpen(true)} onBlur={() => setDropDownOpen(false)}
        className={`absolute right-0 -top-24 z-40 w-50 space-y-1 rounded-sm border border-stroke bg-white p-1.5 shadow-default dark:border-strokedark dark:bg-boxdark
      ${dropDownOpen === true ? 'block' : 'hidden'}`}>
        <button onClick={(e) => { e.preventDefault(), dispatch(ToogleMediaModal(true)) }} className='flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4'>
          <Image size={24} />
          Images & Videos
        </button>
        <button onClick={(e) => { e.preventDefault(), dispatch(ToogleDocumentModal(true)) }} className='flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4'>
          <File size={24} />
          Files & Documents
        </button>
      </div>
    </div>
  )
}

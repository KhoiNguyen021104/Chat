import React from 'react'
import { ChatList, Inbox } from '../section/Chat'
import GifModal from '../components/GifModal'
import MediaPicker from '../components/MediaPicker'
import DocumentPicker from '../components/DocumentPicker'
export default function Messages() {
  return (
    <>
      <div className='flex w-full '>
        <ChatList />
        <Inbox />
      </div>
      {/* <VoiceRecorder /> */}
      <GifModal />
      <MediaPicker />
      <DocumentPicker />
    </>
  )
}

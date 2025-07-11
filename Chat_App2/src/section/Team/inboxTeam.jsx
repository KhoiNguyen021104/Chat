import React, { useState } from 'react'
import {  Gif, PaperPlaneTilt, Phone, VideoCamera } from '@phosphor-icons/react';
import User01 from "../../assets/images/user/user-01.png";
import Dropdown from '../../components/Dropdown';
import EmojiPicker from '../../components/EmojiPicker';
// import UserInfo from './UserInfo';
import Giphy from '../../components/Giphy';
import Attachment from '../../components/Attachment';
import MsgSeparator from '../../components/MsgSeparator';
import TypingIndicator from '../../components/TypingIndicator';
import { DocumentMessage, MediaMessage, TextMessage } from '../../components/Messages';
import VideoCall from '../../components/VideoCall';
import AudioCall from '../../components/AudioCall';


export default function InboxTeam() {
const [userInfoOpen, setUserInfoOpen] = useState(false)
const [videoCall, setVideoCall] = useState(false)
const [audioCall, setAudioCall] = useState(false)
const [gifOpen, setGiphyOpen] = useState(false)

const handleToggleGiphy = (e) => {
e.preventDefault()
setGiphyOpen(!gifOpen)
}

const handleToggleVideoCall = () => {
setVideoCall(!videoCall)
}

const handleToggleAudioCall = (e) => {
e.preventDefault()
setAudioCall(!audioCall)
}

const handleToggleUserInfo = () => {
setUserInfoOpen(!userInfoOpen)
}
return (
<>
    <div className={`flex h-full flex-col bg-[#1f1f1f] rounded-3xl ml-3  ${userInfoOpen ? 'xl:w-1/2' : ' xl:w-3/4'}`}>
    {/*Chat header */}
    <div className='sticky flex items-center flex-row justify-between bg-black/20  opacity-90 shadow-2xl  px-5 py-3'>
        <div className='flex items-center'>
        <div className='mr-4.5 h-11.5 w-full max-w-11.5 rounded-full relative cursor-pointer'>
            <img src={User01} alt='avatar' className='h-full object-cover object-center' />
            <span className='absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2  bg-success'></span>
        </div>
        <div>
            <h5 className='font-medium text-white  '>
            Henry Dholi
            </h5>
            <p className='text-sm'>online</p>
        </div>
        </div>

        <div className='flex flex-row  items-center space-x-5'>
        <button onClick={handleToggleVideoCall}>
            <VideoCamera size={25} className='text-[#a10eeb]' />
        </button>
        <button onClick={handleToggleAudioCall}>
            <Phone size={25} className='text-[#a10eeb]' />
        </button>
        {/* <button onClick={handleToggleUserInfo} >
        <Dropdown size ={30} className='text-[#a10eeb]'  />
        </button> */}
        </div>
    </div>

    {/*Chat body */}
    <div className='max-h-full space-y-3.5 flex flex-col gap-2 overflow-auto no-scrollbar px-5 py-7 grow'>
        <TextMessage author={'Hoang Van Vu'} timestamp={'9:01AM'} content={'Thông minh vô cùng tận'} incoming={true} read_receipt={'sent'} />
        <TextMessage timestamp={'9:13AM'} content={'https://www.youtube.com/watch?v=mC8MKvdy9yE'} incoming={false} read_receipt={'delivered'} />
        <MsgSeparator />
        <DocumentMessage timestamp={'11:01 am'} incoming={true} read_receipt={'read'} author={'Hoang Van Vu'} />
        <DocumentMessage timestamp={'11:01 am'} incoming={false} read_receipt={'read'} />
        <MsgSeparator />
        <MediaMessage assets={[]} timestamp={'11:49 am'} incoming={true} read_receipt={'read'} author={'Hoang Van Vu'} caption={'Đây là ảnh'} />
        <MediaMessage assets={[]} timestamp={'11:49 am'} incoming={false} read_receipt={'read'} caption={'Đây là ảnh'} />
        <TypingIndicator />
    </div>


    {/*Chat footer */}
    <div className='sticky bottom-0   px-6 py-5  bg-[#1f1f1f]'>
        <form className='flex items-center justify-between space-x-4.5'>
        <div className='relative w-full'>
            <input type='text' placeholder='Type something here' className='h-12 w-full rounded-2xl border  pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary bg-[#2e2e2e]' />

            {/* icon link */}
            <div className='absolute flex right-5 top-1/2 -translate-y-1/2 items-center text-2xl justify-end space-x-4'>
            <div className=''>
                <Attachment size={20} />
            </div>
            <button className='hover:text-primary' onClick={handleToggleGiphy}>
                <Gif size={20} />
            </button>
            <div className='hover:text-primary' >
                <EmojiPicker size={20} />
            </div>
            </div>
        </div>

        <button className='flex items-center justify-center h-12 max-w-12 w-full rounded-md bg-primary text-white hover:bg-opacity-90 '>
            <PaperPlaneTilt size={24} weight='bold' />
        </button>
        </form>

        {gifOpen && <Giphy />}
    </div>
    </div>
    {videoCall && <VideoCall open={videoCall} handleClose={handleToggleVideoCall} />}
    {audioCall && <AudioCall open={audioCall} handleClose={handleToggleAudioCall} />}

    {userInfoOpen && (
    <div className='w-1/4'>
        <UserInfo handleToggleUserInfo={handleToggleUserInfo} />
    </div>
    )
    }
</>
)
}

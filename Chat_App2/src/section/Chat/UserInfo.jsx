import { X, Bell, MagnifyingGlass, UserCircle } from "@phosphor-icons/react";
import {
  FaPaintBrush,
  FaRegSmile,
  FaPencilAlt,
  FaLock,
  FaFacebook,
} from "react-icons/fa";
import React from "react";
import { MdOutlinePermMedia } from "react-icons/md";
import CatProfile from "../../assets/images/user/cat.jpg";
import { FaFileAlt } from "react-icons/fa";
import { PiLinkSimpleBold } from "react-icons/pi";
import { MdAppBlocking } from "react-icons/md";
import { MdOutlineReport } from "react-icons/md";
import { timeAgo } from "../../utils/formater";
import { getFriendShipBetweenTwoUsers, updateFriend } from "../../apis/apis";
import { useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import { socket } from "../../socket/socket";
import { activeConversationSelector } from "../../redux/slices/activeConversationSlice";
export default function UserInfo({ friendInfo, friendship, signalOnline }) {
  const user = useSelector(userSelector);
  const { activeConversation } = useSelector(activeConversationSelector);
  // Block
  const handleBlock = async () => {
    if (friendship?.id && user?.id) {
      const res = await updateFriend(friendship?.id, {
        is_blocked: !friendship.is_blocked,
        user_id: user?.id,
      });
      if (res) {
        console.log("🚀 ~ handleBlock ~ res:", res);
        socket.emit("blockUser", {
          friendship: res,
          conversationId: activeConversation?.id,
        });
      }
    }
  };

  return (
    <div className='flex h-full flex-col bg-[#1f1f1f] rounded-3xl ml-3 text-white'>
      <div className=' overflow-y-auto px-4   scrollbar-track-gray-900'>
        <div className='flex flex-col items-center py-6'>
          {/* <img
            src={friendInfo?.avatar || CatProfile}
            className='w-28 h-28 rounded-full object-cover border-2 border-gray-500'
          /> */}
          <div className='rounded-full relative cursor-pointer'>
            <img
              src={friendInfo?.avatar || CatProfile}
              className='w-28 h-28 rounded-full object-cover border-2 border-gray-500'
            />
            <span
              className={`absolute bottom-1 right-2 block h-5 w-5 rounded-full 
                              ${signalOnline ? "bg-success" : "bg-red"}`}
            ></span>
          </div>
          <h2 className='mt-4 text-2xl font-semibold'>
            {friendInfo?.display_name}
          </h2>
          {!signalOnline && (
            <span className='text-sm mt-2 text-gray-500'>
              Active {timeAgo(friendInfo?.last_online_at)} ago
            </span>
          )}
          {/* <div className='p-4 mt-3 justify-center w-1/2 flex items-center gap-2 mb-2.5 rounded-2xl px-5 py-3 bg-[#474747]'>
            <FaLock size={12} />
            <span>End-to-end encrypted</span>
          </div> */}
        </div>

        <div className='flex justify-around px-5 py-2'>
          <button className='flex flex-col items-center mb-2.5 rounded-2xl'>
            <FaFacebook size={30} />
            <span className='text-xl mt-3'>Profile</span>
          </button>
          <button className='flex flex-col items-center'>
            <Bell size={30} />
            <span className='text-xl mt-3'>Mute</span>
          </button>
          {/* <button className='flex flex-col items-center'>
            <MagnifyingGlass size={30} />
            <span className='text-xl mt-3'>Search</span>
          </button> */}
        </div>

        <div className='px-6 py-4 '>
          <h3 className='text-sm text-gray-400 mb-2'>Chat info</h3>
          <button className='w-full text-left  py-2 flex items-center gap-3 hover:bg-gray-700 px-3 rounded-md'>
            <FaRegSmile
              size={40}
              className='rounded-full border border-[#2e2e2e] bg-[#2e2e2e] text-2xl p-2'
            />
            <span>View pinned messages</span>
          </button>
        </div>

        {/* Customize Chat */}
        <div className='px-6 py-4'>
          <h3 className='text-sm text-gray-400 mb-2'>Customize chat</h3>
          <button className='w-full text-left py-2 flex items-center gap-3 hover:bg-gray-700 px-3 rounded-md'>
            <FaPaintBrush
              size={40}
              className='rounded-full border border-[#2e2e2e] bg-[#2e2e2e] text-2xl p-2'
            />
            <span>Change theme</span>
          </button>
          <button className='w-full text-left py-2 flex items-center gap-3 hover:bg-gray-700 px-3 rounded-md'>
            <FaRegSmile
              size={40}
              className='rounded-full border border-[#2e2e2e] bg-[#2e2e2e] text-2xl p-2'
            />
            <span>Change emoji</span>
          </button>
          <button className='w-full text-left py-2 flex items-center gap-3 hover:bg-gray-700 px-3 rounded-md'>
            <FaPencilAlt
              size={40}
              className='rounded-full border border-[#2e2e2e] bg-[#2e2e2e] text-2xl p-2'
            />
            <span>Edit nicknames</span>
          </button>
        </div>

        {/* Media file link */}
        <div className='px-6 py-4'>
          <h3 className='text-sm text-gray-400 mb-2'>
            Media , files and links{" "}
          </h3>
          <button className='w-full text-left py-2 flex items-center gap-3 hover:bg-gray-700 px-3 rounded-md'>
            <MdOutlinePermMedia
              size={40}
              className='rounded-full border border-[#2e2e2e] bg-[#2e2e2e] text-2xl p-2'
            />
            <span>Media</span>
          </button>
          <button className='w-full text-left py-2 flex items-center gap-3 hover:bg-gray-700 px-3 rounded-md'>
            <FaFileAlt
              size={40}
              className='rounded-full border border-[#2e2e2e] bg-[#2e2e2e] text-2xl p-2'
            />
            <span>Files</span>
          </button>
          <button className='w-full text-left py-2 flex items-center gap-3 hover:bg-gray-700 px-3 rounded-md'>
            <PiLinkSimpleBold
              size={40}
              className='rounded-full border border-[#2e2e2e] bg-[#2e2e2e] text-2xl p-2'
            />
            <span>Links</span>
          </button>
        </div>

        <div className='px-6 py-4'>
          <h3 className='text-sm text-gray-400 mb-2'>Privacy & support</h3>
          {friendship?.is_blocked ? (
            friendship?.action_by_user_id === user?.id && (
              <button
                className='w-full text-left py-2 flex items-center gap-3 hover:bg-gray-700 px-3 rounded-md'
                onClick={handleBlock}
              >
                <MdAppBlocking
                  size={40}
                  className='rounded-full border border-[#2e2e2e] bg-[#2e2e2e] text-2xl p-2'
                />
                <span>Unblock</span>
              </button>
            )
          ) : (
            <button
              className='w-full text-left py-2 flex items-center gap-3 hover:bg-gray-700 px-3 rounded-md'
              onClick={handleBlock}
            >
              <MdAppBlocking
                size={40}
                className='rounded-full border border-[#2e2e2e] bg-[#2e2e2e] text-2xl p-2'
              />
              <span>Block</span>
            </button>
          )}

          <button className='w-full text-left py-2 flex items-center gap-3 hover:bg-gray-700 px-3 rounded-md'>
            <MdOutlineReport
              size={40}
              className='rounded-full border border-[#2e2e2e] bg-[#2e2e2e] text-2xl p-2'
            />
            <span>Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

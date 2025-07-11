import { MagnifyingGlass, UserPlus } from "@phosphor-icons/react";
import React, { useState } from "react";
import User01 from "../../assets/images/user/user-01.png";
import User02 from "../../assets/images/user/user-02.png";
import User03 from "../../assets/images/user/user-03.png";
import User04 from "../../assets/images/user/user-04.png";
import User05 from "../../assets/images/user/user-05.png";
import User06 from "../../assets/images/user/user-06.png";
import User07 from "../../assets/images/user/user-07.png";
import User08 from "../../assets/images/user/user-08.png";

const List = [
  {
    imgSrc: User01,
    name: "Henry Dholi",
    message: "I cam across your profile and...",
  },
  {
    imgSrc: User02,
    name: "Mariya Desoja",
    message: "I like your confidence 💪",
  },
  {
    imgSrc: User03,
    name: "Robert Jhon",
    message: "Can you share your offer?",
  },
  {
    imgSrc: User04,
    name: "Cody Fisher",
    message: `I'm waiting for you response!`,
  },
  {
    imgSrc: User05,
    name: "Jenny Wilson",
    message: "I cam across your profile and...",
  },
  {
    imgSrc: User06,
    name: "Robert Jhon",
    message: "Can you share your offer?",
  },
  {
    imgSrc: User07,
    name: "Cody Fisher",
    message: `I'm waiting for you response!`,
  },
  {
    imgSrc: User08,
    name: "Jenny Wilson",
    message: "I cam across your profile and...",
  },
];

const SpamList = [
  {
    imgSrc: User01,
    name: "Spam User 1",
    message: "This is a spam message!",
  },
  {
    imgSrc: User02,
    name: "Spam User 2",
    message: "Another spam message here!",
  },
];

export default function RequestMess() {
  const [selected, setSelected] = useState(0);
  const [activeTab, setActiveTab] = useState("youMayKnow");
  return (
    <div className='hidden h-full flex-col xl:flex xl:w-1/4 rounded-3xl bg-[#1f1f1f]'>
      <div className='flex flex-row place-content-between items-center sticky px-5 py-4.5'>
        <h3 className='text-2xl font-medium text-white'>Requests</h3>
        <div className='rounded-full border-[5px] border-[#2e2e2e] bg-[#2e2e2e] px-1.5 py-1.5 hover:bg-opacity-90 hover:cursor-pointer'>
          <UserPlus size={21} />
        </div>
      </div>

      <div className='flex max-h-full flex-col overflow-auto p-5 no-scrollbar'>
        <div className='flex border-2 rounded-3xl   border-gray-600 mb-4'>
          <button
            className={`flex-1 py-2 text-center text-xl font-semibold ${
              activeTab === "youMayKnow"
                ? "w-full rounded-3xl  bg-[#2e2e2e] py-2 pl-5 pr-10 text-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("youMayKnow")}
          >
            You may know
          </button>
          <button
            className={`flex-1 py-2 text-center text-xl font-semibold ${
              activeTab === "spam"
                ? "w-full rounded-3xl  bg-[#2e2e2e] py-2 pl-5 pr-10 text-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("spam")}
          >
            Spam
          </button>
        </div>
        <div className='text-gray-400 text-sm space-y-4'>
          {activeTab === "youMayKnow" && (
            <>
              <p>
                You can open a message request for more info on who sent it.
                They won't be notified you opened it.
              </p>
              {List.map((object, item) => (
                <div
                  className={`flex items-center px-4 py-2 ${
                    selected === item
                      ? "bg-[#3a3a3a] cursor-default"
                      : "cursor-pointer hover:bg-[#3a3a3a]"
                  }`}
                  key={item}
                  onClick={() => setSelected(item)}
                >
                  <div className='relative mr-3.5 h-11 w-full max-w-11 rounded-full'>
                    <img
                      src={object.imgSrc}
                      alt='profile'
                      className='h-full w-full object-cover'
                    />
                    <span className='absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-success'></span>
                  </div>
                  <div className='w-full'>
                    <h5 className='text-sm font-medium text-white dark:text-white'>
                      {object.name}
                    </h5>
                    <p className='text-sm'>{object.message}</p>
                  </div>
                </div>
              ))}
            </>
          )}
          {activeTab === "spam" && (
            <>
              <p>
                This is the Spam tab. Messages marked as spam will appear here.
              </p>
              {SpamList.map((object, item) => (
                <div
                  className={`flex items-center px-4 py-2 ${
                    selected === item
                      ? "bg-[#3a3a3a] cursor-default"
                      : "cursor-pointer hover:bg-[#3a3a3a]"
                  }`}
                  key={item}
                  onClick={() => setSelected(item)}
                >
                  <div className='relative mr-3.5 h-11 w-full max-w-11  rounded-full'>
                    <img
                      src={object.imgSrc}
                      alt='profile'
                      className='h-full w-full object-cover'
                    />
                    <span className='absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-red-500'></span>
                  </div>
                  <div className='w-full'>
                    <h5 className='text-sm font-medium text-white dark:text-white'>
                      {object.name}
                    </h5>
                    <p className='text-sm'>{object.message}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { PaperPlaneTilt, X } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToogleGifModal } from "../redux/slices/app";
import { createMessageAPI } from "../apis/apis";
import { userSelector } from "../redux/slices/userSlice";
import { socket } from "../socket/socket";
import { activeConversationSelector } from "../redux/slices/activeConversationSlice";
import { receiverSelector } from "../redux/slices/receiverSlice";
import { pushMessage } from "../redux/slices/messagesSlice";

export default function GifModal() {
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const { gif } = useSelector((state) => state.app.modals);
  const { selectedGifUrl } = useSelector((state) => state.app);
  const { receiver } = useSelector(receiverSelector);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!gif || keyCode !== 27) return;

      dispatch(
        ToogleGifModal({
          value: false,
          url: "",
        })
      );
    };
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("keydown", keyHandler);
    };
  });

  const [inputValue, setInputValue] = useState("");
  const { activeConversation } = useSelector(activeConversationSelector);
  const currentUser = useSelector(userSelector);

  const handleSendMessageGif = async () => {
    const receiverIds = activeConversation?.participants
      ?.filter((p) => p.userId !== currentUser?._id)
      .map((u) => ({ receiverId: u.userId }));
    const message = {
      content: inputValue,
      type: "media",
      files: [
        {
          url: selectedGifUrl,
          type: "image/gif",
        },
      ],
      conversationId: activeConversation?._id,
      senderId: currentUser?._id,
      receiverIds,
    };
    const res = await createMessageAPI(message);
    if (res) {
      socket.emit("sendMessage", {
        message: res,
        receiverId: receiver?.id,
      });
      dispatch(pushMessage(res));
      dispatch(
        ToogleGifModal({
          value: false,
          url: "",
        })
      );
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
        gif ? "block" : "hidden"
      }`}
    >
      <div
        ref={modalRef}
        className='md:px-17.5 w-full max-w-142.5 rounded-lg bg-white dark:bg-boxdark md:py-8 px-8 py-12'
      >
        <div className='flex flex-row items-center justify-between mb-8 space-x-2'>
          <div className='text-md font-medium text-black dark:text-white'>
            Send Giphy
          </div>
          <button
            onClick={() => {
              dispatch(
                ToogleGifModal({
                  value: false,
                  url: "",
                })
              );
            }}
          >
            <X size={20} />
          </button>
        </div>

        <img
          src={selectedGifUrl}
          alt=''
          className='w-full mx-auto max-h-100 object-cover object-center rounded-lg'
        />

        <div className='flex flex-row items-center space-x-2 justify-between mt-4'>
          <input
            type='text'
            placeholder='Type your message...'
            className='border rounded-lg hover:border-primary outline-none w-full p-2 border-stroke dark:border-strokedark bg-transparent dark:bg-form-input'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <button
            onClick={handleSendMessageGif}
            className='p-2.5 border border-primary flex items-center justify-center rounded-lg bg-primary hover:bg-opacity-90 text-white'
          >
            <PaperPlaneTilt size={20} weight='bold' />
          </button>
        </div>
      </div>
    </div>
  );
}

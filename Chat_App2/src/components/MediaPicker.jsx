import { PaperPlaneTilt, X } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToogleMediaModal } from "../redux/slices/app";
import FileDropZone from "./FileDropZone";
import { userSelector } from "../redux/slices/userSlice";
import { createMessageAPI } from "../apis/apis";
import { activeConversationSelector } from "../redux/slices/activeConversationSlice";
import { toast } from "react-toastify";
import { TYPE_MESSAGE } from "../config/constants";

export default function MediaPicker() {
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { media } = useSelector((state) => state.app.modals);
  const dropZoneRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const { activeConversation } = useSelector(activeConversationSelector);
  const user = useSelector(userSelector);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!media || keyCode !== 27) return;

      dispatch(ToogleMediaModal(false));
    };
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("keydown", keyHandler);
    };
  }, [media, dispatch]);

  const handleSendMessage = async () => {
    if (activeConversation && user) {
      const message = {
        content: inputValue,
        conversation_id: activeConversation.id,
        sender_id: user.id,
        type: TYPE_MESSAGE.MEDIA,
      };
      const files = dropZoneRef.current?.getFiles();
      if (files.length === 0) {
        toast.error("Please select at least a file");
        return;
      }
      const res = await createMessageAPI(message);
      if (res) {
        setInputValue("");
        await dropZoneRef.current?.handleUpload(res);
      }
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
        media ? "block" : "hidden"
      }`}
    >
      <div
        ref={modalRef}
        className='md:px-17.5 w-full max-w-142.5 rounded-lg bg-white dark:bg-boxdark md:py-8 px-8 py-12'
      >
        <div className='flex flex-row items-center justify-between mb-8 space-x-2'>
          <div className='text-md font-medium text-black dark:text-white'>
            Choose Media files to send
          </div>

          <button
            onClick={() => {
              dispatch(ToogleMediaModal(false));
            }}
          >
            <X size={20} />
          </button>
        </div>
        <FileDropZone ref={dropZoneRef} />
        <div className='flex flex-row items-center space-x-2 justify-between mt-4'>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type='text'
            placeholder='Type your message...'
            className='border rounded-lg hover:border-primary outline-none w-full p-2 border-stroke dark:border-strokedark bg-transparent dark:bg-form-input'
          />

          <button
            onClick={handleSendMessage}
            className='p-2.5 border border-primary flex items-center justify-center rounded-lg bg-primary hover:bg-opacity-90 text-white'
          >
            <PaperPlaneTilt size={20} weight='bold' />
          </button>
        </div>
      </div>
    </div>
  );
}

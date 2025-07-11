import { Smiley } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function EmojiPicker({ setInputValue }) {
  const colorMode = JSON.parse(window.localStorage.getItem("color-theme"));

  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handletriggle = (e) => {
    e.preventDefault();
    setPickerOpen(!pickerOpen);
  };
  return (
    <div className='relative flex'>
      <button
        ref={buttonRef}
        className='text-[#98A6AD] hover:text-body'
        onClick={handletriggle}
      >
        <Smiley size={20} className='text-body' />
      </button>

      {pickerOpen && (
        <div ref={pickerRef} className='absolute z-40 -top-115 right-0'>
          <Picker
            theme={colorMode}
            data={data}
            onEmojiSelect={(value) =>
              setInputValue((prev) => prev + value.native)
            }
          />
        </div>
      )}
    </div>
  );
}

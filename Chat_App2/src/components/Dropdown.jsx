import { DotsThree, PencilSimple, Trash } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";

export default function Dropdown() {
  // const [dropDownState, setDropDownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;

      if (
        !dropdown ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      ) {
        return;
      }

      // setDropDownOpen(false);
    };

    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdown.current || keyCode !== 27) return;
      // setDropDownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("keydown", keyHandler);
    };
  });

  return (
    <div className='relative flex'>
      <button
        className='text-[#7f8a8f] hover:text-body'
        ref={trigger}
        // onClick={() => setDropDownOpen((prev) => !prev)}
      >
        <DotsThree weight='bold' size={24} />
      </button>
    </div>
  );
}

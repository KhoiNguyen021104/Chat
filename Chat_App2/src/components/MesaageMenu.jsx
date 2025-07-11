import { EllipsisVertical } from "lucide-react";
import ModalRevokeMessage from "./Modal/ModalRevokeMessage";

function MessageMenu({ message, role }) {
  return (
    <div className='relative group'>
      <div className='cursor-pointer'>
        <EllipsisVertical width={20} height={20} />
      </div>
      <ul
        className={`absolute flex flex-col 
bg-white cursor-pointer min-w-[200px] rounded-2xl shadow-lg 
group-hover:opacity-100 group-hover:visible transition-opacity duration-200 ease-in-out overflow-hidden
opacity-0 invisible
${
  role === "sender"
    ? "left-0 -translate-x-full -translate-y-full "
    : "right-0 translate-x-full -translate-y-full "
}
`}
      >
        <ModalRevokeMessage message={message} role={role} />
        {/* <li className='font-semibold p-6 px-10 text-nowrap hover:bg-gray-100'>
          Ghim
        </li>
        <li className='font-semibold p-6 px-10 text-nowrap hover:bg-gray-100'>
          Trả lời
        </li> */}
      </ul>
    </div>
  );
}

export default MessageMenu;

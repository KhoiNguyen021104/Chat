import { Modal } from "antd";
import { useEffect, useState } from "react";
import { createFriendAPI, getAllUsersAPI } from "../../apis/apis";
import { useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import { TYPE_CONVERSATION } from "../../config/constants";
import { Chat, Plus, UserPlus } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { socket } from "../../socket/socket";
const AddFriendModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otherUsers, setOtherUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const user = useSelector(userSelector);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearchUser = async (keyword) => {
    setKeyword(keyword);
  };

  useEffect(() => {
    if (keyword.trim() && user.id) {
      const fetchUsers = async () => {
        const query = `page=1&d=${keyword}&not_friend=true&user_id=${user?.id}`;
        const res = await getAllUsersAPI(query);
        if (res?.users?.length > 0) {
          console.log("🚀 ~ fetchUsers ~ res:", res);
          setOtherUsers(res.users.filter((u) => u.id !== user.id));
        }
      };
      fetchUsers();
    } else {
      setOtherUsers([]);
    }
  }, [user?.id, keyword]);

  useEffect(() => {
    // console.log("🚀 ~ AddFriendModal ~ otherUsers:", otherUsers);
  }, [otherUsers]);

  const handleSendFriendRequest = async (receiverId) => {
    if (user.id) {
      const request = {
        sender_id: user.id,
        receiver_id: receiverId,
      };
      const res = await createFriendAPI(request);
      if (res.id) {
        socket.emit("sendFriendRequest", res);
        toast.success("Send friend request successfully");
        setIsModalOpen(false);
      }
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setKeyword("");
      setOtherUsers([]);
    }
  }, [isModalOpen]);
  return (
    <>
      <div
        className='rounded-full border-[5px] border-[#2e2e2e] bg-[#2e2e2e] px-1.5 py-1.5 hover:bg-opacity-90 hover:cursor-pointer'
        onClick={showModal}
      >
        <UserPlus className='fill-white' size={21} />
      </div>
      <Modal
        title='Add friend'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <input
          type='text'
          placeholder='Enter friend name...'
          autoFocus={true}
          className='w-full p-2 border-2 border-gray outline-graydark'
          value={keyword}
          onChange={(e) => handleSearchUser(e.target.value)}
        />

        <div className='mt-6'>
          {otherUsers.length > 0
            ? otherUsers.map((u) => (
                <div
                  key={u.id}
                  className='flex items-center gap-2 p-2 cursor-pointer justify-between'
                >
                  <div className='flex items-center gap-2'>
                    <img
                      src={u.avatar}
                      alt={u.display_name}
                      className='w-10 h-10 rounded-full'
                    />
                    <span>{u.display_name}</span>
                  </div>
                  <div
                    className='w-[32px] h-[32px] rounded-full bg-gray flex items-center justify-center p-1 hover:bg-transparent'
                    onClick={() => handleSendFriendRequest(u.id)}
                  >
                    <Plus className='hover:fill-red' width={20} height={20} />
                  </div>
                </div>
              ))
            : keyword && <div className='text-center w-full'>Not found</div>}
        </div>
      </Modal>
    </>
  );
};
export default AddFriendModal;

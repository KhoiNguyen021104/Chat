import { Modal } from "antd";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createConversationAPI,
  getAllUsersAPI,
  searchUserAPI,
} from "../../apis/apis";
import { useDispatch, useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import { TYPE_CONVERSATION } from "../../config/constants";
import {
  fetchConversationRedux,
  setActiveConversation,
} from "../../redux/slices/activeConversationSlice";
import { Chat } from "@phosphor-icons/react";
const SearchUserModal = ({ setAllConversations, allConversations }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otherUsers, setOtherUsers] = useState([]);
  const user = useSelector(userSelector);
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();
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
        const query = `page=1&&d=${keyword}`;
        const res = await getAllUsersAPI(query);
        if (res.users.length > 0) {
          setOtherUsers(res.users.filter((u) => u.id !== user.id));
        }
      };
      fetchUsers();
    } else {
      setOtherUsers([]);
    }
  }, [user?.id, keyword]);

  const handleCreateConversation = async (userId) => {
    const conversation = {
      type: TYPE_CONVERSATION.PERSONAL,
      members: [user.id, userId],
    };
    let isExist = allConversations?.find((c) => {
      return (
        c.type === conversation.type &&
        c?.members?.some((cm) => cm?.user_id === userId)
      );
    });

    if (!isExist) {
      const res = await createConversationAPI(conversation);
      if (res) {
        setAllConversations((prev) => [res, ...prev]);
      }
    } else {
      dispatch(setActiveConversation(isExist));
    }
    setIsModalOpen(false);
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
        <Chat className='fill-white' size={21} />
      </div>
      <Modal
        title='Send to'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <input
          type='text'
          placeholder='Enter user name...'
          autoFocus={true}
          className='w-full p-2 border-2 border-gray outline-graydark'
          value={keyword}
          onChange={(e) => handleSearchUser(e.target.value)}
        />

        <div className='mt-6'>
          {otherUsers.length > 0 &&
            otherUsers.map((user) => (
              <div
                key={user.id}
                className='flex items-center gap-2 p-2 cursor-pointer hover:bg-gray'
                onClick={() => handleCreateConversation(user.id)}
              >
                <img
                  src={user.avatar}
                  alt={user.display_name}
                  className='w-10 h-10 rounded-full'
                />
                <span>{user.display_name}</span>
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
};
export default SearchUserModal;

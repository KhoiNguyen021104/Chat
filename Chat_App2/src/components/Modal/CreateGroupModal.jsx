import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  createConversationAPI,
  getAllFriendShipsByUserId,
} from "../../apis/apis";
import { useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import { TYPE_CONVERSATION } from "../../config/constants";
import { Camera, Chat, Plus, UserPlus } from "@phosphor-icons/react";
import { socket } from "../../socket/socket";
import User01 from "../../assets/images/user/user-01.png";
import LoadingOverlay from "../Loading/LoadingOverlay";
import { toast } from "react-toastify";

const CreateGroupModal = ({ setAllConversations }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friendships, setFriendships] = useState([]);
  const user = useSelector(userSelector);
  const [groupName, setGroupName] = useState("");
  const [groupAvatarRender, setGroupAvatarRender] = useState(User01);
  const [groupAvatarFile, setGroupAvatarFile] = useState();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const [keyword, setKeyword] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearchFriends = async (value) => {
    setKeyword(value);
    if (value.trim() && user?.id) {
      const query = `page=1&d=${value}`;
      const res = await getAllFriendShipsByUserId(user?.id, query);
      console.log("🚀 ~ fetchFriends ~ res:", res);
      if (res.friendships) {
        setFriendships(res.friendships);
      }
    } else {
      setFriendships([]);
    }
  };

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [friendships]); 

  const handleSelectFriend = async (value, userId) => {
    if (value) {
      setMembers((prev) => {
        const isExist = prev.some((m) => m === userId);
        if (!isExist) {
          return [...prev, userId];
        }
        return prev;
      });
    } else {
      setMembers((prev) => prev.filter((u) => u !== userId));
    }
  };

  const handleCreateGroup = async () => {
    const conversation = {
      members: [user.id, ...members],
      type: TYPE_CONVERSATION.GROUP,
      group_name: groupName,
      owner: user.id,
    };
    try {
      const formData = new FormData();
      formData.append("group_avatar", groupAvatarFile);
      formData.append("group_info", JSON.stringify(conversation));
      setIsLoading(true);
      const res = await createConversationAPI(formData);
      if (res) {
        console.log("🚀 ~ handleCreateGroup ~ res:", res);
        toast.success("Group created successfully");
        socket.emit("joinConversation", {
          userId: user.id,
          conversationId: res.id,
        });
        res.members.filter((m) => m.user_id !== user.id);
        socket.emit("sendNewConversation", res);
        setAllConversations((prev) => [res, ...prev]);
      }
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleChangeAvatar = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setGroupAvatarRender(imageUrl);
      setGroupAvatarFile(file);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setGroupName("");
      setFriendships([]);
      setMembers([]);
      setKeyword(""); // Reset keyword khi đóng modal
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
        title='Create group'
        open={isModalOpen}
        onOk={handleCreateGroup}
        onCancel={handleCancel}
        okText='Create'
      >
        <LoadingOverlay isLoading={isLoading} />
        <div className='flex flex-col gap-4 justify-center items-center'>
          {groupAvatarRender ? (
            <div className='relative drop-shadow-2 w-fit flex justify-center items-center'>
              <img
                src={groupAvatarRender}
                alt='Group avatar'
                className='rounded-full object-center object-cover w-[120px] h-[120px]'
              />
              <label
                htmlFor='profile'
                className='absolute cursor-pointer bottom-0 p-2 right-0 flex items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2'
              >
                <Camera size={20} />
                <input
                  type='file'
                  name='profile'
                  id='profile'
                  className='sr-only'
                  accept='image/*'
                  onChange={handleChangeAvatar}
                />
              </label>
            </div>
          ) : (
            <div className='relative drop-shadow-2 w-fit flex justify-center items-center'>
              <label
                htmlFor='profile'
                className='cursor-pointer p-2 flex items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 w-[80px] h-[80px]'
              >
                <Camera size={20} />
                <input
                  type='file'
                  name='profile'
                  id='profile'
                  className='sr-only'
                  accept='image/*'
                  onChange={handleChangeAvatar}
                />
              </label>
            </div>
          )}
          <input
            type='text'
            placeholder='Enter group name...'
            autoFocus={true}
            className='w-full p-2 border-2 border-gray outline-graydark'
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <input
            ref={searchInputRef}
            type='text'
            placeholder='Enter friend name...'
            className='w-full p-2 border-2 border-gray outline-graydark'
            value={keyword}
            onChange={(e) => handleSearchFriends(e.target.value)}
          />
        </div>
        <div className='mt-6'>
          {friendships.length > 0 &&
            friendships.map((friend) => (
              <div
                key={friend.id}
                className='flex items-center gap-2 p-2 cursor-pointer justify-between'
              >
                <div className='flex items-center gap-2'>
                  <img
                    src={friend.avatar}
                    alt={friend.display_name}
                    className='w-10 h-10 rounded-full'
                  />
                  <span>{friend.display_name}</span>
                </div>
                <div className='w-[32px] h-[32px] rounded-full bg-gray flex items-center justify-center p-1 hover:bg-transparent'>
                  <input
                    type='checkbox'
                    className='w-full h-full'
                    onChange={(e) =>
                      handleSelectFriend(e.target.checked, friend.user_id)
                    }
                  />
                </div>
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
};

export default CreateGroupModal;

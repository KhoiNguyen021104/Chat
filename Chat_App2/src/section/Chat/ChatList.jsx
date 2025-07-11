import { MagnifyingGlass } from "@phosphor-icons/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import {
  getAllConversationsByUserId,
  getAllUsersAPI,
  getUserByIdAPI,
} from "../../apis/apis";
import ChatItem from "./ChatItem";
import SearchUserModal from "../../components/Modal/SearchUserModal";
import AddFriendModal from "../../components/Modal/AddFriendModal";
import CreateGroupModal from "../../components/Modal/CreateGroupModal";
import { socket } from "../../socket/socket";
import {
  activeConversationSelector,
  setActiveConversation,
} from "../../redux/slices/activeConversationSlice";

export default function ChatList() {
  const user = useSelector(userSelector);
  const [allConversations, setAllConversations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { activeConversation } = useSelector(activeConversationSelector);
  const dispatch = useDispatch();
  const [inputSearch, setInputSearch] = useState("");

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    const res = await getAllConversationsByUserId(user.id);
    if (res?.conversations.length > 0) {
      const conversations = res.conversations.sort((a, b) => {
        if (b.last_message_id && a.last_message_id) {
          return b.last_message_id - a.last_message_id;
        }
        const updatedAtA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const updatedAtB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        if (updatedAtB !== updatedAtA) {
          return updatedAtB - updatedAtA;
        }
        const createdAtA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const createdAtB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return createdAtB - createdAtA;
      });
      if (conversations) {
        const newState = conversations?.map((c) => ({
          ...c,
          members: c?.members?.filter((cm) => cm.user_id !== user.id),
        }));
        setAllConversations(newState);
      }
    }
  });
  useEffect(() => {
    if (user.id) {
      fetchConversations();
    }
  }, [fetchConversations, user.id]);

  // Reset active conversation
  useEffect(() => {
    if (activeConversation) {
      const isExist = allConversations.some(
        (c) => c?.id === activeConversation?.id
      );
      if (!isExist || allConversations.length === 0) {
        dispatch(setActiveConversation(null));
      }
    } else {
      if (allConversations.length > 0) {
        dispatch(setActiveConversation(allConversations[0]));
      }
    }
  }, [allConversations, dispatch]);

  // Socket receive reply friend request
  // useEffect(() => {
  //   const handleReceiveReplyFriendRequest = async (replyData) => {
  //     const { friendship, conversation } = replyData;
  //     if (friendship && conversation?.members) {
  //       const members = await Promise.all(
  //         conversation?.members
  //           ?.filter((cm) => cm.user_id !== user.id)
  //           .map(async (cm) => {
  //             const userData = await getUserByIdAPI(cm.user_id);
  //             return userData;
  //           })
  //       );
  //       setAllConversations((prev) => [
  //         {
  //           ...conversation,
  //           members,
  //         },
  //         ...prev,
  //       ]);
  //       socket.emit("joinConversation", {
  //         userId: user.id,
  //         conversationId: conversation.id,
  //       });
  //     }
  //   };
  //   socket.on("replyFriendRequest", handleReceiveReplyFriendRequest);
  //   return () => {
  //     socket.off("replyFriendRequest", handleReceiveReplyFriendRequest);
  //   };
  // }, [user.id]);

  // Socket receive new conversation
  useEffect(() => {
    const handleReceiveNewConversation = async (conversation) => {
      if (conversation?.members && user?.id) {
        const members = await Promise.all(
          conversation?.members
            ?.filter((cm) => cm.user_id !== user.id)
            .map(async (cm) => {
              const userData = await getUserByIdAPI(cm.user_id);
              return userData;
            })
        );
        setAllConversations((prev) => [
          {
            ...conversation,
            members,
          },
          ...prev,
        ]);
        socket.emit("joinConversation", {
          userId: user.id,
          conversationId: conversation.id,
        });
      }
    };
    socket.on("receiveNewConversation", handleReceiveNewConversation);
    return () => {
      socket.off("receiveNewConversation", handleReceiveNewConversation);
    };
  }, [user.id]);

  useEffect(() => {
    const handleReceiveMessage = async (message) => {
      setAllConversations((prev) => {
        const updatedState = prev.map((c) => {
          if (c.id === message.conversation_id) {
            return {
              ...c,
              last_message_id: message.id,
              updated_at: message.created_at,
            };
          }
          return c;
        });

        if (updatedState) {
          const newState = updatedState.sort((a, b) => {
            if (b.last_message_id && a.last_message_id) {
              return b.last_message_id - a.last_message_id;
            }
            const updatedAtA = a.updated_at
              ? new Date(a.updated_at).getTime()
              : 0;
            const updatedAtB = b.updated_at
              ? new Date(b.updated_at).getTime()
              : 0;
            if (updatedAtB !== updatedAtA) {
              return updatedAtB - updatedAtA;
            }
            const createdAtA = a.created_at
              ? new Date(a.created_at).getTime()
              : 0;
            const createdAtB = b.created_at
              ? new Date(b.created_at).getTime()
              : 0;
            return createdAtB - createdAtA;
          });
          return newState;
        }
        return prev;
      });
    };

    socket.on("sortConversation", handleReceiveMessage);
    return () => {
      socket.off("sortConversation");
    };
  }, []);

  const onClickChatItem = (conversation) => {
    dispatch(setActiveConversation(conversation));
    // setSelected(conversation.id);
  };

  const handleSearchConversation = async (value) => {
    const query = `d=${value}`;
    // const users = await getAllUsersAPI(query);
  };

  return (
    <div className='hidden h-full flex-col xl:flex xl:w-1/4 rounded-3xl bg-[#1f1f1f]'>
      <div className='flex flex-row place-content-between items-center sticky px-5 py-4.5'>
        <h3 className='text-2xl font-medium text-white'>Chats</h3>
        <div className='flex flex-1 items-center w-full justify-end gap-2'>
          <AddFriendModal />
          <SearchUserModal
            setAllConversations={setAllConversations}
            allConversations={allConversations}
          />
          <CreateGroupModal setAllConversations={setAllConversations} />
        </div>
      </div>

      <div className='flex max-h-full flex-col overflow-auto p-5 no-scrollbar'>
        <form className='sticky'>
          <input
            placeholder='Search...'
            type='text'
            className='w-full rounded-3xl bg-[#2e2e2e] py-2 pl-5 pr-10 text-xl outline-none text-white'
            onChange={(e) => handleSearchConversation(e.target.value)}
          />
          <button className='absolute right-4 top-1/2 -translate-y-1/2'>
            <MagnifyingGlass size={20} />
          </button>
        </form>
      </div>

      <div className='overflow-auto max-h-full space-y-2.5'>
        {allConversations.length > 0 &&
          allConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onClickChatItem(conversation)}
              className='cursor-pointer'
            >
              <ChatItem
                selected={activeConversation?.id === conversation?.id}
                conversation={conversation}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

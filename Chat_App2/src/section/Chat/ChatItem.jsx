import { useEffect, useState } from "react";
import { getMessagesByIdAPI, updateConversationAPI } from "../../apis/apis";
import { userSelector } from "../../redux/slices/userSlice";
import { useDispatch, useSelector } from "../../redux/store";
import { socket } from "../../socket/socket";
import { TYPE_CONVERSATION, TYPE_MESSAGE } from "../../config/constants";
import {
  activeConversationSelector,
  setActiveConversation,
} from "../../redux/slices/activeConversationSlice";

function ChatItem({ selected = false, conversation }) {
  const user = useSelector(userSelector);
  const [lastMessage, setLastMessage] = useState(
    "You are now connected on Messenger."
  );
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [signalOnline, setSignalOnline] = useState(
    conversation?.type === TYPE_CONVERSATION.PERSONAL
      ? conversation.members[0].status === "online"
      : false
  );
  const [lastMessageSender, setLastMessageSender] = useState("You");
  const { activeConversation } = useSelector(activeConversationSelector);
  const dispatch = useDispatch();

  // const onClick = async () => {
  //   if (conversation) {
  //     const isActive = activeConversation?.id === conversation.id;
  //     if (!isActive) {
  //       dispatch(setActiveConversation(conversation));
  //     }
  //   }
  // };

  // Last message
  useEffect(() => {
    if (conversation.last_message_id) {
      const fetchLastMessage = async () => {
        const res = await getMessagesByIdAPI(conversation.last_message_id);
        if (res) {
          let sender = "You";
          if (res.sender_id !== user.id) {
            sender = conversation.members.find(
              (cm) => cm.user_id === res.sender_id
            ).display_name;
          }
          setLastMessageSender(sender);
          let isDeleted = false;
          if (res?.deleted_by_users?.length > 0) {
            isDeleted = res?.deleted_by_users?.some(
              (d) => d.user_id === user.id
            );
          }
          if (res?.is_revoked) {
            setLastMessage(sender + " revoked a message");
          } else if (isDeleted) {
            setLastMessage(sender + " remove a message");
          } else {
            if (res.type === TYPE_MESSAGE.TEXT) {
              setLastMessage(sender + ": " + res.content);
            } else if (res.type === TYPE_MESSAGE.MEDIA) {
              setLastMessage(sender + ": " + "Media");
            } else if (res.type === TYPE_MESSAGE.DOCUMENT) {
              setLastMessage(sender + ": " + "Document");
            }
          }
          setHasNewMessage(
            res?.readers?.length === 0 && res?.sender_id !== user?.id
          );
        }
      };
      fetchLastMessage();
    }
  }, [conversation.last_message_id, conversation.members, user.id]);

  // Socket check last message revoked/removed ?
  useEffect(() => {
    const handleReceiveRevokeMessage = (message) => {
      if (message?.id === conversation?.last_message_id && lastMessageSender) {
        setLastMessage(lastMessageSender + " revoked a message");
      }
    };
    socket.on("revokeMessage", handleReceiveRevokeMessage);
    return () => socket.off("revokeMessage", handleReceiveRevokeMessage);
  }, [conversation?.last_message_id, lastMessageSender]);

  useEffect(() => {
    const handleReceiveRemovedMessage = (message) => {
      if (
        message?.id === conversation?.last_message_id &&
        lastMessageSender &&
        message?.sender_id === user?.id
      ) {
        setLastMessage(lastMessageSender + " remove a message");
      }
    };
    socket.on("removeMessage", handleReceiveRemovedMessage);
    return () => socket.off("removeMessage", handleReceiveRemovedMessage);
  }, [conversation?.last_message_id, lastMessageSender, user?.id]);

  // Socket Receive message
  useEffect(() => {
    const handleReceiveLastMessage = async (message) => {
      if (conversation?.id === message.conversation_id && user?.id) {
        let sender = "You: ";
        if (message.sender_id !== user.id) {
          sender = conversation.members[0].display_name + ": ";
        }
        if (message.type === TYPE_MESSAGE.TEXT) {
          setLastMessage(sender + message.content);
        } else if (message.type === TYPE_MESSAGE.MEDIA) {
          setLastMessage(sender + "Media");
        } else if (message.type === TYPE_MESSAGE.DOCUMENT) {
          setLastMessage(sender + "Document");
        }
        setHasNewMessage(true);
        await updateConversationAPI(message.conversation_id, {
          last_message_id: message.id,
        });
      }
    };

    socket.on("receiveLastMessage", handleReceiveLastMessage);
    return () => {
      socket.off("receiveLastMessage");
    };
  }, [conversation?.id, conversation?.members, user.id]);

  // Socket receive signal online
  useEffect(() => {
    if (conversation?.type === TYPE_CONVERSATION.PERSONAL) {
      const handleReceiveSignalOnline = async (friendId) => {
        if (
          friendId === conversation?.members?.[0].user_id &&
          friendId !== user?.id
        ) {
          setSignalOnline(true);
          if (activeConversation?.members) {
            const isExist = activeConversation?.members?.some(
              (m) => m?.user_id === friendId
            );
            if (isExist) {
              dispatch(
                setActiveConversation({
                  ...activeConversation,
                  members: activeConversation?.members?.map((m) => ({
                    ...m,
                    status: "online",
                  })),
                })
              );
            }
          }
        }
      };
      socket.on("receiveSignalOnline", handleReceiveSignalOnline);
      return () => {
        socket.off("receiveSignalOnline", handleReceiveSignalOnline);
      };
    }
  }, [conversation?.members, conversation?.type, dispatch, user?.id]);

  // Socket receive signal offline
  useEffect(() => {
    if (conversation?.type === TYPE_CONVERSATION.PERSONAL) {
      const handleReceiveSignalOffline = async (friendId) => {
        if (
          friendId === conversation?.members?.[0].user_id &&
          friendId !== user?.id
        ) {
          setSignalOnline(false);
          if (activeConversation?.members) {
            const isExist = activeConversation?.members?.some(
              (m) => m?.user_id === friendId
            );
            if (isExist) {
              dispatch(
                setActiveConversation({
                  ...activeConversation,
                  members: activeConversation?.members?.map((m) => ({
                    ...m,
                    status: "offline",
                  })),
                })
              );
            }
          }
        }
      };
      socket.on("receiveSignalOffline", handleReceiveSignalOffline);
      return () => {
        socket.off("receiveSignalOffline", handleReceiveSignalOffline);
      };
    }
  }, [conversation?.members, conversation?.type, dispatch, user?.id]);

  return (
    conversation &&
    (conversation.type === TYPE_CONVERSATION.PERSONAL
      ? conversation.members[0] && (
          <div
            className={`flex  items-center  px-4 py-2 ${
              selected
                ? "bg-[#3a3a3a]  cursor-default"
                : "cursor-pointer hover:bg-[#3a3a3a]"
            }`}
            // onClick={onClick}
          >
            <div className='relative mr-3.5 h-11 w-full max-w-11 rounded-full'>
              <img
                src={conversation.members[0].avatar}
                alt='profile'
                className='h-full w-full object-cover-center rounded-full'
              />

              <span
                className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full 
                  ${signalOnline ? "bg-success" : "bg-red"}
                `}
              ></span>
            </div>

            <div className='w-full overflow-hidden'>
              <h5 className='text-sm font-medium text-white dark:text-white'>
                {conversation.members[0].display_name}
              </h5>
              <p
                // ${
                //   hasNewMessage &&
                //   activeConversation?.id !== conversation?.id &&
                //   lastMessage?.sender_id !== user?.id &&
                //   "text-white font-semibold"
                // }
                className={`text-sm w-full truncate text-ellipsis whitespace-nowrap
                  `}
              >
                {lastMessage}
              </p>
            </div>
          </div>
        )
      : conversation.type === TYPE_CONVERSATION.GROUP && (
          <div
            className={`flex  items-center  px-4 py-2 ${
              selected
                ? "bg-[#3a3a3a]  cursor-default"
                : "cursor-pointer hover:bg-[#3a3a3a]"
            }`}
            // onClick={onClick}
          >
            <div className='relative mr-3.5 h-11 w-full max-w-11 rounded-full'>
              <img
                src={conversation?.group_avatar}
                alt='profile'
                className='h-full w-full object-cover-center rounded-full'
              />
            </div>
            <div className='w-full'>
              <h5 className='text-sm font-medium text-white dark:text-white'>
                {conversation.group_name}
              </h5>
              <p
                className={`text-sm ${
                  lastMessage?.seenBy?.length === 0 && "text-white font-medium"
                }'`}
              >
                {lastMessage}
              </p>
            </div>
          </div>
        ))
  );
}

export default ChatItem;

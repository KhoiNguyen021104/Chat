import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  Gif,
  PaperPlaneTilt,
  Phone,
  ThumbsUp,
  VideoCamera,
} from "@phosphor-icons/react";
import Dropdown from "../../components/Dropdown";
import EmojiPicker from "../../components/EmojiPicker";
import UserInfo from "./UserInfo";
import Giphy from "../../components/Giphy";
import Attachment from "../../components/Attachment";
import MsgSeparator from "../../components/MsgSeparator";
import TypingIndicator from "../../components/TypingIndicator";
import { useDispatch, useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import { activeConversationSelector } from "../../redux/slices/activeConversationSlice";
import {
  DocumentMessage,
  EmojiMessage,
  MediaMessage,
  TextMessage,
} from "../../components/Messages";
import VideoCall from "../../components/VideoCall";
import AudioCall from "../../components/AudioCall";
import {
  createMessageAPI,
  createMessageReaderAPI,
  getAllMessagesByConversationIdAPI,
  getFriendShipBetweenTwoUsers,
  getUserByIdAPI,
} from "../../apis/apis";
import { TYPE_CONVERSATION, TYPE_MESSAGE } from "../../config/constants";
import { socket } from "../../socket/socket";
import { getDateParts, isSameDay, timeAgo } from "../../utils/formater";
import {
  fetchMessagesOfActiveConversationRedux,
  pushMessage,
  readMessage,
  appendMessage,
  replaceMessage,
  messagesSelector,
} from "../../redux/slices/messagesSlice";
import {
  fetchReceiverRedux,
  receiverSelector,
} from "../../redux/slices/receiverSlice";

export default function Inboxs() {
  // Cách 1: Bắn messgae vào room (conversation_id) => dùng local state
  // Cách 2: Bắn messgae vào socketId (receiver_id) => dùng Redux
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [videoCall, setVideoCall] = useState(false);
  const [audioCall, setAudioCall] = useState(false);
  const [gifOpen, setGiphyOpen] = useState(false);
  // const [receiver, setReceiver] = useState();
  const { receiver } = useSelector(receiverSelector);
  const [messagesLocal, setMessagesLocal] = useState([]);
  const { messages } = useSelector(messagesSelector);
  const [messageInput, setMessageInput] = useState("");
  const [signalOnline, setSignalOnline] = useState();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [usersCache, setUsersCache] = useState({});
  const messagesRef = useRef(null);
  const user = useSelector(userSelector);
  const { activeConversation } = useSelector(activeConversationSelector);
  const [friendship, setFriendship] = useState();
  const hasReadMessages = useRef(new Set());
  const dispatch = useDispatch();

  useEffect(() => {
    setMessagesLocal(messages?.messages || []);
    setHasMore(messages?.has_next_page || false);
  }, [messages]);

  //
  const handleToggleGiphy = (e) => {
    e.preventDefault();
    setGiphyOpen(!gifOpen);
  };
  const handleToggleVideoCall = () => {
    setVideoCall(!videoCall);
  };
  const handleToggleAudioCall = (e) => {
    e.preventDefault();
    setAudioCall(!audioCall);
  };
  const handleToggleUserInfo = () => {
    setUserInfoOpen(!userInfoOpen);
  };
  useEffect(() => {
    setUserInfoOpen(false);
  }, [activeConversation?.id]);

  // Get Friendship
  useEffect(() => {
    if (receiver?.user_id && user?.id) {
      const fetchFriendship = async () => {
        const friendship = await getFriendShipBetweenTwoUsers([
          receiver?.user_id,
          user?.id,
        ]);
        if (friendship) {
          setFriendship(friendship);
        }
      };
      fetchFriendship();
    }
  }, [receiver?.user_id, user?.id]);

  // Get receiver info in personal conversation
  useEffect(() => {
    if (activeConversation?.members && activeConversation?.type) {
      if (
        activeConversation.members &&
        activeConversation.type === TYPE_CONVERSATION.PERSONAL
      ) {
        // setReceiver(activeConversation.members[0]);
        dispatch(fetchReceiverRedux(activeConversation?.members[0]?.user_id));
        setSignalOnline(activeConversation.members[0].status === "online");
      }
    }
  }, [activeConversation?.members, activeConversation?.type, dispatch]);

  // Get sender info for all messagesLocal
  useEffect(() => {
    if (messagesLocal.length > 0) {
      const uniqueSenderIds = [
        ...new Set(messagesLocal.map((msg) => msg.sender_id)),
      ].filter((id) => id !== user?.id && !usersCache[id]);
      if (uniqueSenderIds.length > 0) {
        Promise.all(
          uniqueSenderIds.map((senderId) =>
            getUserByIdAPI(senderId).then((res) => ({ [senderId]: res }))
          )
        ).then((results) => {
          const newCache = Object.assign({}, ...results);
          setUsersCache((prev) => ({ ...prev, ...newCache }));
        });
      }
    }
  }, [messagesLocal, user?.id, usersCache]);

  // Get message
  useEffect(() => {
    if (activeConversation?.id) {
      setPage(1);
      dispatch(
        fetchMessagesOfActiveConversationRedux({
          conversationId: activeConversation?.id,
          page: 1,
        })
      );
    }
  }, [activeConversation?.id, dispatch]);

  // C1
  // useEffect(() => {
  //   if (activeConversation?.id) {
  //     if (page === 1) {
  //       const fetchMessages = async () => {
  //         const res = await getAllMessagesByConversationIdAPI(
  //           activeConversation.id
  //         );
  //         if (res.messagesLocal) {
  //           setMessagesLocal([...res.messagesLocal].reverse());
  //           setHasMore(res.has_next_page);
  //         }
  //       };
  //       fetchMessages();
  //     }
  //   }
  // }, [activeConversation?.id, page]);

  // Send message
  const handleSendMessage = async (emoji = null) => {
    if (activeConversation && user && receiver?.id) {
      const message = {
        content: emoji || messageInput.trim(),
        type: emoji ? TYPE_MESSAGE.EMOJI : TYPE_MESSAGE.TEXT,
        conversation_id: activeConversation.id,
        sender_id: user.id,
      };
      const res = await createMessageAPI(message);
      if (res) {
        console.log("🚀 ~ handleSendMessage ~ res:", res);
        socket.emit("sendMessage", {
          message: res,
          receiverId: receiver?.id,
        });
        // C2
        dispatch(pushMessage(res));
        setMessageInput("");
      }
    }
  };

  // Socket receive message (role: Receiver)
  useEffect(() => {
    const handleReceiveMessage = async (message) => {
      if (activeConversation?.id === message.conversation_id && user?.id) {
        // if (
        //   message?.type === TYPE_MESSAGE.MEDIA ||
        //   message.type === TYPE_MESSAGE.DOCUMENT
        // ) {
        //   if (message.sender_id === user.id) {
        //     if (message.blobUrls) {
        //       message.files = [...message.blobUrls];
        //     }
        //   } else {
        //     if (message?.bufferFiles && message?.bufferFiles.length > 0) {
        //       const processedFiles = message?.bufferFiles.map((file) => {
        //         const blob = new Blob([file.buffer], {
        //           file_type: file.file_type,
        //         });
        //         const file_url = URL.createObjectURL(blob);
        //         return {
        //           file_type: file.file_type,
        //           file_url,
        //           file_name: file.file_name,
        //           file_size: file.file_size,
        //         };
        //       });
        //       message.files = [...processedFiles];
        //     }
        //   }

        // }
        if (message?.bufferFiles && message?.bufferFiles.length > 0) {
          const processedFiles = message?.bufferFiles.map((file) => {
            const blob = new Blob([file.buffer], {
              file_type: file.file_type,
            });
            const file_url = URL.createObjectURL(blob);
            return {
              file_type: file.file_type,
              file_url,
              file_name: file.file_name,
              file_size: file.file_size,
            };
          });
          message.files = [...processedFiles];
        }
        dispatch(pushMessage(message));
        // setMessagesLocal((prev) => [...prev, message]);
      }
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage");
  }, [activeConversation?.id, dispatch, user.id]);

  // Handle scroll event => get more messagesLocal
  const fetchMessagesScroll = async (pageNumber) => {
    if (!hasMore) return;
    const res = await getAllMessagesByConversationIdAPI(
      activeConversation?.id,
      pageNumber
    );
    if (res?.messages?.length > 0) {
      setHasMore(res.has_next_page);
      const messagesNextPage = res.messages.reverse();
      // C1
      // setMessagesLocal((prev) => [...messagesNextPage, ...prev]);
      // C2
      dispatch(appendMessage(messagesNextPage));
    }
  };

  const handleScroll = () => {
    if (!messagesRef.current) return;
    const { scrollTop } = messagesRef.current;
    if (scrollTop === 0 && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1) {
      fetchMessagesScroll(page);
    }
  }, [page]);

  // Intersection Observer for visible messagesLocal
  useLayoutEffect(() => {
    if (!messagesRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.dataset.messageId);
        setVisibleMessages(visible);
      },
      {
        root: messagesRef.current,
        threshold: 0.8,
        rootMargin: "0px",
      }
    );

    const observeMessages = () => {
      const messageElements =
        messagesRef.current?.querySelectorAll(".message-item");
      if (messageElements?.length > 0) {
        messageElements.forEach((el) => observer.observe(el));
      }
    };

    observeMessages();
    return () => observer.disconnect();
  }, [messagesLocal]);

  useEffect(() => {
    const updateVisibleMessagesManual = () => {
      if (!messagesRef.current) return;

      const container = messagesRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.offsetHeight;
      const messageElements = container.querySelectorAll(".message-item");

      const visible = [];
      messageElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const elTop = rect.top - containerRect.top + scrollTop;
        const elBottom = elTop + el.offsetHeight;

        if (elTop < scrollTop + containerHeight && elBottom > scrollTop) {
          visible.push(el.dataset.messageId);
        }
      });
      setVisibleMessages(visible);
    };

    const container = messagesRef.current;
    if (container) {
      updateVisibleMessagesManual();
      container.addEventListener("scroll", updateVisibleMessagesManual);
    }

    return () => {
      if (container)
        container.removeEventListener("scroll", updateVisibleMessagesManual);
    };
  }, [messagesLocal]);

  // Read message
  const handleReadMessage = useCallback(async () => {
    if (!user?.id || visibleMessages.length === 0) return;
    const parsedData = visibleMessages.map((item) => JSON.parse(item));
    const messagesNotRead = parsedData.filter(
      (msg) =>
        msg.sender_id !== user.id &&
        !msg?.readers?.some((r) => r.user_id === user.id) &&
        !hasReadMessages.current.has(msg.id)
    );
    if (messagesNotRead.length === 0) return;
    await Promise.all(
      messagesNotRead.map(async (msg) => {
        hasReadMessages.current.add(msg.id);
        const res = await createMessageReaderAPI({
          message_id: msg.id,
          user_id: user.id,
        });
        if (res) {
          socket.emit("sendMessageReader", {
            ...res,
            conversation_id: activeConversation.id,
          });
        }
      })
    );
  }, [activeConversation?.id, user?.id, visibleMessages]);
  useEffect(() => {
    const timer = setTimeout(() => handleReadMessage(), 100);
    return () => clearTimeout(timer);
  }, [handleReadMessage]);
  useEffect(() => {
    handleReadMessage();
  }, [handleReadMessage]);
  // Socket read messageage
  useEffect(() => {
    const handleReceiveMessageReader = (messageReader) => {
      if (
        messageReader?.user_id !== user?.id &&
        messageReader?.conversation_id === activeConversation?.id
      ) {
        // C1
        // setMessagesLocal((prev) =>
        //   prev.map((msg) =>
        //     msg.id === messageReader.message_id
        //       ? {
        //           ...msg,
        //           readers: [
        //             ...msg.readers.filter(
        //               (m) => m.user_id !== messageReader.user_id
        //             ),
        //             messageReader,
        //           ],
        //         }
        //       : msg
        //   )
        // );
        // C2
        dispatch(readMessage(messageReader));
      }
    };
    socket.on("receiveMessageReader", handleReceiveMessageReader);
    return () => socket.off("receiveMessageReader", handleReceiveMessageReader);
  }, [activeConversation?.id, dispatch, user?.id]);

  // Revoke message
  useEffect(() => {
    const handleReceiveRevokeMessage = (message) => {
      if (
        message?.conversation_id === activeConversation?.id &&
        message?.sender_id !== user?.id
      ) {
        // C1
        // setMessagesLocal((prev) =>
        //   prev.map((msg) => (msg.id === message.id ? { ...message } : msg))
        // );
        // C2
        dispatch(replaceMessage(message));
      }
    };
    socket.on("revokeMessage", handleReceiveRevokeMessage);
    return () => socket.off("revokeMessage", handleReceiveRevokeMessage);
  }, [activeConversation?.id, dispatch, user?.id]);

  useEffect(() => {
    const handleReceiveRemovedMessage = (message) => {
      if (
        message?.conversation_id === activeConversation?.id &&
        message?.sender_id !== user?.id
      ) {
        // C1
        // setMessagesLocal((prev) =>
        //   prev.map((msg) => (msg.id === message.id ? { ...message } : msg))
        // );
        // C2
        dispatch(replaceMessage(message));
      }
    };
    socket.on("removeMessage", handleReceiveRemovedMessage);
    return () => socket.off("removeMessage", handleReceiveRemovedMessage);
  }, [activeConversation?.id, user?.id, dispatch]);

  // Socket receive block user
  useEffect(() => {
    const handleReceiveBlockUser = ({ friendship, conversationId }) => {
      if (conversationId === activeConversation?.id) {
        setFriendship(friendship);
      }
    };
    socket.on("blockUser", handleReceiveBlockUser);
    return () => socket.off("blockUser", handleReceiveBlockUser);
  }, [activeConversation?.id]);

  // Render messagesLocal
  const renderMessages = () => {
    if (messagesLocal?.length > 0) {
      return messagesLocal?.map((msg, index) => {
        if (msg?.conversation_id === activeConversation?.id) {
          const sender =
            msg.sender_id === user?.id
              ? user
              : usersCache[msg.sender_id] || null;
          if (msg.type === TYPE_MESSAGE.TEXT) {
            return (
              <div
                key={msg.id + index + Math.random()}
                className='message-item'
                data-message-id={JSON.stringify(msg)}
              >
                <TextMessage
                  incoming={msg.sender_id !== user?.id}
                  message={msg}
                  sender={sender}
                />
                {index + 1 <= messagesLocal.length - 1 &&
                  !isSameDay(
                    msg?.created_at,
                    messagesLocal[index + 1]?.created_at
                  ) && (
                    <MsgSeparator
                      date={getDateParts(messagesLocal[index + 1]?.created_at)}
                    />
                  )}
              </div>
            );
          } else if (msg.type === TYPE_MESSAGE.MEDIA) {
            return (
              <div
                key={msg.id + index + Math.random()}
                className='message-item'
                data-message-id={JSON.stringify(msg)}
              >
                <MediaMessage
                  incoming={msg.sender_id !== user?.id}
                  message={msg}
                  sender={sender}
                />
                {index + 1 <= messagesLocal.length - 1 &&
                  !isSameDay(
                    msg?.created_at,
                    messagesLocal[index + 1]?.created_at
                  ) && (
                    <MsgSeparator
                      date={getDateParts(messagesLocal[index + 1]?.created_at)}
                    />
                  )}
              </div>
            );
          } else if (msg.type === TYPE_MESSAGE.DOCUMENT) {
            return (
              <div
                key={msg.id + index + Math.random()}
                className='message-item'
                data-message-id={JSON.stringify(msg)}
              >
                <DocumentMessage
                  incoming={msg.sender_id !== user?.id}
                  message={msg}
                  sender={sender}
                />
                {index + 1 <= messagesLocal.length - 1 &&
                  !isSameDay(
                    msg?.created_at,
                    messagesLocal[index + 1]?.created_at
                  ) && (
                    <MsgSeparator
                      date={getDateParts(messagesLocal[index + 1]?.created_at)}
                    />
                  )}
              </div>
            );
          } else if (msg.type === TYPE_MESSAGE.EMOJI) {
            return (
              <div
                key={msg.id + index + Math.random()}
                className='message-item'
                data-message-id={JSON.stringify(msg)}
              >
                <EmojiMessage
                  incoming={msg.sender_id !== user?.id}
                  message={msg}
                  sender={sender}
                />
                {index + 1 <= messagesLocal.length - 1 &&
                  !isSameDay(
                    msg?.created_at,
                    messagesLocal[index + 1]?.created_at
                  ) && (
                    <MsgSeparator
                      date={getDateParts(messagesLocal[index + 1]?.created_at)}
                    />
                  )}
              </div>
            );
          }
        }
        return null;
      });
    }
  };

  return (
    activeConversation && (
      <>
        <div
          className={`flex h-full flex-col bg-[#1f1f1f] rounded-3xl ml-3 ${
            userInfoOpen ? "xl:w-1/2" : "xl:w-3/4"
          }`}
        >
          <div className='sticky flex items-center flex-row justify-between bg-black/20 opacity-90 shadow-2xl px-5 py-3'>
            <div className='flex items-center'>
              <div className='mr-4.5 h-11.5 w-full max-w-11.5 rounded-full relative cursor-pointer'>
                <img
                  src={
                    activeConversation?.type === TYPE_CONVERSATION.PERSONAL
                      ? receiver?.avatar
                      : activeConversation?.group_avatar
                  }
                  alt='avatar'
                  className='object-cover object-center rounded-full w-[46px] h-[46px]'
                />
                {activeConversation?.type === TYPE_CONVERSATION.PERSONAL && (
                  <span
                    className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full 
                    ${signalOnline ? "bg-success" : "bg-red"}`}
                  ></span>
                )}
              </div>
              <div>
                <h5 className='font-medium text-white'>
                  {activeConversation?.type === TYPE_CONVERSATION.PERSONAL
                    ? receiver?.display_name
                    : activeConversation?.group_name}
                </h5>
                {activeConversation?.type === TYPE_CONVERSATION.PERSONAL && (
                  <p className='text-sm'>
                    {signalOnline
                      ? "Online"
                      : `Active ${timeAgo(receiver?.last_online_at)} ago`}
                  </p>
                )}
              </div>
            </div>
            <div className='flex flex-row items-center space-x-5'>
              <div onClick={handleToggleUserInfo}>
                <Dropdown size={25} className='text-[#a10eeb]' />
              </div>
            </div>
          </div>

          <div
            ref={messagesRef}
            className='max-h-full space-y-3.5 flex flex-col gap-2 overflow-auto px-5 py-7 grow no-scrollbar'
          >
            {renderMessages()}
          </div>

          <div className='sticky bottom-0 px-6 py-5 bg-[#1f1f1f]'>
            {friendship?.is_blocked &&
            activeConversation?.type === TYPE_CONVERSATION.PERSONAL ? (
              <div className='text-center text-white font-semibold'>
                {friendship?.action_by_user_id === user?.id
                  ? `You bloked ${receiver?.display_name}`
                  : `${receiver?.display_name} blocked you`}
              </div>
            ) : (
              <div className='flex items-center justify-between space-x-4.5'>
                <div className='relative w-full'>
                  <input
                    type='text'
                    placeholder='Type something here'
                    className='h-12 w-full rounded-2xl border pl-5 pr-19 text-white placeholder-body outline-none focus:border-primary bg-[#2e2e2e]'
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && messageInput.trim()) {
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className='absolute flex right-5 top-1/2 -translate-y-1/2 items-center text-2xl justify-end space-x-4'>
                    <div>
                      <Attachment size={20} />
                    </div>
                    <button
                      className='hover:text-primary'
                      onClick={handleToggleGiphy}
                    >
                      <Gif size={20} />
                    </button>
                    <div className='hover:text-primary'>
                      <EmojiPicker
                        size={20}
                        setMessageInput={setMessageInput}
                      />
                    </div>
                  </div>
                </div>
                {messageInput.trim() ? (
                  <button
                    className='flex items-center justify-center h-12 max-w-12 w-full rounded-md bg-primary text-white hover:bg-opacity-90'
                    onClick={() => handleSendMessage()}
                  >
                    <PaperPlaneTilt size={24} weight='bold' />
                  </button>
                ) : (
                  <button
                    className='flex items-center justify-center h-12 max-w-12 w-full rounded-md bg-primary text-white hover:bg-opacity-90'
                    onClick={() =>
                      handleSendMessage(
                        activeConversation?.conversation_emoji || "👍"
                      )
                    }
                  >
                    <ThumbsUp size={24} weight='bold' />
                  </button>
                )}
              </div>
            )}
            {gifOpen && <Giphy />}
          </div>
        </div>
        {videoCall && (
          <VideoCall open={videoCall} handleClose={handleToggleVideoCall} />
        )}
        {audioCall && (
          <AudioCall open={audioCall} handleClose={handleToggleAudioCall} />
        )}
        {userInfoOpen &&
          activeConversation.type === TYPE_CONVERSATION.PERSONAL && (
            <div className='w-1/4'>
              <UserInfo
                handleToggleUserInfo={handleToggleUserInfo}
                friendInfo={receiver}
                friendship={friendship}
                signalOnline={signalOnline}
              />
            </div>
          )}
      </>
    )
  );
}

import { Check, Checks, DownloadSimple, File } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react"; // Thêm useMemo
import { SmilePlus } from "lucide-react";
import ReactionsPicker from "../Reaction/ReactionsPicker";
import { socket } from "../../socket/socket";
import {
  createMessageReactionAPI,
  updateMessageReactionAPI,
  deleteMessageReactionAPI,
} from "../../apis/apis";
import { useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import ReactionModal from "../Modal/ReactionModal";
import MessageMenu from "../MesaageMenu";
import { getTimeFromTimestamp } from "../../utils/formater";
import { activeConversationSelector } from "../../redux/slices/activeConversationSlice";

export default function Document({ incoming, author, message, sender }) {
  const [showReactionBar, setShowReactionBar] = useState(false);
  const [selectedReactions, setSelectedReactions] = useState(
    message?.reactions || []
  );
  const [selectedReactionsRender, setSelectedReactionsRender] = useState([]);
  const user = useSelector(userSelector);
  const { activeConversation } = useSelector(activeConversationSelector);
  const [isRevoked, setIsRevoked] = useState(message?.is_revoked);

  const deletedByUsers = useMemo(
    () => message?.deleted_by_users || [],
    [message?.deleted_by_users]
  );

  const isDeleted = useMemo(() => {
    if (deletedByUsers?.length > 0) {
      return deletedByUsers.some((d) => d.user_id === user.id);
    }
    return false;
  }, [deletedByUsers, user?.id]);

  // Handle reaction
  const handlePickReaction = async (reaction) => {
    const isExistUser = selectedReactions?.some((r) => r.user_id === user?.id);
    let action = "create";
    let reactionAction;
    let newState = [];
    if (isExistUser) {
      const isExistReaction = selectedReactions?.some(
        (r) => r.reaction === reaction && r.user_id === user?.id
      );
      if (isExistReaction) {
        newState = selectedReactions.filter((r) => r.user_id !== user?.id);
        action = "delete";
        reactionAction = selectedReactions.find((r) => r.user_id === user?.id);
      } else {
        newState = selectedReactions.map((r) =>
          r.user_id === user?.id ? { ...r, reaction } : r
        );
        action = "update";
        reactionAction = selectedReactions.find((r) => r.user_id === user?.id);
      }
    } else {
      action = "create";
      newState = [...selectedReactions, { user_id: user.id, reaction }];
    }
    setSelectedReactions(newState);
    if (action === "create") {
      const res = await createMessageReactionAPI({
        message_id: message.id,
        user_id: user.id,
        reaction,
      });
      if (res) {
        newState.pop();
        newState.push(res);
      }
    } else if (action === "update") {
      await updateMessageReactionAPI(reactionAction.id, { reaction });
    } else if (action === "delete") {
      await deleteMessageReactionAPI(reactionAction.id);
    }
    socket.emit("sendReaction", {
      ...message,
      reactions: newState,
    });
    setShowReactionBar(false);
  };

  // Socket receive reaction
  useEffect(() => {
    const handleReceiveReactions = (messageSocket) => {
      if (
        activeConversation?.id === messageSocket.conversation_id &&
        messageSocket.id === message.id
      ) {
        setSelectedReactions(messageSocket.reactions);
      }
    };
    socket.on("receiveReaction", handleReceiveReactions);
    return () => socket.off("receiveReaction");
  }, [activeConversation?.id, message.id]);

  // Set reaction => render
  useEffect(() => {
    if (selectedReactions?.length > 0) {
      setSelectedReactionsRender(() => {
        const isExist = [];
        const newState = selectedReactions.map((r) => {
          if (!isExist.includes(r.reaction)) {
            isExist.push(r.reaction);
            return r;
          }
        });
        return newState.filter((r) => r);
      });
    } else {
      setSelectedReactionsRender([]);
    }
  }, [selectedReactions]);

  return (
    message?.files?.length > 0 &&
    message?.files?.map((file, index) => {
      return incoming ? (
        <div key={index} className='max-w-125 w-fit'>
          <div className='flex items-center gap-4'>
            <div
              className={`mb-2.5 rounded-2xl px-5 py-3 dark:bg-boxdark-2 space-y-2 relative
              ${
                !isRevoked && !isDeleted
                  ? "bg-gray"
                  : "bg-transparent border-2 border-red"
              }`}
            >
              {!isRevoked && !isDeleted ? (
                <>
                  <div className='flex flex-row items-center justify-between p-2 bg-gray-3 rounded-md dark:bg-boxdark'>
                    <div className='flex flex-row items-center space-x-3'>
                      <div className='p-2 rounded-md bg-primary/80 text-white'>
                        <File size={20} />
                      </div>
                      <div className='flex flex-col'>
                        <div>{file?.file_name || "file"}</div>
                        {file?.file_size && (
                          <div className='text-sm font-medium'>
                            {(file?.file_size / 1024 / 1024).toFixed(2)}MB
                          </div>
                        )}
                      </div>
                    </div>
                    <a href={file.file_url} download={file?.file_name}>
                      <button className='pl-5'>
                        <DownloadSimple />
                      </button>
                    </a>
                  </div>
                  <p className='text-left'>{message.content}</p>
                  <div className='absolute bottom-[-5%] right-0'>
                    <ReactionModal
                      handlePickReaction={handlePickReaction}
                      selectedReactions={selectedReactions}
                      selectedReactionsRender={selectedReactionsRender}
                    />
                  </div>
                </>
              ) : isRevoked ? (
                <p className='text-white italic'>
                  {message.sender_id === user?.id
                    ? "You revoked this message"
                    : `${
                        sender?.display_name || "Someone"
                      } revoked this message`}
                </p>
              ) : (
                isDeleted && (
                  <p className='text-white italic'>You removed this message</p>
                )
              )}
            </div>
            {!isRevoked && !isDeleted && (
              <div className='w-fit'>
                <span className='flex flex-col justify-center gap-4'>
                  <span className='w-full flex justify-end relative gap-2'>
                    <MessageMenu message={message} role='receiver' />
                    <SmilePlus
                      width={20}
                      height={20}
                      onClick={() => setShowReactionBar((prev) => !prev)}
                      className='cursor-pointer'
                    />
                    {showReactionBar && (
                      <div className='absolute bottom-0 right-[-100%] translate-x-[100%] z-[100000000]'>
                        <ReactionsPicker
                          handlePickReaction={handlePickReaction}
                        />
                      </div>
                    )}
                  </span>
                </span>
              </div>
            )}
          </div>
          <p className='text-xs'>{getTimeFromTimestamp(message.created_at)}</p>
        </div>
      ) : (
        <div key={index} className='max-w-125 w-fit ml-auto'>
          <div className='flex items-center gap-4'>
            {!isRevoked && !isDeleted && (
              <div className='w-fit'>
                <span className='flex flex-col justify-center gap-4'>
                  <span className='w-full flex justify-end relative gap-2'>
                    <MessageMenu message={message} role='sender' />
                    <SmilePlus
                      width={20}
                      height={20}
                      onClick={() => setShowReactionBar((prev) => !prev)}
                      className='cursor-pointer'
                    />
                    {showReactionBar && (
                      <div className='absolute bottom-0 right-[-100%] translate-x-[100%] z-[100000000]'>
                        <ReactionsPicker
                          handlePickReaction={handlePickReaction}
                        />
                      </div>
                    )}
                  </span>
                </span>
              </div>
            )}
            <div
              className={`mb-2.5 rounded-2xl px-5 py-3 space-y-2 relative
              ${
                !isRevoked && !isDeleted
                  ? "bg-primary text-white"
                  : "bg-transparent border-2 border-red"
              }`}
            >
              {!isRevoked && !isDeleted ? (
                <>
                  <div className='flex flex-row items-center justify-between p-2 bg-white rounded-md text-primary'>
                    <div className='flex flex-row items-center space-x-3'>
                      <div className='p-2 rounded-md bg-primary/20 text-primary'>
                        <File size={20} />
                      </div>
                      <div className='flex flex-col'>
                        <div>{file?.file_name || "file"}</div>
                        {file?.file_size && (
                          <div className='text-sm font-medium'>
                            {(file?.file_size / 1024 / 1024).toFixed(2)}MB
                          </div>
                        )}
                      </div>
                    </div>
                    <a
                      href={file?.file_url}
                      download={file?.file_name || "file download"}
                    >
                      <button className='pl-5'>
                        <DownloadSimple />
                      </button>
                    </a>
                  </div>
                  <p className='text-left'>{message.content}</p>
                  <div className='absolute bottom-[-5%] right-0'>
                    <ReactionModal
                      handlePickReaction={handlePickReaction}
                      selectedReactions={selectedReactions}
                      selectedReactionsRender={selectedReactionsRender}
                    />
                  </div>
                </>
              ) : isRevoked ? (
                <p className='text-white italic'>
                  {message.sender_id === user?.id
                    ? "You revoked this message"
                    : `${
                        sender?.display_name || "Someone"
                      } revoked this message`}
                </p>
              ) : (
                isDeleted && (
                  <p className='text-white italic'>You removed this message</p>
                )
              )}
            </div>
          </div>
          {!isRevoked && !isDeleted && (
            <div className='flex flex-row items-center justify-end space-x-2'>
              <div
                className={`${
                  message?.readers?.length === 0
                    ? "text-body dark:text-white"
                    : "text-primary"
                }`}
              >
                {message?.readers?.length > 0 ? (
                  <Checks weight='bold' size={18} />
                ) : (
                  <Check weight='bold' size={18} />
                )}
              </div>
              <p className='text-xs text-right'>
                {getTimeFromTimestamp(message.created_at)}
              </p>
            </div>
          )}
        </div>
      );
    })
  );
}

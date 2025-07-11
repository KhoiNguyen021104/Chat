import { useEffect, useMemo, useState } from "react";
import extractLinks from "../../utils/extractLinks";
import Microlink from "@microlink/react";
import { Check, Checks } from "@phosphor-icons/react";
import { SmilePlus } from "lucide-react";
import ReactionsPicker from "../Reaction/ReactionsPicker";
import { socket } from "../../socket/socket";
import {
  createMessageReactionAPI,
  deleteMessageReactionAPI,
  updateMessageReactionAPI,
} from "../../apis/apis";
import { useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import ReactionModal from "../Modal/ReactionModal";
import MessageMenu from "../MesaageMenu";
import { getTimeFromTimestamp } from "../../utils/formater";
import { activeConversationSelector } from "../../redux/slices/activeConversationSlice";

export default function Emoji({ incoming, author, message, sender }) {
  const { links, originalString } = extractLinks(message?.content);
  const [showReactionBar, setShowReactionBar] = useState(false);
  const [selectedReactions, setSelectedReactions] = useState(
    message?.reactions || []
  );
  const user = useSelector(userSelector);
  const { activeConversation } = useSelector(activeConversationSelector);
  const [selectedReactionsRender, setSelectedReactionsRender] = useState([]);
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
    <>
      {incoming ? (
        <div className='max-w-125 w-fit'>
          <div className='flex items-center gap-4 relative'>
            <div
              className={`mb-2.5 rounded-2xl px-5 py-3 dark:bg-boxdark-2 space-y-2 relative
             ${
               !message?.is_revoked && !isDeleted
                 ? "bg-gray"
                 : "bg-transparent border-2 border-red"
             }`}
            >
              {!message.is_revoked && !isDeleted ? (
                <>
                  <p dangerouslySetInnerHTML={{ __html: originalString }}></p>
                  {links.length > 0 && (
                    <Microlink
                      style={{ width: "100%", border: "none" }}
                      url={links[0]}
                    />
                  )}
                  <div className='absolute right-0 bottom-[-10%]'>
                    <ReactionModal
                      handlePickReaction={handlePickReaction}
                      selectedReactions={selectedReactions}
                      selectedReactionsRender={selectedReactionsRender}
                    />
                  </div>
                </>
              ) : message?.is_revoked ? (
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
            {!message?.is_revoked && !isDeleted && (
              <div className='w-fit'>
                <span className='flex flex-col justify-center gap-4'>
                  <span className='w-full flex justify-end relative gap-2'>
                    <SmilePlus
                      width={20}
                      height={20}
                      onClick={() => setShowReactionBar((prev) => !prev)}
                      className='cursor-pointer'
                    />
                    <MessageMenu message={message} role='receiver' />
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
        <div className='max-w-125 w-fit ml-auto'>
          <div className='flex items-center gap-4 relative'>
            {!message?.is_revoked && !isDeleted && (
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
                      <div className='absolute bottom-0 right-[50%] translate-x-[-10%] z-[100000000]'>
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
              className={`mb-2.5 rounded-2xl ${
                !message?.is_revoked && !isDeleted
                  ? "bg-primary"
                  : "bg-transparent border-2 border-red"
              } px-5 py-3 space-y-2 relative`}
            >
              {!message?.is_revoked && !isDeleted ? (
                <>
                  <p
                    className='text-white'
                    dangerouslySetInnerHTML={{ __html: originalString }}
                  ></p>
                  {links.length > 0 && (
                    <Microlink
                      style={{ width: "100%", border: "none" }}
                      url={links[0]}
                    />
                  )}
                  <div className='absolute right-0 bottom-[-10%]'>
                    <ReactionModal
                      handlePickReaction={handlePickReaction}
                      selectedReactions={selectedReactions}
                      selectedReactionsRender={selectedReactionsRender}
                    />
                  </div>
                </>
              ) : message?.is_revoked ? (
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
          {!message?.is_revoked && !isDeleted && (
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
      )}
    </>
  );
}

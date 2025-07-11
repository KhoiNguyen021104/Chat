import { useEffect, useState } from "react";
import { getUserByIdAPI, updateFriend } from "../../../apis/apis";
import { STATUS_FRIEND_REQUEST } from "../../../config/constants";
import { useSelector } from "../../../redux/store";
import { userSelector } from "../../../redux/slices/userSlice";
import { socket } from "../../../socket/socket";

function FriendRequest({
  friendRequest,
  setFriendRequests,
  friendRequests,
  setHasNotifications,
}) {
  const [other, setOther] = useState(null);
  const user = useSelector(userSelector);
  useEffect(() => {
    if (friendRequest.sender_id && friendRequest.receiver_id) {
      const fetchSender = async () => {
        let res = {};
        if (friendRequest.sender_id === user.id) {
          res = await getUserByIdAPI(friendRequest.receiver_id);
        } else {
          res = await getUserByIdAPI(friendRequest.sender_id);
        }
        if (res) {
          setOther(res);
        }
      };
      fetchSender();
    }
  }, [friendRequest.receiver_id, friendRequest.sender_id, user.id]);

  const handleReplyFriendRequest = async (status) => {
    const res = await updateFriend(friendRequest.id, {
      user_id: user.id,
      status,
    });
    if (res) {
      setFriendRequests((prev) => {
        const newPrev = prev?.map((req) => {
          if (req?.id === res.id) {
            req = { ...res };
          }
          return req;
        });
        return newPrev;
      });
      socket.emit("replyFriendRequest", {
        friendRequest: res,
        conversation: {},
      });
      // if(status === STATUS_FRIEND_REQUEST.ACCEPTED) {
      //   socket.emit('sendNewConversation', )
      // }
      // setHasNotifications(friendRequests.some(fr => fr.status ===));
    }
  };

  return (
    friendRequest &&
    other &&
    user && (
      <div className='flex flex-col hover:bg-gray-100 p-4 rounded-[4px] mb-4'>
        {friendRequest?.status === STATUS_FRIEND_REQUEST.PENDING &&
          other.id !== user.id && (
            <>
              <div className='flex justify-start gap-4 items-center'>
                <div className='w-fit h-fit shadow-md rounded-full'>
                  <img
                    src={other?.avatar}
                    alt='avatar'
                    className='h-auto object-cover object-center rounded-full w-[40px]'
                  />
                </div>
                <div className='flex flex-col'>
                  <span>
                    <span className='font-semibold text-nowrap'>
                      {other?.display_name} send you a friend request
                    </span>
                  </span>
                  <span className='text-xl text-gray-500'>
                    {/* {timeAgo(friendRequest?.createdAt)} */}
                  </span>
                </div>
              </div>
              <div className='flex gap-6 mt-4 w-full justify-end'>
                <button
                  onClick={() =>
                    handleReplyFriendRequest(STATUS_FRIEND_REQUEST.ACCEPTED)
                  }
                  className='px-4 py-2 bg-blue-500 text-white rounded font-semibold'
                >
                  Confirm
                </button>
                <button
                  onClick={() =>
                    handleReplyFriendRequest(STATUS_FRIEND_REQUEST.REJECTED)
                  }
                  className='px-4 py-2 bg-graydark text-white rounded font-semibold'
                >
                  Delete
                </button>
              </div>
            </>
          )}
        {(friendRequest?.status === STATUS_FRIEND_REQUEST.ACCEPTED ||
          friendRequest?.status === STATUS_FRIEND_REQUEST.BLOCKED) && (
          <>
            <div className='flex justify-start gap-4 items-center'>
              <div className='w-fit h-fit shadow-md rounded-full'>
                <img
                  src={
                    // other?.id !== friendRequest.sender_id
                    //   ? other.avatar
                    //   : user.avatar
                    other.avatar
                  }
                  alt='avatar'
                  className='h-[40px] object-cover object-center rounded-full w-[40px]'
                />
              </div>
              <div className='flex flex-col'>
                <span>
                  <span className='font-semibold text-nowrap text-green-500'>
                    {user?.id !== friendRequest.sender_id
                      ? `${other.display_name} accepted your friend request`
                      : `You accepted ${other.display_name}'s friend request`}
                  </span>
                </span>
                <span className='text-xl text-gray-500'>
                  {/* {timeAgo(request?.createdAt)} */}
                </span>
              </div>
            </div>
          </>
        )}
        {friendRequest?.status === STATUS_FRIEND_REQUEST.REJECTED && (
          <>
            <div className='flex justify-start gap-4 items-center'>
              <div className='w-fit h-fit shadow-md rounded-full'>
                <img
                  src={
                    other?.id !== friendRequest.sender_id
                      ? other.avatar
                      : user.avatar
                  }
                  alt='avatar'
                  className='h-auto object-cover object-center rounded-full w-[40px]'
                />
              </div>
              <div className='flex flex-col'>
                <span>
                  <span className='font-semibold text-nowrap text-red'>
                    {other?.id !== friendRequest.sender_id
                      ? `${other.display_name} accepted your friend request`
                      : `You accepted ${other.display_name}'s friend request`}
                  </span>
                </span>
                <span className='text-xl text-gray-500'>
                  {/* {timeAgo(request?.createdAt)} */}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    )
  );
}

export default FriendRequest;

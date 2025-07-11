import { Modal } from "antd";
import { useState } from "react";
import { createDeletedMessageAPI, updateMessageAPI } from "../../apis/apis";
import { useDispatch, useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import { socket } from "../../socket/socket";
import { replaceMessage } from "../../redux/slices/messagesSlice";
const ModalRevokeMessage = ({ message, role }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeRevoke, setTypeRevoke] = useState(null);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleRevokedMessage = async () => {
    if (typeRevoke === "all") {
      const res = await updateMessageAPI(message.id, { is_revoked: true });
      if (res) {
        socket.emit("revokeMessage", { ...message, is_revoked: true });
        dispatch(replaceMessage({ ...message, is_revoked: true }));
      }
    } else if (typeRevoke === "me") {
      const res = await createDeletedMessageAPI({
        message_id: message?.id,
        user_id: user?.id,
      });
      if (res) {
        const newMessage = {
          ...message,
          deleted_by_users: [...message.deleted_by_users, res],
        };
        socket.emit("removeMessage", newMessage);
        dispatch(replaceMessage(newMessage));
      }
    }
    setTypeRevoke(null);
    setIsModalOpen(false);
  };
  return (
    <>
      <span onClick={showModal} className='z-[1000000000]'>
        <li className='font-semibold p-3 px-10 text-nowrap hover:bg-gray-2'>
          <span className='hover:text-red'>Thu hồi</span>
        </li>
      </span>
      <Modal
        title='Add friend'
        open={isModalOpen}
        onOk={handleRevokedMessage}
        okText='Recall'
        onCancel={handleCancel}
      >
        <div className='flex flex-col items-start justify-center min-w-[500px] gap-4'>
          {role === "sender" && (
            <div className='flex items-start justify-start gap-4'>
              <div className='flex items-center justify-start gap-2'>
                <input
                  value='all'
                  id='cb1'
                  name='cb'
                  type='radio'
                  className='h-8 w-8'
                  onChange={(e) => setTypeRevoke(e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-2 justify-start items-start'>
                <label htmlFor='cb1' className='font-semibold'>
                  Thu hồi với mọi người
                </label>
                <span className='text-gray-500'>
                  Tin nhắn này sẽ bị thu hồi với mọi người trong đoạn chat.
                  Những người khác có thể đã xem hoặc chuyển tiếp tin nhắn đó.
                  Tin nhắn đã thu hồi vẫn có thể bị báo cáo.
                </span>
              </div>
            </div>
          )}
          <div className='flex items-start justify-start gap-4'>
            <div className='flex items-center justify-start gap-2'>
              <input
                value='me'
                id='cb2'
                name='cb'
                type='radio'
                className='h-8 w-8'
                onChange={(e) => setTypeRevoke(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor='cb2' className='font-semibold'>
                Thu hồi với bạn
              </label>
              <span className='text-gray-500'>
                Tin nhắn này sẽ bị gỡ khỏi thiết bị của bạn, nhưng vẫn hiển thị
                với các thành viên khác trong đoạn chat.
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ModalRevokeMessage;

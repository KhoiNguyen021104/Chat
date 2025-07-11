import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import { getUserByIdAPI } from "../../apis/apis";
const ReactionModal = ({
  selectedReactionsRender,
  selectedReactions,
  handlePickReaction,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reactionsDetail, setReactionsDetail] = useState([]);
  const user = useSelector(userSelector);
  const [tab, setTab] = useState("all");

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // if (!isModalOpen) {
    // }
  }, [isModalOpen]);

  const handleChangeTab = (tab) => {
    setTab(tab.trim());
  };

  const handleRemoveReaction = (detail) => {
    handlePickReaction(detail.reaction);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedReactions?.length > 0) {
      const fetchUsers = async () => {
        const users = await Promise.all(
          selectedReactions?.map((reaction) =>
            getUserByIdAPI(reaction?.user_id)
          )
        );
        if (users?.length > 0) {
          setReactionsDetail(() => {
            const newState = users?.map((u, index) => {
              return { ...u, reaction: selectedReactions[index]?.reaction };
            });
            return newState;
          });
        }
      };
      fetchUsers();
    }
  }, [selectedReactions]);

  useEffect(() => {
    // if (selectedReactionsRender?.length > 0) {
    //   console.log(
    //     "🚀 ~ useEffect ~ selectedReactionsRender:",
    //     selectedReactionsRender
    //   );
    // }
  }, [selectedReactionsRender]);
  return (
    <>
      <div onClick={showModal}>
        {selectedReactionsRender.length > 0 && (
          <div className='flex items-center bg-white h-fit w-fit text-[10px] rounded-2xl shadow-md cursor-pointer px-1'>
            {selectedReactionsRender.length === 1
              ? selectedReactionsRender[0].reaction
              : selectedReactionsRender
                  ?.slice(0, 3)
                  ?.map((r, index) => <span key={index}>{r.reaction}</span>)}
            {selectedReactionsRender?.length === 1 &&
              selectedReactions.length > 1 &&
              selectedReactions.length}

            {selectedReactionsRender?.length > 1 &&
              selectedReactions.length > 3 &&
              selectedReactions.length}
          </div>
        )}
      </div>
      <Modal
        title='Reaction about this message'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
      >
        <div className='flex flex-col items-start justify-center min-w-[500px] '>
          <div className='flex items-center justify-start gap-2'>
            <div
              onClick={() => handleChangeTab("all")}
              className={`py-6 px-10 flex items-center justify-center 
            ${
              tab === "all"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "rounded-2xl hover:bg-gray-100 cursor-pointer"
            }
            `}
            >
              <span className='text-xl text-center align-middle text-nowrap'>
                All {`(${selectedReactions?.length})`}
              </span>
            </div>
            <div className='flex items-center justify-center'>
              {selectedReactionsRender?.map((r, index) => (
                <div
                  key={index}
                  onClick={() => handleChangeTab(r.reaction)}
                  className={`py-6 px-10 flex items-center justify-center 
            ${
              tab === r.reaction
                ? "border-b-4 border-blue-600 text-blue-600"
                : "rounded-2xl hover:bg-gray-100 cursor-pointer"
            }
            `}
                >
                  <span className='text-xl text-center align-middle text-nowrap'>
                    {`${r.reaction}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {reactionsDetail?.length > 0 &&
            tab === "all" &&
            reactionsDetail?.map((detail, index) => (
              <div key={index} className='flex flex-col mt-12 w-full'>
                <div className='flex justify-between items-center w-full'>
                  <div className='flex gap-4 flex-1 cursor-pointer'>
                    <div className='rounded-full w-fit h-fit flex items-center justify-center'>
                      <img
                        className='w-[40px] h-[40px] rounded-full object-cover'
                        src={detail?.avatar}
                        alt=''
                      />
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        {detail?.display_name}
                      </span>
                      {user?.id === detail?.id ? (
                        <span
                          className='text-sm text-graydark'
                          onClick={() => handleRemoveReaction(detail)}
                        >
                          Click to remove
                        </span>
                      ) : (
                        <span className='text-sm text-graydark'>
                          Click to watch profile
                        </span>
                      )}
                    </div>
                  </div>
                  <span className='text-3xl mr-2'>{detail.reaction}</span>
                </div>
              </div>
            ))}
          {reactionsDetail?.length > 0 &&
            reactionsDetail?.map(
              (detail, index) =>
                detail?.reaction === tab &&
                tab !== "all" && (
                  <div
                    key={index}
                    className='flex flex-col mt-12 w-full cursor-pointer'
                  >
                    <div className='flex justify-between items-center w-full'>
                      <div className='flex gap-4 flex-1'>
                        <div className='rounded-full w-fit h-fit flex items-center justify-center'>
                          <img
                            className='w-[40px] h-[40px] rounded-full object-cover'
                            src={detail?.avatar}
                            alt=''
                          />
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-medium'>
                            {detail?.display_name}
                          </span>
                          {user?.id === detail?.id ? (
                            <span
                              className='text-sm text-graydark'
                              onClick={() => handleRemoveReaction(detail)}
                            >
                              Click to remove
                            </span>
                          ) : (
                            <span className='text-sm text-graydark'>
                              Click to watch profile
                            </span>
                          )}
                        </div>
                      </div>
                      {tab !== "all" && (
                        <span className='text-3xl mr-2'>{tab}</span>
                      )}
                    </div>
                  </div>
                )
            )}
        </div>
      </Modal>
    </>
  );
};
export default ReactionModal;

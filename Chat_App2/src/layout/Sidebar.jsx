import { Bell, Shapes, SignOut, UserCircle } from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import icon_logo from "./Lottie_logo.json";
import Lottie from "lottie-react";
import { FaFacebookMessenger } from "react-icons/fa";
import { RiMessage2Fill, RiTeamLine } from "react-icons/ri";
import {
  getAllFriendShipsByUserId,
  handleLogoutAPI,
  updateUserAPI,
} from "../apis/apis";
import { useDispatch, useSelector } from "../redux/store";
import { setUser, userSelector } from "../redux/slices/userSlice";
import FriendRequest from "../components/Notification/FriendRequest/FriendRequest";
import { socket } from "../socket/socket";
import { auth } from "../config/firebase";
import { setActiveConversation } from "../redux/slices/activeConversationSlice";
import { setMessages } from "../redux/slices/messagesSlice";
import { STATUS_FRIEND_REQUEST } from "../config/constants";

const NAVIGATION = [
  {
    key: 0,
    title: "Chats",
    icon: <FaFacebookMessenger size={37} />,
    path: "/chat",
  },
  // {
  //   key: 1,
  //   title: "Channels",
  //   icon: <RiTeamLine size={37} />,
  //   path: "/chat/teams",
  // },
  // {
  //   key: 2,
  //   title: "Requests",s
  //   icon: <RiMessage2Fill size={37} />,
  //   path: "/chat/requests",
  // },
];

const USER_MENU_ITEMS = [
  // { title: "Preferences", icon: "⚙️", path: "/chat/preferences" },
  { title: "Edit username", icon: "✏️", path: "/chat/profile" },
  // {
  //   title: "Restricted accounts",
  //   icon: "🚫",
  //   path: "/chat/restricted-accounts",
  // },
  // { title: "Privacy & safety", icon: "🏠", path: "/chat/privacy-safety" },
  // { title: "Family Center", icon: "👨‍👩‍👧‍👦", path: "/chat/family-center" },
  // { title: "Help", icon: "❓", path: "/chat/help" },
  // { title: "Report a problem", icon: "⚠️", path: "/chat/report-problem" },
  // { title: "Terms", icon: "📜", path: "/chat/terms" },
  // { title: "Privacy Policy", icon: "🔒", path: "/chat/privacy-policy" },
  // { title: "Cookie Policy", icon: "🍪", path: "/chat/cookie-policy" },
  { title: "Log out", icon: "🔄", action: "logout" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const menuRef = useRef(null);
  const user = useSelector(userSelector);
  const [friendRequests, setFriendRequests] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const dispatch = useDispatch();

  const handleClick = (key) => {
    navigate(NAVIGATION[key].path);
    setSelected(key);
  };

  const handleMenuItemClick = async (item) => {
    if (user.id) {
      // Logout
      if (item.action === "logout") {
        socket.emit("sendSignalOffline", user.id);
        await updateUserAPI(user.id, { status: "offline" });
        dispatch(setUser(null));
        await auth.signOut();
        await handleLogoutAPI();
        dispatch(setActiveConversation(null));
        dispatch(setMessages([]));
        localStorage.clear();
        navigate("/");
      } else {
        navigate(item.path);
      }
      setIsUserMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user.id) {
      const fetchFriendRequest = async () => {
        const res = await getAllFriendShipsByUserId(user?.id);
        const friendships = res?.friendships;
        if (friendships.length > 0) {
          const sortedData = friendships
            .sort((a, b) => {
              if (
                a.status === STATUS_FRIEND_REQUEST.PENDING &&
                b.status !== STATUS_FRIEND_REQUEST.PENDING
              )
                return -1;
              if (
                a.status !== STATUS_FRIEND_REQUEST.PENDING &&
                b.status === STATUS_FRIEND_REQUEST.PENDING
              )
                return 1;

              if (
                a.status === STATUS_FRIEND_REQUEST.PENDING &&
                b.status === STATUS_FRIEND_REQUEST.PENDING
              ) {
                return new Date(b.created_at) - new Date(a.created_at);
              } else {
                return new Date(b.updated_at) - new Date(a.updated_at);
              }
            })
            .filter(
              (req) =>
                req.status !== STATUS_FRIEND_REQUEST.PENDING ||
                req.receiver_id === user.id
            );
          setFriendRequests(sortedData);
          setHasNotifications(
            friendships.some(
              (f) =>
                f.receiver_id === user.id &&
                f.status === STATUS_FRIEND_REQUEST.PENDING
            )
          );
          setTotalNotifications(sortedData.length);
        }
      };
      fetchFriendRequest();
    }
  }, [user?.id]);

  useEffect(() => {
    const handleReceiveFriendRequest = async (friendRequest) => {
      if (friendRequest.status === STATUS_FRIEND_REQUEST.PENDING) {
        setFriendRequests((prev) => [friendRequest, ...prev]);
        setHasNotifications(true);
        setTotalNotifications((prev) => prev + 1);
      }
    };
    socket.on("receiveFriendRequest", handleReceiveFriendRequest);
    return () => {
      socket.off("receiveFriendRequest", handleReceiveFriendRequest);
    };
  }, []);

  useEffect(() => {
    const handleReceiveReplyFriendRequest = async (replyData) => {
      console.log(
        "🚀 ~ handleReceiveReplyFriendRequest ~ replyData:",
        replyData
      );
      const { friendship } = replyData;
      if (friendship.id) {
        setHasNotifications(true);
        setTotalNotifications((prev) => prev + 1);
        setFriendRequests((prev) => [friendship, ...prev]);
      }
    };
    socket.on("replyFriendRequest", handleReceiveReplyFriendRequest);
    return () => {
      socket.off("replyFriendRequest", handleReceiveReplyFriendRequest);
    };
  }, []);

  // Open Notification Popover
  const handleOpenNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (friendRequests.length > 0) {
      const isExistFriendRequestPending = friendRequests.some(
        (req) => req.status === STATUS_FRIEND_REQUEST.PENDING
      );
      if (!isExistFriendRequestPending) setHasNotifications(false);
      setTotalNotifications(
        friendRequests.filter(
          (req) => req.status === STATUS_FRIEND_REQUEST.PENDING
        ).length
      );
    }
  };

  return (
    <div className='flex flex-col border-[#242526] items-center justify-start relative'>
      <div className='flex flex-col items-center space-y-5'>
        <Lottie
          animationData={icon_logo}
          loop={true}
          autoplay={true}
          style={{ height: 100, width: 100 }}
        />
        {NAVIGATION.map(({ icon, key }) => (
          <div
            key={key}
            className='space-y-2 flex flex-col text-center hover:cursor-pointer hover:bg-[#2e2e2e]'
            onClick={() => handleClick(key)}
          >
            <div
              className={`mx-auto p-2 dark:border-[#2e2e2e] ${
                selected === key && "bg-opacity-90 text-white"
              }`}
            >
              {icon}
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-col grow'></div>

      <div className='flex flex-col items-center space-y-2 relative'>
        <button
          className='w-full flex flex-row items-center justify-center rounded-md p-2 hover:cursor-pointer'
          onClick={handleOpenNotification}
        >
          <Bell size={50} />
        </button>
        {hasNotifications && (
          <span className='absolute h-[1px] w-[1px] rounded-full bg-red right-[15%] flex items-center justify-center text-white p-2'>
            {totalNotifications}
          </span>
        )}
      </div>

      <div className='flex flex-col items-center space-y-2'>
        <button
          className='w-full flex flex-row items-center justify-center rounded-md p-2 hover:cursor-pointer'
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        >
          {user?.avatar ? (
            <img
              src={user?.avatar}
              alt='avatar'
              className='rounded-full w-12 h-12'
            />
          ) : (
            <UserCircle size={50} />
          )}
        </button>
      </div>
      {isUserMenuOpen && (
        <div
          ref={menuRef}
          className='absolute bottom-0 right-[-250px] w-[250px] rounded-3xl bg-[#2e2e2e] text-white shadow-lg flex flex-col p-4 z-50'
        >
          <div className='flex items-center space-x-2 mb-4'>
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt='avatar'
                className='rounded-full w-10 h-10'
              />
            ) : (
              <UserCircle size={40} />
            )}
            <div>
              <p className='text-lg font-semibold'>{user?.display_name}</p>
            </div>
          </div>
          <div className='border-t border-gray-600 my-2'></div>
          {USER_MENU_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuItemClick(item)}
              className='flex items-center space-x-3 p-2 hover:bg-[#3a3b41] rounded-md'
            >
              <span className='text-xl'>{item.icon}</span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      )}

      {isNotificationOpen && (
        <div
          ref={menuRef}
          className='absolute bottom-29 right-[-400%] w-fit rounded-3xl bg-[#2e2e2e] text-white shadow-lg flex flex-col p-4 z-50 overflow-y-auto
          max-h-[581px]'
        >
          <div className='flex items-center space-x-2 mb-4'>
            <Bell size={32} />
            <div>
              <p className='text-lg font-semibold'>Notification</p>
            </div>
          </div>
          <div className='border-t border-gray-600 my-2'></div>
          {friendRequests.length > 0 ? (
            friendRequests.map((friendRequest) => (
              <FriendRequest
                key={friendRequest.id}
                friendRequest={friendRequest}
                friendRequests={friendRequests}
                setFriendRequests={setFriendRequests}
                setHasNotifications={setHasNotifications}
              />
            ))
          ) : (
            <div>No notification</div>
          )}
        </div>
      )}

      {/* Nút SignOut
      <div className="space-y-2 mt-3">
        <button
          onClick={() => navigate("/")}
          className="w-full flex flex-row items-center justify-center border rounded-md border-stroke p-2 dark:border-strokedark hover:cursor-pointer"
        >
          <SignOut size={24} />
        </button>
      </div> */}
    </div>
  );
}

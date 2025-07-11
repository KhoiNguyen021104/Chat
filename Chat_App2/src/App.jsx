import { Navigate, Outlet, Route, Routes } from "react-router";
import Messages from "./pages/Messages";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Verify from "./pages/auth/Verify";
import { useEffect, useMemo, useState } from "react";
import Profile from "./pages/Profile";
import Layout from "./layout";
import Requests from "./pages/Requests";
import Team from "./pages/team";
import { getAllConversationsByUserId } from "./apis/apis";
import { socket } from "./socket/socket";
import { userSelector } from "./redux/slices/userSlice";
import { useSelector } from "./redux/store";
function App() {
  useEffect(() => {
    const colorMode = JSON.parse(window.localStorage.getItem("color-theme"));

    const className = "dark";
    const bodyClass = window.document.body.classList;
    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, []);

  const user = useSelector(userSelector);
  const isAuthenticated = useMemo(() => !!user, [user]);
  const [conversationIds, setConversationIds] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (user?.id) {
        const res =
          (await getAllConversationsByUserId(user?.id)).conversations || [];
        if (res.length > 0) {
          const ids = res.map((conversation) => conversation?.id);
          setConversationIds(ids);
        }
      }
    };

    fetchConversations();
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated) {
      if (!socket.connected) {
        socket.connect();
      }
      const userId = user?.id;

      if (userId) {
        socket.on("connect", () => {
          console.log("Connected from server");
          socket.emit("registerUser", userId);
          socket.emit("sendSignalOnline", userId);
          if (conversationIds.length > 0) {
            for (const conversationId of conversationIds) {
              console.log(`Joining conversation room: ${conversationId}`);
              socket.emit("joinConversation", {
                userId: user?.id,
                conversationId,
              });
            }
          }
        });
      }

      return () => {
        socket.disconnect();
        console.log("Disconnected from server");
      };
    }
  }, [isAuthenticated, user?.id, conversationIds]);

  const ProtectedRoute = () => {
    return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
  };

  const UnauthorizedRoute = () => {
    return isAuthenticated ? <Navigate to='/chat' replace /> : <Outlet />;
  };

  return (
    <Routes>
      <Route
        path='/'
        element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />}
      />
      <Route element={<UnauthorizedRoute />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/verify' element={<Verify />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path='chat' element={<Layout />}>
          <Route index element={<Messages />} />
          <Route path='requests' element={<Requests />} />
          <Route path='teams' element={<Team />} />
          <Route path='profile' element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

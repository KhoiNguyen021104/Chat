import { io } from "socket.io-client";
import { API_ROOT } from "../config/constants";

export const socket = io(API_ROOT, {
  autoConnect: false,
  withCredentials: true
});

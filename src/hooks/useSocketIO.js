import { useEffect } from "react";
import io from "socket.io-client";

const storedSocketId = localStorage.getItem("socketId");
let socket;

export const useSocketIO = () => {
  function joinNewUser(userId) {
    socket.emit("new-user", userId);
  }

  useEffect(() => {
    if (storedSocketId) {
      socket = io.connect(process.env.REACT_APP_BACKEND_API_URL, {
        query: { socketId: storedSocketId },
      });
    } else socket = io.connect(process.env.REACT_APP_BACKEND_API_URL);

    socket.on("connect", () => {
      if (!storedSocketId) localStorage.setItem("socketId", socket.id);
    });
  }, [])


  return { socket, joinNewUser };
}

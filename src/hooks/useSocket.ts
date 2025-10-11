import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL //eplace with actual backend URL

export const useSocket = (namespace = "") => {
  const {token} = useSelector((state:any) => state.login); // Get token from Redux store
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return; // Prevent connection if no token

    // Pass token as query param in connection
    const socketInstance = io(`${SOCKET_SERVER_URL}/${namespace}`, {
      query: { token },
      transports: ["websocket"], // Ensure real-time performance
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.io Server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from Socket.io Server");
      setIsConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [namespace, token]);

  /**
   * Emit an event to the server
   */
  const emitEvent = useCallback((eventName, data) => {
    if (socket) {
      socket.emit(eventName, data);
    }
  }, [socket]);

  /**
   * Listen for an event from the server
   */
  const listenEvent = useCallback((eventName, callback) => {
    if (socket) {
      socket.on(eventName, callback);
      return () => socket.off(eventName, callback);
    }
  }, [socket]);

  return { socket, isConnected, emitEvent, listenEvent };
};

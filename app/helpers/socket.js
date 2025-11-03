import { io } from "socket.io-client";

let socket;

export const initializeSocket = () => {
    if (!socket) {
     
      socket = io(process.env.socket_url); 
    } else {
    }
    return socket;
  };
  
export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket() first.");
  }
  return socket;
};
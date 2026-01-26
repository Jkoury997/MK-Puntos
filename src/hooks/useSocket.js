// useSocket.js
import { io } from "socket.io-client";

let socket;

export const initializeSocket = (userId, toast, userInteracted) => {
  if (!socket) {
    console.log("Initializing WebSocket connection...");
    socket = io(process.env.NEXT_PUBLIC_URL_WEBSOCKET);

    socket.on("connect", () => {
      console.log("WebSocket connected");
      socket.emit("join", userId);
    });

    socket.on("notification", (data) => {
      console.log("Notification received:", data);

      if (userInteracted && "vibrate" in navigator) {
        navigator.vibrate(200); // Solo vibrará si `userInteracted` es `true`
      }

      if (data.type === "success") {
        toast({
        variant:"success",
          title: "Exito!",
          description: data.message,
        });
      } else if (data.type === "error") {
        toast({
          variant: "destructive",
          title: "Uh! Algo salió mal ...",
          description: data.message,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });
  } else {
    console.log("Socket already initialized.");
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnecting WebSocket...");
    // Limpiar todos los event listeners para evitar memory leaks
    socket.off("notification");
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.disconnect();
    socket = null;
  }
};

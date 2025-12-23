// hooks/useNotificationSocket.js
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Utility to check if token is expired
function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true; // treat as expired if can't decode
  }
}

// Get a valid access token (refresh if needed)
async function getValidToken() {
  let token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const res = await axios.post(
      "http://localhost:8080/api/user/refresh",
      refreshToken,
      { headers: { "Content-Type": "application/json" } }
    );

    token = res.data.accessToken;
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", res.data.refreshToken);
  }
  return token;
}

export function useNotificationSocket() {
  const stompClientRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const connectSocket = async () => {
      try {
        const token = await getValidToken();
        if (!isMounted) return; // prevent connecting after unmount

        const stompClient = new Client({
          webSocketFactory: () =>
            new SockJS(`http://localhost:8080/ws-notify?token=${token}`),
          reconnectDelay: 5000,
          debug: (str) => console.log(str),
        });

        stompClient.onConnect = (frame) => {
          console.log("Connected to WebSocket:", frame);

          stompClient.subscribe(`/user/queue/toast`, (message) => {
            console.log("Received toast message:", message.body);
            try {
              const notification = JSON.parse(message.body);
              console.log("Parsed notification:", notification);

              toast.info(notification.body, {
                autoClose: 4000,
                position: "top-right",
              });
            } catch (error) {
              console.error("Error parsing notification:", error);
            }
          });
        };

        stompClient.onStompError = (frame) => {
          console.error("STOMP Error:", frame.headers["message"]);
        };

        stompClient.onWebSocketError = (error) => {
          console.error("WebSocket Error:", error);
        };

        stompClient.activate();
        stompClientRef.current = stompClient;
      } catch (err) {
        console.error("Failed to connect WebSocket:", err);
      }
    };

    connectSocket();

    return () => {
      isMounted = false;
      if (stompClientRef.current?.active) {
        console.log("🔌 Disconnecting WebSocket...");
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  return stompClientRef.current;
}

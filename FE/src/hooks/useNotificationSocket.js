// hooks/useNotificationSocket.js
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_SOCKET_URL; 

function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

async function getValidToken() {
  let token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const res = await axios.post(
      `${BASE_URL}/api/user/refresh`,
      { refreshToken }, // ✅ must be object
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
        if (!isMounted) return;

        const stompClient = new Client({
          webSocketFactory: () =>
            new SockJS(`${BASE_URL}/ws-notify?token=${token}`), // ✅ FIXED
          reconnectDelay: 5000,
          debug: () => {}, // silence logs in prod
        });

        stompClient.onConnect = () => {
          console.log("✅ WebSocket connected");

          stompClient.subscribe(`/user/queue/toast`, (message) => {
            try {
              const notification = JSON.parse(message.body);

              toast.info(notification.body, {
                autoClose: 4000,
                position: "top-right",
              });
            } catch (error) {
              console.error("Notification parse error:", error);
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
        console.error("WebSocket connection failed:", err);
      }
    };

    connectSocket();

    return () => {
      isMounted = false;
      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  return stompClientRef.current;
}

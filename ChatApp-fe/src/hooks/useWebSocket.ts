import { useEffect, useRef, useCallback, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useWebSocket(token: string | null) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const subscriptionsRef = useRef<Map<string, any>>(new Map());

  const connect = useCallback(() => {
    if (clientRef.current?.connected) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws") as any,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;
  }, [token]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setConnected(false);
    }
  }, []);

  const subscribe = useCallback(
    (destination: string, callback: (message: IMessage) => void) => {
      if (!clientRef.current?.connected) return;

      // Unsubscribe if already subscribed
      const existing = subscriptionsRef.current.get(destination);
      if (existing) {
        existing.unsubscribe();
        subscriptionsRef.current.delete(destination);
      }

      const sub = clientRef.current.subscribe(destination, callback);
      subscriptionsRef.current.set(destination, sub);
    },
    []
  );

  const unsubscribe = useCallback((destination: string) => {
    const sub = subscriptionsRef.current.get(destination);
    if (sub) {
      sub.unsubscribe();
      subscriptionsRef.current.delete(destination);
    }
  }, []);

  const sendMessage = useCallback(
    (destination: string, body: object) => {
      if (!clientRef.current?.connected) return;
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    },
    []
  );

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, subscribe, unsubscribe, sendMessage, connected };
}

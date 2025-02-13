import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { websocketAtom } from "../store/websocketAtom";

const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

export const useWebSocket = () => {
    const [webSocket, setWebSocket] = useRecoilState(websocketAtom);

    useEffect(() => {
        if(webSocket?.readyState === WebSocket.OPEN) {
            console.log("Web socket is already connected");
            return;
        }

        const ws = new WebSocket(websocketUrl);

        ws.onopen = () => {
            console.log("Connected to WebSocket");
            setWebSocket(ws);
        }

        ws.onclose = () => {
            console.log("Disconnected to WebSocket");
            setWebSocket(null);
        }

    }, [webSocket, setWebSocket]);

    const isConnected = webSocket?.readyState === WebSocket.OPEN;
    return isConnected;
}
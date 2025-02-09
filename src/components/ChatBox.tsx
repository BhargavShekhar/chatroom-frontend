import { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../store/userAtom';

const WebSocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

interface Message {
    text: string;
    type: "sent" | "received";
    sender: string;
}


export const ChatBox = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const username = useRecoilValue(userAtom);

    console.log(WebSocketUrl)

    useEffect(() => {
        const ws = new WebSocket(WebSocketUrl);

        setSocket(ws);

        ws.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                setMessages((prevMessages) => [...prevMessages, { text: data.message, type: 'received', sender: data.sender }]);
            } catch (error) {
                console.error("Error parsing message:", e.data);
            }
        }

        return () => {
            ws.close();
        }
    }, [])

    useEffect(() => {
        chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    const sendMessage = () => {
        if (socket && inputRef.current) {
            const message = inputRef.current.value;
            socket.send(JSON.stringify({ sender: username, message }));
            setMessages((prevMessages) => [...prevMessages, { text: message, type: "sent", sender: "You" }]);
            inputRef.current.value = "";
        }
    }

    return (
        <div>
            <div className='flex flex-col items-center p-4 bg-white rounded-2xl gap-4 min-w-[47vw] shadow-2xl shadow-black'>
                <h2 className="text-xl font-bold text-gray-700">You are visible as {username}</h2>
                <input
                    className='text-black border p-2 rounded-md'
                    type="text"
                    placeholder='Message'
                    ref={inputRef}
                />
                <button
                    className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                    onClick={sendMessage}
                >
                    Submit
                </button>
                <div className='w-full bg-gray-100 p-2 rounded-lg overflow-y-auto max-h-60 flex flex-col gap-2 custom-scrollbar'>
                    {
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`
                                p-2 rounded-lg max-w-[75%] shadow-2xl
                                ${msg.type === 'sent' ? "bg-blue-400 text-white self-start" : "bg-blue-400 text-black self-end"}
                            `}
                                ref={chatContainerRef}
                            >
                                <strong className='font-medium'>
                                    {msg.sender}: &nbsp;
                                </strong>
                                {msg.text}
                            </div>
                        ))
                    }
                </div>
            </div >
        </div>
    )
}
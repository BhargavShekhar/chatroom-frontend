import { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../store/userAtom';
import { useNavigate } from 'react-router-dom';
import { websocketAtom } from '../store/websocketAtom';

interface Message {
    text: string;
    type: "sent" | "received";
    sender: string;
}

export const ChatBox = () => {
    const ws = useRecoilValue(websocketAtom);
    const inputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userCount, setUserCount] = useState(0);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const username = useRecoilValue(userAtom);
    const nav = useNavigate();

    useEffect(() => {
        // Redirect on reload
        if (!username || !ws) {
            console.log("No username or websocket found redirecting to start page")
            nav("/start", { replace: true });
            return;
        }

        ws.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                console.log(data);
                // Reciving here in case some user disconnects
                if ("userCount" in data) {
                    setUserCount(data.userCount);
                }
                else {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: data.message, type: 'received', sender: data.sender }
                    ]);
                }
            } catch (error) {
                console.error("Error parsing message:", e.data);
            }
        }

        return () => {
            ws.onmessage = null;
        }
    }, [])

    useEffect(() => {
        chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    const sendMessage = () => {
        if (ws && inputRef.current) {
            const message = inputRef.current.value;
            ws.send(JSON.stringify({ sender: username, message }));
            setMessages((prevMessages) => [...prevMessages, { text: message, type: "sent", sender: "You" }]);
            inputRef.current.value = "";
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") sendMessage();
    }

    return (
        <div>
            <div className='flex flex-col items-center p-4 bg-white rounded-2xl gap-3 min-w-[47vw] shadow-2xl shadow-black'>
                <h2 className="text-xl font-bold text-gray-700">You are visible as {username}</h2>
                <h3 className='text-md text-gray-500'>Number of User Online: <strong className='text-red-500'>{userCount}</strong></h3>
                <input
                    className='text-black border p-2 rounded-md'
                    type="text"
                    placeholder='Message'
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                    onClick={sendMessage}
                >
                    Send Message
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
                                <strong className='font-medium opacity-55'>
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
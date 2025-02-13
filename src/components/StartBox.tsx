import { useSetRecoilState } from "recoil"
import { userAtom } from "../store/userAtom"
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";

export const StartBox = () => {
    const nav = useNavigate();

    const inputRef = useRef<HTMLInputElement>(null);
    const setUsername = useSetRecoilState(userAtom);
    const isConnected = useWebSocket();

    const handleSubmit = () => {
        if (!inputRef.current || !isConnected) return;
        const username = inputRef.current.value;
        if (!username) return alert("Username can not be empty");
        setUsername(username);
        nav("/chat");
    }

    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-xl gap-4 w-72 shadow-2xl shadow-black">
            {
                !isConnected &&
                <h1 className="text-cyan-950 shadow-lg drop-shadow-2xl font-stretch-50% font-serif rounded-4xl p-2">
                    Connecting to <span className="text-red-600 font-bold">Server</span>... <br /> Please wait!
                </h1>
            }
            <input
                type="text"
                placeholder="Enter a username"
                ref={inputRef}
                className="border rounded-md p-2 w-full text-black"
            />
            <button
                onClick={handleSubmit}
                disabled={!isConnected}
                className={`w-full py-2 px-4 rounded-md text-white font-semibold ${!isConnected ? "bg-gray-400 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"
                    }`}
            >
                {isConnected ? "Start Chat" : "Connecting..."}
            </button>
        </div>
    )
}
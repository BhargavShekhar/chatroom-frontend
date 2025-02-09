import { useSetRecoilState } from "recoil"
import { userAtom } from "../store/userAtom"
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const StartBox = () => {
    const nav = useNavigate();

    const inputRef = useRef<HTMLInputElement>(null);
    const setUsername = useSetRecoilState(userAtom);

    const handleSubmit = () => {
        if (!inputRef.current) return;
        const username = inputRef.current.value;
        setUsername(username);
        nav("/chat");
    }

    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-xl gap-4 w-72 shadow-2xl shadow-black">
            <input
                type="text"
                placeholder="Enter a username"
                ref={inputRef}
                className="border rounded-md p-2 w-full text-black"
            />
            <button onClick={handleSubmit}>
                Submit
            </button>
        </div>
    )
}
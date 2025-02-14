import { atom } from "recoil";

const storedUsername = sessionStorage.getItem("username");

export const userAtom = atom<string | null>({
    default: storedUsername ? storedUsername : null,
    key: "userAtom"
})
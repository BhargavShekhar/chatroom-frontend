import { atom } from "recoil";

export const userAtom = atom({
    default: "Guest",
    key: "userAtom"
})
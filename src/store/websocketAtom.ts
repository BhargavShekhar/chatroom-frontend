import { atom } from "recoil";

export const websocketAtom = atom<WebSocket | null>({
    default: null,
    key: "websocketAtom"
})
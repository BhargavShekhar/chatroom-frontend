import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChatBox } from './components/ChatBox.tsx'
import { StartBox } from './components/StartBox.tsx'
import { RecoilRoot } from 'recoil'

createRoot(document.getElementById('root')!).render(
    <RecoilRoot>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/chat" element={<ChatBox />} />
                <Route path="/start" element={<StartBox />} />
            </Routes>
        </BrowserRouter>
    </RecoilRoot>
)

import { useNavigate } from 'react-router-dom';
import './App.css'
import { useEffect } from 'react';

function App() {
  const nav = useNavigate();

  useEffect(() => {
    nav("/start")
  }, [])

  return (
    <></>
  )
}

export default App;
import Chats from "../Chats/Chats";
import LoginSingUp from "../LoginSingUp/LoginSingUp";
import "./app.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route exact path="/" element={<LoginSingUp />} />
        <Route path="/chat" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;

import Chats from "../Chats/Chats";
import Login from "../Login/Login";
import "./app.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/chat" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;

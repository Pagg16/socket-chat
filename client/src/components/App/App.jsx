import { useState } from "react";
import Chats from "../Chats/Chats";
import LoginSingUp from "../LoginSingUp/LoginSingUp";
import Popup from "../Popup/Popup";
import "./app.css";
import { Route, Routes } from "react-router-dom";
import { isVisible } from "@testing-library/user-event/dist/utils";
import Loader from "../Loader/Loader";

function App() {
  const [popup, setPopup] = useState({
    text: "",
    isVisible: false,
  });
    // localStorage.clear();
  return (
    <div className="app">
      <Routes>
        <Route exact path="/" element={<LoginSingUp setPopup={setPopup} />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
      <Popup popup={popup} setPopup={setPopup} />
      {/* <Loader /> */}
    </div>
  );
}

export default App;

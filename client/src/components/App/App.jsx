import Chats from "../Chats/Chats";
import HomePage from "../HomePage/HomePage";
import "./app.css";
import { Route } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Route exact path="/" element={<HomePage />} />
      <Route path="/chat" element={<Chats />} />
    </div>
  );
}

export default App;

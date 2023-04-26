import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./context/userProvider";
import ChatProvider from "./context/chatProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChatProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ChatProvider>
  </BrowserRouter>
);

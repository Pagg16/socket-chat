import React, { useEffect } from "react";
import "./popup.css";

function Popup({ popup, setPopup }) {
  useEffect(() => {
    if (popup.isVisible) {
      const timer = setTimeout(() => {
        setPopup((state) => ({ ...state, isVisible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [popup.isVisible]);

  return (
    <div className={`popup ${popup.isVisible && "popup_visible"}`}>
      <p className="popup__text">{popup.text}</p>
      <button
        className="popup__close"
        onClick={() => setPopup((state) => ({ ...state, isVisible: false }))}
      >
        Х
      </button>
    </div>
  );
}

export default Popup;

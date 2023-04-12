import React from "react";
import "./profile.css";

function Profile({ name, email, image, isProfileOpen, setIsProfileOpen }) {
  return (
    <div className="profile">
      <div className="profile_info">
        <button className="profile__close">X</button>
        <p>name</p>
        <img src={image} alt="user-avatar" className="sidePanel__user-avatar" />
        <p>gmail</p>
      </div>
    </div>
  );
}

export default Profile;

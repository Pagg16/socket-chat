import React, { useEffect, useMemo, useRef, useState } from "react";
import "./profile.css";
import editIcon from "../../images/edit.png";
import InputImage from "../InputImage/InputImage";
import { unpateUserDate, updateUserAvatar } from "../../api/api";
import { resSetUser } from "../../utils/resSetUser";
import { useNavigate } from "react-router-dom";
import { UserState } from "../../context/userProvider";
import ButtonLoader from "../ButtonLoader/ButtonLoader";
import defaultUser from "../../images/user.png";
import { createImageBuffer } from "../../utils/createImadeBuffer";

function Profile({ user, user: { email, name }, setIsProfileOpen, setPopup }) {
  const navigate = useNavigate();
  const { setUser } = UserState();

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [inputName, setInputName] = useState(name);
  const [inputEmail, setInputEmail] = useState(email);

  const [isLoaderButton, setIsLoaderButto] = useState(false);

  const pictureInput = useRef(null);
  const [inputImage, setInputImage] = useState({
    pictureFile: "",
    pictureLinkFile: "",
  });

  const userAvatar = useMemo(() => {
    return !!user.image?.data
      ? createImageBuffer(user.image.data.data, user.image.contentType)
      : defaultUser;
  }, [user]);

  useEffect(() => {
    if (!!inputImage.pictureFile) {
      setIsLoaderButto(true);
      updateUserAvatar(inputImage.pictureFile)
        .then((res) => {
          resSetUser(res, navigate, setUser);
        })
        .catch((e) => {
          setPopup((state) => ({
            ...state,
            text: e.message,
            isVisible: true,
          }));
          console.log(e);
        })
        .finally(() => {
          setIsLoaderButto(false);
          setInputImage((state) => ({ ...state, pictureFile: "" }));
        });
    }
  }, [inputImage.pictureFile]);

  function closeProfile() {
    sendUserUpdate();
    setIsProfileOpen(false);
  }

  function sendUserUpdate() {
    if (inputName !== name || inputEmail !== email) {
      setIsLoaderButto(true);
      unpateUserDate(inputName, inputEmail)
        .then((res) => {
          resSetUser(res, navigate, setUser);
        })
        .catch((e) => {
          setPopup((state) => ({
            ...state,
            text: e.message,
            isVisible: true,
          }));
          console.log(e);
        })
        .finally(() => {
          setIsLoaderButto(false);
        });
    }
  }

  return (
    <div className="profile" onClick={closeProfile}>
      <div className="profile_info" onClick={(e) => e.stopPropagation()}>
        <button className="profile__close" onClick={closeProfile}>
          X
        </button>
        <div
          className="profile__edit-info"
          onClick={() =>
            !isLoaderButton &&
            setEditName((state) => {
              state && sendUserUpdate();
              return !state;
            })
          }
        >
          {!editName && <p className="profile__info"> {name}</p>}
          {editName && (
            <input
              onClick={(e) => e.stopPropagation()}
              type="text"
              placeholder="name"
              className="profile__info-input"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
          )}
          {isLoaderButton ? (
            <ButtonLoader addClass={"profile__loader"} />
          ) : (
            <img
              src={editIcon}
              alt="edit-icon"
              className="profile__edit-info-icon"
            />
          )}
        </div>
        <div
          className="profile__avatar-container"
          onClick={() => {
            pictureInput.current.click();
          }}
        >
          <div className="profile__edit-container">
            <img
              src={editIcon}
              alt="edit-icon"
              className="profile__edit-icon"
            />
          </div>
          {isLoaderButton ? (
            <ButtonLoader addClass={"profile__loader-avatar"} />
          ) : (
            <img
              src={userAvatar}
              alt="user-avatar"
              className="profile__user-avatar"
            />
          )}

          <div className="profile__input-image">
            <InputImage
              pictureInput={pictureInput}
              setPopup={setPopup}
              setInputImage={setInputImage}
            />
          </div>
        </div>
        <div
          className="profile__edit-info"
          onClick={() =>
            !isLoaderButton &&
            setEditEmail((state) => {
              state && sendUserUpdate();
              return !state;
            })
          }
        >
          {!editEmail && <p className="profile__info"> {email}</p>}
          {editEmail && (
            <input
              onClick={(e) => e.stopPropagation()}
              type="text"
              placeholder="name"
              className="profile__info-input"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
            />
          )}
          {isLoaderButton ? (
            <ButtonLoader addClass={"profile__loader"} />
          ) : (
            <img
              src={editIcon}
              alt="edit-icon"
              className="profile__edit-info-icon"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

import React, { useContext, useEffect, useRef, useState } from "react";
import "./loginSingUp.css";
import { auth, singUp } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { sendUserData } from "./sendUserDate";
import { validationInput } from "./validationInput";

function LoginSingUp({ setPopup }) {
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registrationType, setRegistrationType] = useState(false);
  const [isLoaderButton, setIsLoaderButto] = useState(false);
  const [disabledButton, setDisabledButton] = useState(true);

  const [userData, setUserData] = useState({
    name: {
      value: "",
      error: "",
    },
    email: {
      value: "",
      error: "",
    },
    password: {
      value: "",
      error: "",
    },
    confirmPassword: {
      value: "",
      error: "",
    },
    pictureFile: "",
    pictureLinkFile: "",
  });

  const pictureVisibleContainer = useRef(null);
  const pictureInput = useRef(null);

  useEffect(() => {
    if (!!userData.pictureLinkFile && registrationType) {
      pictureVisibleContainer.current.style.backgroundImage = `url(${userData.pictureLinkFile})`;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(userData.pictureFile);
      pictureInput.current.files = dataTransfer.files;
    }
  }, [userData.pictureLinkFile, registrationType]);

  useEffect(() => {
    const errors = !registrationType
      ? !!userData.email.error || !!userData.password.error
      : !!userData.name.error ||
        !!userData.email.error ||
        !!userData.password.error ||
        !!userData.confirmPassword.error;

    const textError = !registrationType
      ? !!!userData.email.value || !!!userData.password.value
      : !!!userData.name.value ||
        !!!userData.email.value ||
        !!!userData.password.value ||
        !!!userData.confirmPassword.value;

    if (errors || textError) {
      return setDisabledButton(true);
    } else {
      return setDisabledButton(false);
    }
  }, [userData, registrationType]);

  function isImage(file) {
    const type = file.type.split("/", 1)[0];
    if (type === "image") {
      return true;
    }

    setPopup((state) => ({
      ...state,
      text: "file must be an image",
      isVisible: true,
    }));

    return false;
  }

  return (
    <div className="login">
      <div className="login__title-container">
        <p className="login__title">GaySSenger</p>
      </div>
      <div className="login__conrainer">
        <div className="login__types-btns">
          <button
            className={`login__types-btn ${
              !registrationType && "login__types-btn_active"
            }`}
            onClick={() => setRegistrationType(false)}
          >
            Login
          </button>
          <button
            className={`login__types-btn ${
              registrationType && "login__types-btn_active"
            }`}
            onClick={() => setRegistrationType(true)}
          >
            Sing Up
          </button>
        </div>
        <div className="lable__inpun-container">
          {registrationType && (
            <>
              <label className="login__label" htmlFor="Name">
                Name
              </label>
              <input
                required
                className={`login__input ${
                  !!userData.name.error && "login__input_error"
                }`}
                id="name"
                name="name"
                placeholder="Enter Your Name"
                type="name"
                value={userData.name.value}
                onChange={(e) => validationInput(e, setUserData)}
              />
            </>
          )}
          <label className="login__label" htmlFor="Email">
            Email
          </label>
          <input
            min={2}
            required
            className={`login__input ${
              !!userData.email.error && "login__input_error"
            }`}
            id="email"
            name="email"
            placeholder="Enter Email"
            type="text"
            value={userData.email.value}
            onChange={(e) => validationInput(e, setUserData)}
          />

          <label className="login__label" htmlFor="Password">
            Password
          </label>
          <div className="login__input-password">
            <input
              min={2}
              required
              className={`login__input ${
                !!userData.password.error && "login__input_error"
              }`}
              id="password"
              name="password"
              placeholder="password"
              type={`${passwordVisible ? "text" : "password"}`}
              value={userData.password.value}
              onChange={(e) => validationInput(e, setUserData)}
            />
            <button
              className="logit__show-password"
              onClick={() =>
                setPasswordVisible((state) => {
                  if (state) {
                    return false;
                  }
                  return true;
                })
              }
            >
              {`${passwordVisible ? "hide" : "show"}`}
            </button>
          </div>

          {registrationType && (
            <>
              <label className="login__label" htmlFor="Confirm Password">
                Confirm Password
              </label>
              <div className="login__input-password">
                <input
                  min={2}
                  required
                  className={`login__input ${
                    !!userData.confirmPassword.error && "login__input_error"
                  }`}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type={`${passwordVisible ? "text" : "password"}`}
                  value={userData.confirmPassword.value}
                  onChange={(e) => validationInput(e, setUserData)}
                />
                <button
                  className="logit__show-password"
                  onClick={() =>
                    setPasswordVisible((state) => {
                      if (state) {
                        return false;
                      }
                      return true;
                    })
                  }
                >
                  {`${passwordVisible ? "hide" : "show"}`}
                </button>
              </div>
              <label className="login__label" htmlFor="Confirm Password">
                Upload your picture
              </label>
              <div className="login__picture-input">
                <input
                  ref={pictureInput}
                  className="login__input"
                  id="picture"
                  name="picture"
                  placeholder="picture"
                  type="file"
                  onChange={(e) => {
                    if (isImage(e.target.files[0])) {
                      setUserData((state) => ({
                        ...state,
                        pictureFile: e.target.files[0],
                        pictureLinkFile: URL.createObjectURL(e.target.files[0]),
                      }));
                    } else {
                      const defaultText = new File(
                        ["Файл не выбран"],
                        "Файл не выбран"
                      );
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(defaultText);
                      pictureInput.current.files = dataTransfer.files;
                    }
                  }}
                />

                {!!userData.pictureFile && (
                  <div
                    className="ligin__picture-container"
                    ref={pictureVisibleContainer}
                  ></div>
                )}
              </div>
            </>
          )}
          <button
            className={`login__login-bts ${
              disabledButton && "login__login-bts_disabled"
            }`}
            disabled={isLoaderButton || disabledButton}
            onClick={() =>
              sendUserData(
                registrationType,
                userData,
                setPopup,
                setIsLoaderButto,
                singUp,
                navigate,
                auth
              )
            }
          >
            {isLoaderButton ? (
              <span className="login__loader"></span>
            ) : (
              `${registrationType ? "Sing Up" : "Login"}`
            )}
          </button>
        </div>
        <span className="login__error">
          {(!registrationType
            ? userData.email.error || userData.password.error
            : Object.values(userData).find((input) => !!input.error)?.error) ||
            (disabledButton && "Все поля должны быть заполнены")}
        </span>
      </div>
    </div>
  );
}

export default LoginSingUp;

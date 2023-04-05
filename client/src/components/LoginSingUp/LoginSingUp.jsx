import React, { useEffect, useRef, useState } from "react";
import "./loginSingUp.css";

function LoginSingUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registrationType, setRegistrationType] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pictureLink: "",
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

  function sendUserData() {
    if (registrationType) {
      const { name, email, password, confirmPassword, pictureLink } = userData;
    } else {
      const { email, password } = userData;
    }
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
                className="login__input"
                id="name"
                name="name"
                placeholder="Enter Your Name"
                type="name"
              />
            </>
          )}
          <label className="login__label" htmlFor="Email">
            Email
          </label>
          <input
            required
            className="login__input"
            id="email"
            name="email"
            placeholder="Enter Email"
            type="text"
          />

          <label className="login__label" htmlFor="Password">
            Password
          </label>
          <div className="login__input-password">
            <input
              required
              className="login__input"
              id="password"
              name="password"
              placeholder="password"
              type={`${passwordVisible ? "text" : "password"}`}
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
                  required
                  className="login__input"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type={`${passwordVisible ? "text" : "password"}`}
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
                  onChange={(e) =>
                    setUserData((state) => ({
                      ...state,
                      pictureLink: e.target.value,
                      pictureFile: e.target.files[0],
                      pictureLinkFile: URL.createObjectURL(e.target.files[0]),
                    }))
                  }
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
          <button className="login__login-bts" onClick={sendUserData}>{`${
            registrationType ? "Sing Up" : "Login"
          }`}</button>
        </div>
      </div>
    </div>
  );
}

export default LoginSingUp;

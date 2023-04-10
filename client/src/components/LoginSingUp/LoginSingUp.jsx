import React, { useEffect, useRef, useState } from "react";
import "./loginSingUp.css";
import { auth, singUp } from "../../api/api";
import { useNavigate } from "react-router-dom";

function LoginSingUp({ setPopup }) {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      // navigate("/chats");
    }
  }, [navigate]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registrationType, setRegistrationType] = useState(false);
  const [isLoaderButton, setIsLoaderButto] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

      if (!name || !email || !password || !confirmPassword) {
        setPopup((state) => ({
          ...state,
          text: "left empty field",
          isVisible: true,
        }));
        return;
      }

      if (password !== confirmPassword) {
        setPopup((state) => ({
          ...state,
          text: "password mismatch",
          isVisible: true,
        }));
        return;
      }

      setIsLoaderButto(true);
      singUp(name, email, password, pictureLink)
        .then((res) => {
          // localStorage.setItem("userInfo", res);
          console.log(res);
          // navigate("/chats");
        })

        .catch((e) => {
          setPopup((state) => ({
            ...state,
            text: e.message,
            isVisible: true,
          }));
        })
        .finally(() => {
          setIsLoaderButto(false);
        });
    } else {
      const { email, password } = userData;

      if (!email || !password) {
        setPopup((state) => ({
          ...state,
          text: "left empty field",
          isVisible: true,
        }));
        return;
      }

      setIsLoaderButto(true);
      auth(email, password)
        .then((res) => {
          // navigate("/chats");
          console.log(res);
        })
        .catch((e) => {
          setPopup((state) => ({
            ...state,
            text: e.message,
            isVisible: true,
          }));
        })
        .finally(() => {
          setIsLoaderButto(false);
        });
    }
  }

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
                min={2}
                max={30}
                required
                className="login__input"
                id="name"
                name="name"
                placeholder="Enter Your Name"
                type="name"
                value={userData.name}
                onChange={(e) =>
                  setUserData((state) => ({
                    ...state,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </>
          )}
          <label className="login__label" htmlFor="Email">
            Email
          </label>
          <input
            min={2}
            required
            className="login__input"
            id="email"
            name="email"
            placeholder="Enter Email"
            type="text"
            value={userData.email}
            onChange={(e) =>
              setUserData((state) => ({
                ...state,
                [e.target.name]: e.target.value,
              }))
            }
          />

          <label className="login__label" htmlFor="Password">
            Password
          </label>
          <div className="login__input-password">
            <input
              min={2}
              required
              className="login__input"
              id="password"
              name="password"
              placeholder="password"
              type={`${passwordVisible ? "text" : "password"}`}
              value={userData.password}
              onChange={(e) =>
                setUserData((state) => ({
                  ...state,
                  [e.target.name]: e.target.value,
                }))
              }
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
                  className="login__input"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type={`${passwordVisible ? "text" : "password"}`}
                  value={userData.confirmPassword}
                  onChange={(e) =>
                    setUserData((state) => ({
                      ...state,
                      [e.target.name]: e.target.value,
                    }))
                  }
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
            className="login__login-bts"
            disabled={isLoaderButton}
            onClick={sendUserData}
          >
            {isLoaderButton ? (
              <span className="login__loader"></span>
            ) : (
              `${registrationType ? "Sing Up" : "Login"}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginSingUp;

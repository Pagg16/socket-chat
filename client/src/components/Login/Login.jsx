import React, { useState } from "react";
import "./login.css";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registrationType, setRegistrationType] = useState(false);

  return (
    <div className="login">
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
                className="login__input"
                id="Name"
                name="Name"
                placeholder="Enter Your Name"
                type="Name"
              />
            </>
          )}
          <label className="login__label" htmlFor="Email">
            Email
          </label>
          <input
            className="login__input"
            id="Email"
            name="Email"
            placeholder="Enter Email"
            type="text"
          />

          <label className="login__label" htmlFor="Password">
            Password
          </label>
          <div className="login__input-password">
            <input
              className="login__input"
              id="Password"
              name="Password"
              placeholder="Password"
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
                  className="login__input"
                  id="Confirm Password"
                  name="Confirm Password"
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
            </>
          )}
          <button className="login__login-bts">Login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;

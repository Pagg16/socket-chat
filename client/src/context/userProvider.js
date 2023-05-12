import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/api";
import { resSetUser } from "../utils/resSetUser";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      auth()
        .then((res) => {
          resSetUser(res, navigate, setUser);
        })
        .catch((e) => {
          console.log(e, "error");
          localStorage.clear();
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserState = () => useContext(UserContext);

export default UserProvider;

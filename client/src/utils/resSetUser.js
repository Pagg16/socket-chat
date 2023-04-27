import { updateTokenAndCreateAxiosInstance } from "../api/api";

export function resSetUser(res, navigate, setUser) {
  localStorage.setItem("jwt", res.data.token);
  updateTokenAndCreateAxiosInstance();
  setUser(res.data);
  navigate("/chats");
}

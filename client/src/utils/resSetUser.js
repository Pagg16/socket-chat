import { updateTokenAndCreateAxiosInstance } from "../api/api";
import { UserState } from "../context/userProvider";
import { createImageBuffer } from "./createImadeBuffer";

export function resSetUser(res, navigate) {
  const { setUser } = UserState();
  localStorage.setItem("jwt", res.data.token);
  updateTokenAndCreateAxiosInstance();
  setUser(
    (() => ({
      ...res.data,
      image: createImageBuffer(res.data.image.data.data),
    }))()
  );
  navigate("/chats");
}

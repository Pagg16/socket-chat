import { updateTokenAndCreateAxiosInstance } from "../api/api";
import { createImageBuffer } from "./createImadeBuffer";
import defaultUser from "../images/user.png";

export function resSetUser(res, navigate, setUser) {
  localStorage.setItem("jwt", res.data.token);
  updateTokenAndCreateAxiosInstance();

  const image = !!res.data.image.data
    ? createImageBuffer(res.data.image.data.data, res.data.image.contentType)
    : defaultUser;

  setUser({
    ...res.data,
    image: image,
  });
  navigate("/chats");
}

import { createImageBuffer } from "./createImadeBuffer";
import baseImageUser from "../images/user.png";
import chatDefault from "../images/chatDefault.png";

export function chatData(chat, user) {
  let opponent;
  let image;

  if (!chat.isGroupChat) {
    const intermediateValue = chat.users.filter(
      (userData) => userData._id !== user._id
    );

    if (!!intermediateValue[0]) {
      opponent = intermediateValue[0];
    } else {
      opponent = chat.users[0];
    }

    if (!!opponent.image?.data) {
      image = createImageBuffer(opponent.image.data.data);
    } else {
      image = baseImageUser;
    }
  } else {
    image = chatDefault;
  }

  return { image, opponent };
}

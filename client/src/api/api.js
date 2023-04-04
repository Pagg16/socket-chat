import axios from "axios";
const baseUrl = "http://localhost:5000";

export default function getChats() {
  return axios.get(baseUrl + "/chats");
}

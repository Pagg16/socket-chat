import axios from "axios";
const baseUrl = "http://localhost:5000";

export function getChats() {
  return axios.get(baseUrl + "/chats");
}

export function singUp(name, email, password, confirmPassword, pictureLink) {
  return axios.post(baseUrl + "/user", {
    name,
    email,
    password,
    confirmPassword,
    pictureLink,
  });
}

export function auth(email, password) {
  return axios.post(baseUrl + "/login", {
    email,
    password,
  });
}

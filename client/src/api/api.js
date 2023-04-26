import axios from "axios";
const baseUrl = "http://localhost:5000";

const createAxiosInstance = () => {
  const instance = axios.create();
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("jwt");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  });
  return instance;
};

let axiosApi = createAxiosInstance();

export function getChats() {
  return axiosApi.get(baseUrl + "/chats");
}

export function singUp(name, email, password, pictureFile) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("pictureFile", pictureFile);

  return axiosApi.post(baseUrl + "/user/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function auth(email, password) {
  return axiosApi.post(baseUrl + "/user/login", {
    email,
    password,
  });
}

export function allUsers(query) {
  return axiosApi.get(baseUrl + "/user/", {
    params: { query },
  });
}

export function updateUserAvatar(pictureFile) {
  const formData = new FormData();
  formData.append("pictureFile", pictureFile);
  return axiosApi.put(baseUrl + "/user/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function unpateUserDate(name, email) {
  return axiosApi.put(baseUrl + "/user/update", {
    name,
    email,
  });
}

export function accessChat(userId) {
  return axiosApi.post(baseUrl + "/chat/", {
    userId,
  });
}

export function fetchChats() {
  return axiosApi.get(baseUrl + "/chat/");
}

export function createGroupChat(users, name) {
  return axiosApi.post(baseUrl + "/chat/group", {
    users: JSON.stringify(users),
    name: JSON.stringify(name),
  });
}

export function updateTokenAndCreateAxiosInstance() {
  const token = localStorage.getItem("jwt");
  if (token) {
    axiosApi = createAxiosInstance();
  }
}

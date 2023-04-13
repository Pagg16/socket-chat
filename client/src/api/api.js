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

export function updateTokenAndCreateAxiosInstance() {
  const token = localStorage.getItem("jwt");
  if (token) {
    axiosApi = createAxiosInstance();
  }
}

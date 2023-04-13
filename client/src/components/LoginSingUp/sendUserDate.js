import { updateTokenAndCreateAxiosInstance } from "../../api/api";

export function sendUserData(
  registrationType,
  userData,
  setPopup,
  setIsLoaderButto,
  singUp,
  navigate,
  auth,
  setUser
) {
  const name = userData.name.value;
  const email = userData.email.value;
  const password = userData.password.value;
  const confirmPassword = userData.confirmPassword.value;
  const pictureFile = userData.pictureFile;

  if (registrationType) {
    if (!name || !email || !password || !confirmPassword) {
      setPopup((state) => ({
        ...state,
        text: "left empty field",
        isVisible: true,
      }));
      return;
    }

    if (password !== confirmPassword) {
      setPopup((state) => ({
        ...state,
        text: "password mismatch",
        isVisible: true,
      }));
      return;
    }

    setIsLoaderButto(true);
    singUp(name, email, password, pictureFile)
      .then((res) => {
        updateTokenAndCreateAxiosInstance();
        setUser(res.data);
        localStorage.setItem("jwt", res.data.token);
        console.log(res.data);
        navigate("/chats");
      })

      .catch((e) => {
        setPopup((state) => ({
          ...state,
          text: e.message,
          isVisible: true,
        }));
        console.log(e);
      })
      .finally(() => {
        setIsLoaderButto(false);
      });
  } else {
    if (!email || !password) {
      setPopup((state) => ({
        ...state,
        text: "left empty field",
        isVisible: true,
      }));
      return;
    }

    setIsLoaderButto(true);
    auth(email, password)
      .then((res) => {
        updateTokenAndCreateAxiosInstance();
        setUser(res.data);
        localStorage.setItem("jwt", res.data.token);
        navigate("/chats");
      })
      .catch((e) => {
        console.log(e);
        setPopup((state) => ({
          ...state,
          text: e.message,
          isVisible: true,
        }));
      })
      .finally(() => {
        setIsLoaderButto(false);
      });
  }
}

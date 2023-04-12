export function sendUserData(
  registrationType,
  userData,
  setPopup,
  setIsLoaderButto,
  singUp,
  navigate,
  auth
) {
  if (registrationType) {
    const { name, email, password, confirmPassword, pictureLink } = userData;

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
    singUp(name, email, password, pictureLink)
      .then((res) => {
        localStorage.setItem("userInfo", res.data);
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
      })
      .finally(() => {
        setIsLoaderButto(false);
      });
  } else {
    const { email, password } = userData;

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
        localStorage.setItem("userInfo", res.data);
        localStorage.setItem("jwt", res.data.token);
        navigate("/chats");
      })
      .catch((e) => {
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

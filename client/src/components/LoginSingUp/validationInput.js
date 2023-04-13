export function validationInput(e, setUserData) {
  const value = e.target.value;
  switch (e.target.name) {
    case "name":
      setUserData((state) => ({
        ...state,
        [e.target.name]: {
          ...state[e.target.name],
          value: value,
          error: /^[\p{L}\p{N}_-]{2,10}$/u.test(value)
            ? ""
            : "Имя пользователя может содержать только буквы латинского алфавита, цифры, дефис и знак подчеркивания и должно быть не менее 2 и не более 10 символов",
        },
      }));
      break;

    case "email":
      setUserData((state) => ({
        ...state,
        [e.target.name]: {
          ...state[e.target.name],
          value: value,
          error: /\S+@\S+\.\S+/.test(value)
            ? ""
            : "Неверный адрес электронной почты",
        },
      }));
      break;

    case "password":
      setUserData((state) => ({
        ...state,
        [e.target.name]: {
          ...state[e.target.name],
          value: value,
          error: /^[a-zA-Z0-9]{4,30}$/u.test(value)
            ? ""
            : "Пароль может содержать только буквы латинского алфавита, цифры, дефис и знак подчеркивания и должно быть не менее 4 и не более 30 символов",
        },
        confirmPassword: {
          ...state.confirmPassword,
          error:
            state.confirmPassword.value === value
              ? ""
              : "Пароли должны совпадать",
        },
      }));
      break;
    case "confirmPassword":
      setUserData((state) => ({
        ...state,
        [e.target.name]: {
          ...state[e.target.name],
          value: value,
          error:
            state.password.value === value ? "" : "Пароли должны совпадать",
        },
      }));
      break;
    default:
      break;
  }
}

export function getSender(chat, user) {
  const users = chat.users;
  const userId = user._id;

  let sender = user.name;

  users.forEach((user) => {
    if (userId !== user._id) {
      return (sender = user.name);
    }
  });

  return sender;
}

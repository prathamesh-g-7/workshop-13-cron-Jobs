let date = Date();
let time = date.split(" ")[4];

export default function loadData(username, email) {
  return {
    username: username,
    email: email,
    Time: time,
  };
}

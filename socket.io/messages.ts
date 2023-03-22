import axios from "axios";

export function getMessages(socket) {
  axios
    .get("http://localhost:5000/api/messages?m='hello world")
    .then(({ data }) => {
      console.log(data);

      socket.emit("messages", data);
    })
    .catch((error) => console.log(error.message));
}

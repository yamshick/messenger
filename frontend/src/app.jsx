// import styles from "./app.css";
// import { NavBar } from "./components/nav-bar";

// export const App = () => (
//   <div className={styles.app}>
//     <NavBar />
//   </div>
// );

// import styles from "./styles/style.css";
import { useState } from "react";
import "./styles/style.css";
import { io } from "socket.io-client";
import moment from "moment";
// console.log(stules)

const socket = io();

socket.on("clients-total", (data) => {
  clientsTotal.innerText = `Total Clients: ${data}`;
});

const messageTone = new Audio("assets/message-tone.mp3");

export const App = () => {
  const [nameInput, setNameInput] = useState("anonymous");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const onNameChange = (event) => {
    // console.log({event})
    setNameInput(event.target.value);
  };

  const onMessageChange = (event) => {
    // console.log({event})
    setMessageInput(event.target.value);
  };

  const clearFeedback = () => {
    setFeedback([]);
  };

  const scrollToBottom = () => {
    // messageContainer.scrollTo(0, messageContainer.scrollHeight)
  };

  // messageInput.addEventListener('focus', (e) => {
  //   socket.emit('feedback', {
  //     feedback: `✍️ ${nameInput.value} is typing a message`,
  //   })
  // })

  // messageInput.addEventListener('keypress', (e) => {
  //   socket.emit('feedback', {
  //     feedback: `✍️ ${nameInput.value} is typing a message`,
  //   })
  // })

  const addMessageToUI = (ownMessage, data) => {
    clearFeedback();

    setMessages([...messages, { ownMessage, data }]);
    scrollToBottom();
  };

  socket.on("chat-message", (data) => {
    // console.log(data)
    messageTone.play();
    addMessageToUI(false, data);
  });

  const sendMessage = () => {
    if (!messageInput) return;
    // console.log(messageInput.value)
    const data = {
      name: nameInput,
      message: messageInput,
      dateTime: new Date(),
    };
    socket.emit("message", data);
    addMessageToUI(true, data);
    setMessageInput("");
  };

  return (
    <>
      <h1 className="title">iChat 💬</h1>
      <div className="main">
        <div className="name">
          <span>
            <i className="far fa-user"></i>
          </span>
          <input
            type="text"
            id="name-input"
            className="name-input"
            value={nameInput}
            maxLength="20"
            onChange={onNameChange}
          />
        </div>

        <ul className="message-container" id="message-container">
          {messages.map(({ isOwnMessage, data }, idx) => (
            <li
              key={idx}
              className={isOwnMessage ? "message-right" : "message-left"}
            >
              <p className="message">
                ${data.message}
                <span>
                  ${data.name} ● ${moment(data.dateTime).fromNow()}
                </span>
              </p>
            </li>
          ))}
        </ul>

        <div className="message-form" id="message-form">
          <input
            type="text"
            name="message"
            id="message-input"
            className="message-input"
            value={messageInput}
            onChange={onMessageChange}
          />
          <div className="v-divider"></div>
          <button className="send-button" onClick={sendMessage}>
            send{" "}
            <span>
              <i className="fas fa-paper-plane"></i>
            </span>
          </button>
        </div>
      </div>
      <h3 className="clients-total" id="client-total">
        Total clients: 2
      </h3>
    </>
  );
};

import { useEffect, useState } from "react";
import "styles/style.style";
import { io } from "socket.io-client";
import moment from "moment";
import messageToneRaw from "assets/message-tone.mp3";

const socket = io();

const messageTone = new Audio(messageToneRaw);

export const Messenger = ({ userName, userId, login, chat }) => {
  console.log({ chat });
  if (!chat) return null;

  const [clientsCount, setClientsCount] = useState(1);
  const [nameInput, setNameInput] = useState(userName);
  // TODO
  useEffect(() => {
    setNameInput(userName);
  }, [userName]);
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

  useEffect(() => {
    socket.emit("create-room", {
      name: nameInput,
      userId,
      login,
      chat,
    });

    setMessages([])
  }, [chat])
  console.log({ messages });

  socket.on("clients-total", (data) => {
    console.log("clients-total", { data });
    setClientsCount(data);
  });

  socket.on("chat-message", (data) => {
    console.log({ data });
    messageTone.play();
    // setMessages([...messages, { ownMessage:, data }]);
    addMessageToUI(false, data);
  });

  const sendMessage = () => {
    if (!messageInput) return;
    // console.log(messageInput.value)
    const data = {
      name: nameInput,
      message: messageInput,
      dateTime: new Date(),
      userId,
      login,
      chat,
    };
    socket.emit("message", data);
    addMessageToUI(true, data);
    setMessageInput("");
  };

  return (
    <>
      <h1 className="title">{chat.name} 💬</h1>
      <div className="main">
        <div className="name">
          <span>
            <i className="far fa-user"></i>
          </span>
          <input
            type="text"
            id="name-input"
            className="name-input"
            value={userName}
            maxLength="20"
            // onChange={onNameChange}
          />
        </div>

        <ul className="message-container" id="message-container">
          {messages.map(({ ownMessage, data }) => (
            <li
              key={data.dateTime}
              className={ownMessage ? "message-right" : "message-left"}
            >
              <p className="message">
                {data.message}
                <span>
                  {data.name} ● {moment(data.dateTime).fromNow()}
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
        Total clients: {clientsCount}
      </h3>
    </>
  );
};

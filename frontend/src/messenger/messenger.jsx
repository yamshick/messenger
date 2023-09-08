import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "styles/style.style";
import { io } from "socket.io-client";
import moment from "moment";
import messageToneRaw from "assets/message-tone.mp3";

moment.locale("ru");

const socket = io();

const createRoom = (roomName) => {
  console.warn('creating room', {roomName})
  socket.emit("create-room", { roomName}); 
};

// function callOnly

export const Messenger = ({ userName, userId, login, chat }) => {
  // console.log({ chat });
  if (!chat) return null;

  const messageTone = new Audio(messageToneRaw);

  const prevChat = useRef(chat);
  const messageContainerRef = useRef();
  const messageContainerDummyDivRef = useRef();
  const [clientsCount, setClientsCount] = useState(1);
  const [nameInput, setNameInput] = useState(userName);

  useMemo(() => createRoom(chat.id), [chat.id]);

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

  const scrollToBottom = (smooth) => {
    try {
      messageContainerDummyDivRef.current.scrollIntoView();
    } catch (e) {
      console.error(e);
    }
    // messageContainerDummyDivRef.current.scrollIntoView(smooth ? { behavior: "smooth" } : {});
    // scrollTo(0, 200000)
    // messageContainer.scrollTo(0, messageContainer.scrollHeight)
  };

  // ONLY THIS TRULLY WORKS
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
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
    // clearFeedback();

    console.log("addMessageToUI", { ownMessage, data });
    setMessages([...messages, { ownMessage, data }]);
    scrollToBottom(true);
  };

  // useEffect(() => {
  //   console.log({
  //     curChatid: chat.id,
  //     prevChatId : prevChat.current.id 
  //   })
  //   if (!chat.id) {return}

  //   // if (chat.id === prevChat.current.id) {
  //   //   return;
  //   // }

  //   console.log('creating room')
  //   // socket.emit("create-room", {
  //   //   name: nameInput,
  //   //   userId,
  //   //   login,
  //   //   chat,
  //   // });

  //   createRoom(chat.id)
  //   prevChat.current = chat
  // }, [chat]);

  useEffect(() => {
    const parsedChatMessages = JSON.parse(chat.messages);
    const chatMessages = Array.isArray(parsedChatMessages)
      ? parsedChatMessages
      : [];

    setMessages(
      chatMessages.map(({ data }) => ({
        ownMessage: data.userId === userId,
        data,
      }))
    );

    scrollToBottom(true);
  }, [chat])
  // console.log({ messages });

  socket.on("clients-total", (data) => {
    // console.log("clients-total", { data });
    setClientsCount(data);
  });

  socket.on("chat-message", (data) => {
    console.log({ data: data });
    try {
      messageTone.play();
    } catch (e) {
      console.error(e);
    }
    // setMessages([...messages, { ownMessage:, data }]);
    addMessageToUI(false, data);
  });

  console.log({ messages });

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
    scrollToBottom(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 className="title">
        {
          chat.name
          // "Чат"
        }{" "}
        💬
      </h1>
      <h1 className="title">
        {
`      Чат id:  
      ${chat.id}`
        }
      </h1>
      <div className="main">
        <ul
          className="message-container"
          id="message-container"
          ref={messageContainerRef}
        >
          {messages.map(({ ownMessage, data }, idx) => (
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
          {/* dummy dif for scrolling to bottom */}
          <div ref={messageContainerDummyDivRef}></div>
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
            Отправить{" "}
            <span>
              <i className="fas fa-paper-plane"></i>
            </span>
          </button>
        </div>
      </div>
      <h3 className="clients-total" id="client-total">
        Total clients: {clientsCount}
      </h3>
    </div>
  );
};

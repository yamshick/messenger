import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatsThunk,
  sendMessageThunk,
} from "../store/reducers/auth-slice";
import { Spinner } from "ui/spinner";
import { Input } from "ui/input";
import { Button } from "ui/button";
import { MessageList } from "./message-list";

export const Chat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(null);
  const dispatch = useDispatch();
  const { userId, userName, login } = useSelector((state) => state.authReducer);

  const [wsInterface, setWsInterface] = useState({});

  const fetchMessagesUpdate = async () => {
    try {
      const res = await dispatch(fetchChatsThunk({ userIds: [1, 2] })).unwrap();
      setChat(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const { send } = initSocket({ host, port });
    setWsInterface({ send });
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await dispatch(
          fetchChatsThunk({ userIds: [1, 2] })
        ).unwrap();
        setChat(res);
        if (res.error) {
          //   setErrorMessage(res.error?.message);
          throw new Error(res.error?.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();

    // const interval = setInterval(fetchMessagesUpdate, PULLING_INTERVAL);

    // return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    // if (!message) {
    //   return;
    // }

    wsInterface.send && wsInterface.send({ message: "hello" });
    // console.log({send})
    // send({message})

    return;
    const newMessage = {
      userIds: [1, 2],
      userId,
      message,
      timeStamp: Date.now(),
      userName,
      login,
    };

    await dispatch(sendMessageThunk(newMessage)).unwrap();
    setMessage("");
    // for a while before next fetch
    // setChat({ ...chat, messages: [...chat.messages, newMessage] });

    await fetchMessagesUpdate();
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {/* <pre>{JSON.stringify(messages || {}, null, 2)}</pre> */}
          <MessageList chat={chat} />
          <Input
            value={message}
            onChange={setMessage}
            onEnter={sendMessage}
            type={"text"}
          />
          <Button onClick={sendMessage}>Отправить</Button>
        </div>
      )}
    </div>
  );
};

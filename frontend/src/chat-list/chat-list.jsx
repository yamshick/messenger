import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatsThunk,
  chatsSlice,
  fetchChatThunk,
  fetchChatByIdThunk,
} from "../store/reducers/chat-slice";
import { authSlice } from "../store/reducers/auth-slice";

export const ChatList = ({ chats }) => {
  const { setChats, setActiveChat } = chatsSlice.actions;

  const { userId } = useSelector((state) => state.authReducer);
  // const { chats } = useSelector((state) => state.chatsReducer);

  const dispatch = useDispatch();

  const fetchChats = async (userId) => {
    if (!userId) {
      dispatch(setChats([]));
      return;
    }

    try {
      const res = await dispatch(fetchChatsThunk({ userId })).unwrap();
      if (res.error) {
        console.error(res.error);
        //   setErrorMessage(res.error?.message);
        //   throw new Error(res.error?.message);
      }
      dispatch(setChats(res));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchChats(userId);
  }, [userId]);

  const updateActiveChat = async (chat) => {
    const { id } = chat;
    const activeChat = await dispatch(
      fetchChatByIdThunk({ chatId: id })
    ).unwrap();
    dispatch(setActiveChat(activeChat[0]));
  };

  const onChatClick = (chat) => {
    updateActiveChat(chat);
  };

  return (
    <div>
      <ul>
        {chats &&
          chats.map((chat, idx) => (
            <li key={idx} onClick={() => onChatClick(chat)}>
              <pre>{JSON.stringify(chat.name, null, 2)}</pre>
            </li>
          ))}
      </ul>
    </div>
  );
};

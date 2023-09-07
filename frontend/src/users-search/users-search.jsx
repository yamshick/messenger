import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersThunk, usersSlice } from "../store/reducers/users-slice";
import { chatsSlice, fetchChatThunk, postChatThunk } from "../store/reducers/chat-slice";

export const UsersSearch = ({
  userId,
  value: loginPredicate,
  onChange: onChangeProp,
}) => {
  const [predicate, setPredicate] = useState(loginPredicate || "");
  const { users } = useSelector(
    (state) => console.log({ state }) || state.usersReducer
  );
  const { setUsers } = usersSlice.actions;
  const { setActiveChat } = chatsSlice.actions;

  console.log({ users });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loginPredicate) return;
    setPredicate(loginPredicate);
  }, [loginPredicate]);

  const fetchUsers = async (predicate) => {
    if (!predicate) {
      dispatch(setUsers([]));
      return;
    }

    try {
      const res = await dispatch(
        fetchUsersThunk({ loginPredicate: predicate })
      ).unwrap();
      if (res.error) {
        console.error(res.error);
        //   setErrorMessage(res.error?.message);
        //   throw new Error(res.error?.message);
      }
      dispatch(setUsers(res));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers(predicate);
  }, [predicate]);

  const onChange = (event) => {
    const { value } = event.target;
    setPredicate(value);
    onChangeProp && onChangeProp(value);
  };

  const setUpChat = async (chatMemberIds) => {
    let activeChat = null;
    try {
      activeChat =
        await dispatch(
          fetchChatThunk({
            userIds: chatMemberIds,
          })
        ).unwrap();

      activeChat = activeChat ? activeChat[0] : activeChat;

      // console.warn({activeChat})
      // empty chat
      if (!Object.entries(activeChat).length) {
        activeChat = (await dispatch(
          postChatThunk({
            name: `Чат между ${chatMemberIds}`,
            userIds: chatMemberIds,
          })
        ).unwrap()[0]) || null;
      }

    } catch (e) {
      console.error(e);
      activeChat = null;
    }

    dispatch(
      setActiveChat(
        activeChat
        // activeChat || {
        //   // name: `Чат с ${user.firstName}`,
        //   name: "CHAT",
        //   memberIds: chatMemberIds,
        // }
      )
    );
  };

  const onUserClick = (user) => {
    const chatMemberIds = [userId, user.id];
    setUpChat(chatMemberIds);
  };

  return (
    <div>
      <input value={predicate} onChange={onChange} />
      <ul>
        {users &&
          users.map((user, idx) => (
            <li key={idx} onClick={() => onUserClick(user)}>
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </li>
          ))}
      </ul>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminSlice,
  fetchChatsThunk,
  fetchRolesThunk,
  fetchUsersThunk,
  updateUserThunk,
  deleteUserThunk,
  deleteChatThunk,
} from "../store/reducers/admin-slice";
import {
  chatsSlice,
  fetchChatThunk,
  postChatThunk,
} from "../store/reducers/chat-slice";
import { Registration } from "./registration";

export const Admin = () => {
  const dispatch = useDispatch();
  const [shouldShowUserAddPanel, setShouldShowUserAddPanel] = useState(false);

  const [shouldShowUserActionPanel, setShouldShowUserActionPanel] =
    useState(false);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [areAllUsersChecked, setAreAllUsersChecked] = useState(false);

  const [checkedChats, setCheckedChats] = useState([]);
  const [areAllChatsChecked, setAreAllChatsChecked] = useState(false);

  useEffect(() => {
    if (!checkedUsers.length) {
      setAreAllUsersChecked(false);
    }
    // setShouldShowUserActionPanel(!!checkedUsers.length)
  }, [checkedUsers]);

  useEffect(() => {
    if (!checkedChats.length) {
      setAreAllChatsChecked(false);
    }
    // setShouldShowUserActionPanel(!!checkedUsers.length)
  }, [checkedChats]);

  // console.log({checkedUsers})

  const { roles, chats, users } = useSelector((state) => state.adminReducer);
  const { setRoles, setChats, setUsers } = adminSlice.actions;

  const fetchRoles = async () => {
    try {
      const roles = await dispatch(fetchRolesThunk()).unwrap();
      console.warn({ roles });
      dispatch(setRoles(roles));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await dispatch(fetchUsersThunk()).unwrap();
      console.warn({ users });
      dispatch(setUsers(users));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchChats = async () => {
    try {
      const chats = await dispatch(fetchChatsThunk()).unwrap();
      console.warn({ chats });
      dispatch(setChats(chats));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
    fetchChats();
  }, []);

  const onUserRemove = async (user) => {
    console.warn({ user });
    await dispatch(deleteUserThunk({ user }));
    fetchUsers();
  };

  const onRoleSelect = async (event, user) => {
    const { value } = event.target;
    const properValue = JSON.parse(value);
    // console.warn("on role select", { event, properValue });
    const updatedUser = {
      ...user,
      role: properValue.name,
    };
    await dispatch(updateUserThunk({ user: updatedUser }));
    fetchUsers();
  };

  const onUserAdd = () => {
    // TODO
    setShouldShowUserAddPanel(true);
  };

  const onChatRemove = async (chat) => {
    // console.warn({ chat });
    await dispatch(deleteChatThunk({ chat }));
    fetchChats();
  };

  const onCheckUser = (event, user) => {
    const { checked } = event.target;
    // console.log({checked, user})
    if (checked) {
      setCheckedUsers([...checkedUsers, user]);
    } else {
      setCheckedUsers(
        checkedUsers.filter((checkedUser) => checkedUser.id !== user.id)
      );
    }
  };

  const onCheckChat = (event, chat) => {
    const { checked } = event.target;
    // console.log({checked, user})
    if (checked) {
      setCheckedChats([...checkedChats, chat]);
    } else {
      setCheckedChats(
        checkedChats.filter((checkedChat) => checkedChat.id !== chat.id)
      );
    }
  };

  const onRemoveUsers = () => {
    checkedUsers.forEach(onUserRemove);
    setCheckedUsers([]);
  };

  const onRemoveChats = () => {
    checkedChats.forEach(onChatRemove);
    setCheckedChats([]);
  };

  const onChatCreate = async () => {
    // const chatMemberLogins = checkedUsers.map(({login}) => login)
    if (checkedUsers.length !== 2) {
      alert("Пока только можно создать чат между 2 пользователями");
      return;
    }

    const chatMemberIds = checkedUsers.map(({ id }) => id);
    chatMemberIds.sort((a, b) => a - b);

    const existingChat = await dispatch(
      fetchChatThunk({
        userIds: chatMemberIds,
      })
    ).unwrap();

    if (existingChat.length) {
      setCheckedUsers([]);
      alert("чат уже существует");
      return;
    }

    await dispatch(
      postChatThunk({
        // name: `Чат между ${chatMemberLogins.join('и')}`,
        name: `Чат между ${chatMemberIds}`,
        userIds: chatMemberIds,
      })
    ).unwrap();

    setCheckedUsers([]);
    fetchChats();
  };

  const onCheckAllUsers = (event) => {
    const { checked } = event.target;
    setAreAllUsersChecked(checked);
    if (checked) {
      setCheckedUsers(users.filter((user) => user.login !== "admin"));
    } else {
      setCheckedUsers([]);
    }
  };

  const onCheckAllChats = (event) => {
    const { checked } = event.target;
    setAreAllChatsChecked(checked);
    if (checked) {
      setCheckedChats(chats);
    } else {
      setCheckedChats([]);
    }
  };

  const onRegister = () => {
    setShouldShowUserAddPanel(false);
    fetchUsers();
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", gap: "50px" }}
    >
      {/* <div>
            <h3>Роли</h3>
        <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>
  */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
            // border: 'solid 1px'
          }}
        >
          <h3>Пользователи</h3>
          <button onClick={onUserAdd}> Добавить </button>
        </div>
        {shouldShowUserAddPanel && <Registration onRegister={onRegister} />}
        {shouldShowUserActionPanel ||
          (true && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                checked={areAllUsersChecked}
                style={{ height: "30px", width: "30px" }}
                type="checkbox"
                onChange={(event) => onCheckAllUsers(event)}
              />
              <button onClick={onRemoveUsers}>Удалить</button>
              <button
                disabled={checkedUsers.length !== 2}
                onClick={onChatCreate}
              >
                Создать чат
              </button>
            </div>
          ))}
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                listStyle: "none",
                border: "solid 1px",
                borderRadius: "4px",
                margin: "4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "3px",
                  margin: "4px",
                }}
              >
                <div>
                  <input
                    checked={
                      user.login !== "admin" &&
                      checkedUsers.map(({ id }) => id).includes(user.id)
                    }
                    disabled={user.login === "admin"}
                    style={{ height: "30px", width: "30px" }}
                    type="checkbox"
                    onChange={(event) => onCheckUser(event, user)}
                  />
                </div>
                <div>
                  <p>{`name: ${user.firstName} ${user.secondName}`}</p>
                  <p>{`id: ${user.id}`}</p>
                  <p>{`login: ${user.login}`}</p>
                  <p>{`password: ${user.password}`}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 3,
                  }}
                >
                  <button
                    disabled={user.login === "admin"}
                    onClick={() => onUserRemove(user)}
                  >
                    Удалить
                  </button>
                  <select
                    onChange={(event) => onRoleSelect(event, user)}
                    value={JSON.stringify(
                      roles.find((role) => role.name === user.role)
                    )}
                  >
                    {roles.map((role) => (
                      <option
                        disabled={user.login === "admin"}
                        key={role.id}
                        value={JSON.stringify(role)}
                      >
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Чаты</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            checked={areAllChatsChecked}
            style={{ height: "30px", width: "30px" }}
            type="checkbox"
            onChange={(event) => onCheckAllChats(event)}
          />
          <button onClick={onRemoveChats}>Удалить</button>
        </div>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              style={{
                listStyle: "none",
                border: "solid 1px",
                borderRadius: "4px",
                margin: "4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div>
                  <input
                    checked={checkedChats.map(({ id }) => id).includes(chat.id)}
                    style={{ height: "30px", width: "30px" }}
                    type="checkbox"
                    onChange={(event) => onCheckChat(event, chat)}
                  />
                </div>
                <div>
                  <p>{`name: ${chat.name}`}</p>
                  <p>{`messages: ${
                    JSON.parse(chat.messages || "[]")?.length
                  }`}</p>
                </div>
                <div>
                  <button onClick={() => onChatRemove(chat)}>Удалить</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {/* <pre>{JSON.stringify(chats, null, 2)}</pre> */}
      </div>
    </div>
  );
};

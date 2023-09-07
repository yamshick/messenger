import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminSlice,
  fetchChatsThunk,
  fetchRolesThunk,
  fetchUsersThunk,
  updateUserThunk,
  deleteUserThunk,
} from "../store/reducers/admin-slice";
import { Registration } from "./registration";

export const Admin = () => {
  const dispatch = useDispatch();
  const [shouldShowUserAddPanel, setShouldShowUserAddPanel] = useState(false)

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
    console.warn("on role select", { event, properValue });
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
  }

  const onRegister = () => {
    setShouldShowUserAddPanel(false)
    fetchUsers()
  }
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
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
                            alignItems: 'center',
                            gap: 3,
                          }}          
        >
            <h3>Пользователи</h3>
            <button onClick={onUserAdd}> Добавить </button>
        </div>
        {shouldShowUserAddPanel && (
            <Registration onRegister={onRegister}/>
        )}
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 3,
                }}
              >
                <div>
                  <p>{`name: ${user.firstName} ${user.secondName}`}</p>
                  <p>{`login: ${user.login}`}</p>
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
        <pre>{JSON.stringify(chats, null, 2)}</pre>
      </div>
    </div>
  );
};

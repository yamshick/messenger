import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminSlice,
  fetchChatsThunk,
  fetchRolesThunk,
  fetchUsersThunk
} from "../store/reducers/admin-slice";

export const Admin = () => {
  const dispatch = useDispatch();
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
      dispatch(setUsers(users))
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

  const onUserRemove = (user) => {
    console.warn({user})
  }

  const onRoleSelect = (event) => {
    const {value} = event.target; 
    const properValue = JSON.parse(value)
    console.warn('on role select', {event, properValue})
  }

  return (
    <div style={{display:'flex', justifyContent: 'space-between', gap: 3}}>
        {/* <div>
            <h3>Роли</h3>
        <pre>{JSON.stringify(roles, null, 2)}</pre>
        </div>
  */}
        <div>
        <h3>Пользователи</h3>
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    <div style={{display:'flex', justifyContent: 'space-between', gap: 3}}>
                    <p>
                    {`name: ${user.firstName} ${user.secondName}, login: ${user.login}`}
                    </p>
                    <button disabled={user.login === 'admin'} onClick={() => onUserRemove(user)}>Удалить</button>
                    <select onChange={onRoleSelect}>
                        {roles.map(role => (
                        <option disabled={user.login === 'admin'} key={role.id} value={JSON.stringify(role)}>
                            {role.name}
                        </option>
                        ))}
                    </select>
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

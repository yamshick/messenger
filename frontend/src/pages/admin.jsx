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

  return (
    <div>
      <pre>{JSON.stringify(roles, null, 2)}</pre>
      <pre>{JSON.stringify(users, null, 2)}</pre>
      <pre>{JSON.stringify(chats, null, 2)}</pre>
    </div>
  );
};

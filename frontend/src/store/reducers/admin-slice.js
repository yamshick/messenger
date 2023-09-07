import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  FETCH_ROLES,
  FETCH_USERS,
  FETCH_CHATS,
  UPDATE_USER,
  UPDATE_CHAT,
  DELETE_CHAT,
  DELETE_USER,
} from "../../api/constants";
import { httpService } from "../../service/http-service";
import { LOCAL_STORAGE_STATE_KEY } from "../../local-storage";

const initialState = {
  roles: [],
  users: [],
  chats: [],
};

export const fetchRolesThunk = createAsyncThunk("admin/roles", async () => {
  const res = await httpService.get(FETCH_ROLES);
  return res;
});

export const fetchUsersThunk = createAsyncThunk("admin/users", async () => {
  const res = await httpService.get(FETCH_USERS);
  return res;
});

export const fetchChatsThunk = createAsyncThunk(
  "admin/fetch-chats",
  async () => {
    return await httpService.get(FETCH_CHATS);
  }
);

export const updateUserThunk = createAsyncThunk(
  "admin/update-user",
  async ({ user }) => {
    return await httpService.put(UPDATE_USER, user);
  }
);

export const deleteUserThunk = createAsyncThunk(
  "admin/delete-user",
  async ({ user }) => {
    return await httpService.delete(DELETE_USER, user);
  }
);

export const deleteChatThunk = createAsyncThunk(
  "admin/delete-chat",
  async ({ chat }) => {
    return await httpService.delete(DELETE_CHAT, chat);
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState: initialState,
  reducers: {
    setRoles(state, action) {
      state.roles = action.payload;
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
    setChats(state, action) {
      state.chats = action.payload;
    },
  },
});

export const { reducer } = adminSlice;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  LOGIN,
  REGISTER,
  FETCH_CHATS,
  SEND_MESSAGE,
} from "../../api/constants";
import { httpService } from "../../service/http-service";
import { LOCAL_STORAGE_STATE_KEY } from "../../local-storage";

const initialState = {
  isAuth: false,
  userName: null,
  userId: null,
  login: null,
  role: null,
  chats: [],
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ login, password }) => {
    const res = await httpService.post(LOGIN, { login, password });
    return res;
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ firstName, secondName, login, password }) => {
    return await httpService.post(REGISTER, {
      firstName,
      secondName,
      login,
      password,
    });
  }
);

export const fetchChatsThunk = createAsyncThunk(
  "auth/fetchChats",
  async ({ userIds }) => {
    // return await httpService.get(FETCH_CHATS, {});
    const fancyGetUrl = `${FETCH_CHATS}/${userIds.toString()}`;
    return await httpService.fancyGet(fancyGetUrl);
  }
);

export const sendMessageThunk = createAsyncThunk(
  "auth/sendMessage",
  async ({ userIds, userId, message, timeStamp, userName, login }) => {
    return await httpService.post(SEND_MESSAGE, {
      userIds,
      userId,
      message,
      timeStamp,
      userName,
      login,
    });
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState:
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_STATE_KEY))?.authReducer ||
    initialState,
  reducers: {
    setIsAuth(state, action) {
      state.isAuth = action.payload;
    },
    setUser(state, action) {
      const { id, name, login, role } = action.payload;
      state.userId = id;
      state.userName = name;
      state.login = login;
      state.role = role;
    },
    setChats(state, action) {
      state.chats = action.payload;
    },
  },
  // extraReducers(builder) {
  //   builder
  //       .addCase(loginThunk.fulfilled, (state, action) => {
  //       })
  //       .addCase(registerThunk.fulfilled, (state, action) => {
  //       });
  // },
});

export const { reducer } = authSlice;

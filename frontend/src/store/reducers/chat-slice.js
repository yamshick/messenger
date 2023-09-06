import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FETCH_CHATS, FETCH_USERS } from "../../api/constants";
import { httpService } from "../../service/http-service";

const initialState = {
  chats: [],
};

export const fetchChatsThunk = createAsyncThunk(
  "users/fetch",
  async ({ userId }) => {
    const res = await httpService.get(`${FETCH_CHATS}/${userId}`);
    return res;
  }
);

export const chatsSlice = createSlice({
  name: "chats",
  initialState: initialState,
  reducers: {
    setChats(state, action) {
      console.warn({ action });
      state.chats = action.payload;
    },
  },
});

export const { reducer } = chatsSlice;

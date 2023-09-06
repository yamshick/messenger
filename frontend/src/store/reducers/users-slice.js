import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FETCH_USERS } from "../../api/constants";
import { httpService } from "../../service/http-service";

const initialState = {
  users: [],
};

export const fetchUsersThunk = createAsyncThunk(
  "users/fetch",
  async ({ loginPredicate }) => {
    const res = await httpService.get(`${FETCH_USERS}/${loginPredicate}`);
    return res;
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setUsers(state, action) {
      console.warn({ action });
      state.users = action.payload;
    },
  },
});

export const { reducer } = usersSlice;

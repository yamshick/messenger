import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { reducer as authReducer } from "./reducers/auth-slice";
import { reducer as usersReducer } from "./reducers/users-slice";
import { LOCAL_STORAGE_STATE_KEY } from "../local-storage";

const rootReducer = combineReducers({
  authReducer,
  usersReducer
});

const localStorageMiddleware = (store) => (next) => (action) => {
  console.log(action);
  const result = next(action);
  localStorage.setItem(
    LOCAL_STORAGE_STATE_KEY,
    JSON.stringify(store.getState())
  );
  return result;
};

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(localStorageMiddleware),
  });
};

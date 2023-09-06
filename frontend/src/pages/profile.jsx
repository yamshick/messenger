import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { hashRoutes } from "../constants";
import { Button } from "../ui/button";
import { authSlice } from "../store/reducers/auth-slice";
import styles from "./page.css";
// import { Chat } from "../chats/chat";
import { Messenger } from "../messenger/messenger";
import { UsersSearch } from "../users-search/users-search";

export const Profile = () => {
  const { isAuth, userName, userId, login } = useSelector(
    (state) => state.authReducer
  );
  const { setUser, setIsAuth } = authSlice.actions;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogout = () => {
    dispatch(setIsAuth(false));
    dispatch(setUser({ id: userId, name: userName, login }));
    navigate(hashRoutes.LOGIN);
  };

  return (
    <>
      {isAuth || true ? (
        <div className={styles.formContainer}>
          <div className={styles.textMessage}>{`Привет, ${userName}!`}</div>
          {/* <Chat /> */}
          <div style={{display: 'flex', flexDirection: 'space-between', border: 'solid 1px', width: '100%'}}>
            <div>
            <div>
             <UsersSearch />
            </div>
            <div>
              USERS LIST
            </div>
            </div>
            <div>
              <Messenger userName={userName}/>
              <Button onClick={onLogout}>Выйти</Button>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to={hashRoutes.LOGIN} />
      )}
    </>
  );
};

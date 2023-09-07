import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { hashRoutes } from "../constants";
import { Button } from "../ui/button";
import { authSlice } from "../store/reducers/auth-slice";
import "styles/style.style";
import styles from "./page.css";
// import { Chat } from "../chats/chat";
import { Messenger } from "../messenger/messenger";
import { UsersSearch } from "../users-search/users-search";
import { ChatList } from "../chat-list/chat-list";
import { Admin } from "./admin";

export const Profile = () => {
  const { isAuth, userName, userId, login, role } = useSelector(
    (state) => state.authReducer
  );
  const { activeChat } = useSelector((state) => state.chatsReducer);

  const { setUser, setIsAuth } = authSlice.actions;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogout = () => {
    dispatch(setIsAuth(false));
    // Разобраться
    dispatch(setUser({ id: userId, name: userName, login }));
    navigate(hashRoutes.LOGIN);
  };

  if (role === "admin") {
    return (
      <>
        <Button onClick={onLogout}>Выйти</Button>
        <Admin />
      </>
    );
  }

  return (
    <>
      {isAuth ? (
        <div className={styles.formContainer}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              className="name"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>
                <i className="far fa-user"></i>
              </span>
              <span style={{ color: "black" }}>{userName}</span>
              {/* <input
              type="text"
              id="name-input"
              className="name-input"
              value={userName}
            /> */}
            </div>

            <Button onClick={onLogout}>Выйти</Button>
          </div>

          {/* <div className={styles.textMessage}>{`Привет, ${userName}!`}</div>
          <div className={styles.textMessage}>{`ROLE: ${role}!`}</div> */}
          {/* <Chat /> */}
          <div
            style={{
              display: "flex",
              flexDirection: "space-between",
              border: "solid 1px",
              width: "100%",
            }}
          >
            <div>
              <div>
                <UsersSearch userId={userId} />
              </div>
              <div>
                <ChatList />
              </div>
            </div>
            <div>
              <Messenger
                chat={activeChat}
                userName={userName}
                userId={userId}
                login={login}
              />
            </div>
          </div>
        </div>
      ) : (
        <Navigate to={hashRoutes.LOGIN} />
      )}
    </>
  );
};

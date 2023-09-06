import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "./page.css";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { authSlice, loginThunk } from "../store/reducers/auth-slice";
import { hashRoutes } from "../constants";
import { Spinner } from "../ui/spinner";

export const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuth } = useSelector((state) => state.authReducer);
  const { setIsAuth, setUser } = authSlice.actions;

  const onLogin = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(loginThunk({ login, password })).unwrap();
      if (res.error) {
        setErrorMessage(res.error?.message);
        throw new Error(res.error?.message);
      }
      const { user } = res;
      console.warn({user})
      setLogin("");
      setPassword("");
      dispatch(setIsAuth(true));
      dispatch(setUser(user));
      navigate(hashRoutes.PROFILE);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoginDisabled = ![login, password].every(Boolean);

  if (isAuth) {
    return <Navigate to={hashRoutes.PROFILE} />;
  }
  return (
    <div className={styles.formContainer}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Input
            value={login}
            onChange={setLogin}
            type={"text"}
            placeholder={"Логин"}
          />
          <Input
            value={password}
            onChange={setPassword}
            type={"password"}
            placeholder={"Пароль"}
          />
          <div className={errorMessage ? "" : styles.hider}>{errorMessage}</div>
          <Button disabled={isLoginDisabled} onClick={onLogin}>
            Войти
          </Button>
        </>
      )}
    </div>
  );
};

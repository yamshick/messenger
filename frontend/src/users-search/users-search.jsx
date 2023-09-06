import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersThunk, usersSlice } from "../store/reducers/users-slice";

export const UsersSearch = ({
  value: loginPredicate,
  onChange: onChangeProp,
}) => {
  const [predicate, setPredicate] = useState(loginPredicate || "");
  const { users } = useSelector(
    (state) => console.log({ state }) || state.usersReducer
  );
  const { setUsers } = usersSlice.actions;

  console.log({ users });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loginPredicate) return;
    setPredicate(loginPredicate);
  }, [loginPredicate]);

  const fetchUsers = async (predicate) => {
    if (!predicate) {
      dispatch(setUsers([]));
      return;
    }

    try {
      const res = await dispatch(
        fetchUsersThunk({ loginPredicate: predicate })
      ).unwrap();
      if (res.error) {
        console.error(res.error);
        //   setErrorMessage(res.error?.message);
        //   throw new Error(res.error?.message);
      }
      dispatch(setUsers(res));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers(predicate);
  }, [predicate]);

  const onChange = (event) => {
    const { value } = event.target;
    setPredicate(value);
    onChangeProp && onChangeProp(value);
  };

  return (
    <div>
      <input value={predicate} onChange={onChange} />
      <ul>
        {users &&
          users.map((user, idx) => <li key={idx}>{JSON.stringify(user)}</li>)}
      </ul>
    </div>
  );
};
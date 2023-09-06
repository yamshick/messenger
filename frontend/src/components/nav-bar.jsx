import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { Main } from "../pages/main";
import { Login } from "../pages/login";
import { Registration } from "../pages/registration";
import { Profile } from "../pages/profile";
import styles from "./nav-bar.css";
import { hashRoutes } from "../constants";

export const NavBar = () => {
  // return (<h1>hello</h1>)
  return (
    <Router>
      <>
        <nav className={styles.nav}>
          {[
            // { name: "Главная", link: hashRoutes.ROOT, id: 1 },
            { name: "Логин", link: hashRoutes.LOGIN, id: 2 },
            { name: "Регистрация", link: hashRoutes.REGISTRATION, id: 3 },
            { name: "Профиль", link: hashRoutes.PROFILE, id: 4 },
          ].map(({ name, link, id }) => (
            <div key={id}>
              <NavLink className={styles.navLink} to={link}>
                {name}
              </NavLink>
            </div>
          ))}
        </nav>
        <Routes>
          <Route path="/" element={<Profile />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/registration" element={<Registration />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
      </>
    </Router>
  );
};

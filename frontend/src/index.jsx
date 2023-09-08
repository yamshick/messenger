import React from "react";
import { createRoot } from "react-dom/client";
import { setupStore } from "./store/store";
import { Provider } from "react-redux";
import { App } from "./app";
// import { Router } from "react-router-dom";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const store = setupStore();

root.render(
  // <Router>
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </Provider>
  // </Router>
);

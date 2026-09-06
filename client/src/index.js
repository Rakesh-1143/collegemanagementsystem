import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import store from "./redux/store";

// Belt-and-suspenders: filter React Router's dev-only "Future Flag" warnings.
// The app already opts in via <BrowserRouter future={{ ... }}> below; this
// just guarantees the v6→v7 heads-up never spams the console.
const consoleWarn = console.warn.bind(console);
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("React Router Future Flag Warning")
  ) {
    return;
  }
  consoleWarn(...args);
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}>
          <App />
        </Router>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
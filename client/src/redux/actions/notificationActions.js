import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from "../actionTypes";

let nextId = 0;

// Dispatch a toast. severity: "success" | "error" | "info" | "warning".
export const notify = (message, severity = "success", duration = 4000) => (
  dispatch
) => {
  const id = ++nextId;
  dispatch({ type: SHOW_NOTIFICATION, payload: { id, message, severity } });
  setTimeout(() => {
    dispatch({ type: HIDE_NOTIFICATION, payload: id });
  }, duration);
};
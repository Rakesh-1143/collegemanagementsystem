import * as api from "../api";
import { GET_ME, LOGOUT } from "../actionTypes";
import store from "../store";
import { clearToken } from "../token";

// Called once on app load. Restores the logged-in user from the httpOnly
// session cookie (data itself always lives in MongoDB).
export const restoreSession = () => async (dispatch) => {
  try {
    const { data } = await api.fetchMe();
    dispatch({
      type: GET_ME,
      payload: { role: data.role, result: data.result },
    });
  } catch (error) {
    // No valid session at the time this request was sent. Only clear the
    // in-memory auth data if the user hasn't logged in while /api/me was in
    // flight — a slow restore racing a fast login must not kick the user out.
    const state = store.getState();
    const hasLiveSession = ["admin", "superAdmin", "faculty", "student"].some(
      (role) => !!state[role]?.authData
    );
    if (!hasLiveSession) {
      clearToken();
      dispatch({ type: LOGOUT });
    }
  }
};

export const logOut = () => async (dispatch) => {
  try {
    await api.logout();
  } catch (error) {
    // The cookie may already be invalid — ignore.
  }
  clearToken();
  dispatch({ type: LOGOUT });
};
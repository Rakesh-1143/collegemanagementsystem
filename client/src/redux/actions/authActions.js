import * as api from "../api";
import { GET_ME, LOGOUT } from "../actionTypes";

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
    dispatch({ type: GET_ME, payload: null });
  }
};

export const logOut = () => async (dispatch) => {
  try {
    await api.logout();
  } catch (error) {
    // The cookie may already be invalid — ignore.
  }
  dispatch({ type: LOGOUT });
};
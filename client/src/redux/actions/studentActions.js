import {
  SET_ERRORS,
  UPDATE_PASSWORD,
  TEST_RESULT,
  STUDENT_LOGIN,
  ATTENDANCE,
  UPDATE_STUDENT,
  GET_SUBJECT,
  GET_ME,
} from "../actionTypes";
import * as api from "../api";
import { notify } from "./notificationActions";
import { setToken } from "../token";

export const studentSignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.studentSignIn(formData);
    // Persist the JWT for Authorization-header auth on later requests.
    setToken(data?.token);
    delete data.token;
    dispatch({ type: STUDENT_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/student/home");
    else navigate("/student/password");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const studentUpdatePassword =
  (formData, navigate) => async (dispatch) => {
    try {
      await api.studentUpdatePassword(formData);
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      dispatch(notify("Password updated successfully", "success"));
      navigate("/student/home");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
    }
  };

export const updateStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateStudent(formData);
    dispatch({ type: UPDATE_STUDENT, payload: true });
    // Reflect profile changes immediately in the header/profile UI.
    dispatch({ type: GET_ME, payload: { role: "student", result: data } });
    dispatch(notify("Profile updated successfully", "success"));
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const getSubject = (department, year) => async (dispatch) => {
  try {
    const formData = {
      department,
      year,
    };
    const { data } = await api.getSubject(formData);
    dispatch({ type: GET_SUBJECT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const getTestResult =
  (department, year, section) => async (dispatch) => {
    try {
      const formData = {
        department,
        year,
        section,
      };
      const { data } = await api.getTestResult(formData);
      dispatch({ type: TEST_RESULT, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
    }
  };

export const getAttendance =
  (department, year, section) => async (dispatch) => {
    try {
      const formData = {
        department,
        year,
        section,
      };
      const { data } = await api.getAttendance(formData);
      dispatch({ type: ATTENDANCE, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
    }
  };

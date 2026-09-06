import {
  SET_ERRORS,
  FACULTY_LOGIN,
  UPDATE_PASSWORD,
  UPDATE_FACULTY,
  ADD_TEST,
  GET_TEST,
  GET_STUDENT,
  GET_MY_SUBJECTS,
  GET_MY_STUDENTS,
  MARKS_UPLOADED,
  ATTENDANCE_MARKED,
} from "../actionTypes";
import * as api from "../api";
import { notify } from "./notificationActions";

export const facultySignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.facultySignIn(formData);
    dispatch({ type: FACULTY_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/faculty/home");
    else navigate("/faculty/password");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const facultyUpdatePassword =
  (formData, navigate) => async (dispatch) => {
    try {
      await api.facultyUpdatePassword(formData);
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      dispatch(notify("Password updated successfully", "success"));
      navigate("/faculty/home");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
    }
  };

export const updateFaculty = (formData) => async (dispatch) => {
  try {
    await api.updateFaculty(formData);
    dispatch({ type: UPDATE_FACULTY, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const getMySubjects = () => async (dispatch) => {
  try {
    const { data } = await api.getMySubjects();
    dispatch({ type: GET_MY_SUBJECTS, payload: data.result });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong." } });
  }
};

export const getMyStudents = () => async (dispatch) => {
  try {
    const { data } = await api.getMyStudents();
    dispatch({ type: GET_MY_STUDENTS, payload: data.result });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong." } });
  }
};

export const createTest = (formData) => async (dispatch) => {
  try {
    await api.createTest(formData);
    dispatch(notify("Test created successfully", "success"));
    dispatch({ type: ADD_TEST, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const getTest = () => async (dispatch) => {
  try {
    const { data } = await api.getTest();
    dispatch({ type: GET_TEST, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const uploadMark =
  (marks, test) => async (dispatch) => {
    try {
      const formData = {
        marks,
        test,
      };
      await api.uploadMarks(formData);
      dispatch(notify("Marks uploaded successfully", "success"));
      dispatch({ type: MARKS_UPLOADED, payload: true });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
    }
  };

export const markAttendance =
  (checkedValue, date) =>
  async (dispatch) => {
    try {
      const formData = {
        selectedStudents: checkedValue,
        date,
      };
      await api.markAttendance(formData);
      dispatch(notify("Attendance marked successfully", "success"));
      dispatch({ type: ATTENDANCE_MARKED, payload: true });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
    }
  };

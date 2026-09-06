import {
  ADMIN_LOGIN,
  UPDATE_ADMIN,
  ADD_FACULTY,
  GET_ALL_FACULTY,
  ADD_SUBJECT,
  ADD_STUDENT,
  GET_ALL_STUDENT,
  GET_FACULTY,
  GET_SUBJECT,
  GET_STUDENT,
  SET_ERRORS,
  UPDATE_PASSWORD,
  GET_ALL_SUBJECT,
  DELETE_FACULTY,
  DELETE_STUDENT,
  DELETE_SUBJECT,
  CREATE_NOTICE,
  GET_NOTICE,
  GET_ALL_DEPARTMENT,
  ADD_BRANCH,
  GET_BRANCHES,
  UPDATE_BRANCH,
  DELETE_BRANCH,
  ADD_COURSE,
  GET_COURSES,
  UPDATE_COURSE,
  DELETE_COURSE,
  UPDATE_FACULTY,
  GET_SUBJECTS_BY_COURSE,
  UPDATE_SUBJECT,
  GET_ME,
} from "../actionTypes";
import * as api from "../api";
import { notify } from "./notificationActions";

export const adminSignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.adminSignIn(formData);
    dispatch({ type: ADMIN_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/admin/home");
    else navigate("/admin/update/password");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const adminUpdatePassword = (formData, navigate) => async (dispatch) => {
  try {
    await api.adminUpdatePassword(formData);
    dispatch({ type: UPDATE_PASSWORD, payload: true });
    dispatch(notify("Password updated successfully", "success"));
    navigate("/admin/home");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const getAllStudent = () => async (dispatch) => {
  try {
    const { data } = await api.getAllStudent();
    dispatch({ type: GET_ALL_STUDENT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

// No client-side caching: lists must stay fresh after add/update/delete flows.
export const getAllDepartment = () => async (dispatch) => {
  try {
    const { data } = await api.getAllDepartment();
    dispatch({ type: GET_ALL_DEPARTMENT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const getAllFaculty = () => async (dispatch) => {
  try {
    const { data } = await api.getAllFaculty();
    dispatch({ type: GET_ALL_FACULTY, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};
export const getAllSubject = () => async (dispatch) => {
  try {
    const { data } = await api.getAllSubject();
    dispatch({ type: GET_ALL_SUBJECT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const updateAdmin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateAdmin(formData);
    dispatch({ type: UPDATE_ADMIN, payload: true });
    // Refresh the session with the updated profile so the header/profile UI
    // reflect the change immediately (no logout/re-login needed).
    dispatch({ type: GET_ME, payload: { role: "admin", result: data } });
    dispatch(notify("Profile updated successfully", "success"));
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};
export const createNotice = (formData) => async (dispatch) => {
  try {
    await api.createNotice(formData);
    dispatch(notify("Notice created successfully", "success"));
    dispatch({ type: CREATE_NOTICE, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};
export const deleteFaculty = (formData) => async (dispatch) => {
  try {
    await api.deleteFaculty(formData);
    dispatch(notify("Faculty deleted successfully", "success"));
    dispatch({ type: DELETE_FACULTY, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const addBranch = (formData) => async (dispatch) => {
  try {
    await api.addBranch(formData);
    dispatch(notify("Branch added successfully", "success"));
    dispatch({ type: ADD_BRANCH, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

// No client-side caching: branches must refresh after add/update/delete flows.
export const getBranches = () => async (dispatch) => {
  try {
    const { data } = await api.getBranches();
    dispatch({ type: GET_BRANCHES, payload: data.result });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const updateBranch = (formData) => async (dispatch) => {
  try {
    await api.updateBranch(formData);
    dispatch(notify("Branch updated successfully", "success"));
    dispatch({ type: UPDATE_BRANCH, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const deleteBranch = (branchId) => async (dispatch) => {
  try {
    await api.deleteBranch(branchId);
    dispatch(notify("Branch deleted successfully", "success"));
    dispatch({ type: DELETE_BRANCH, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const addCourse = (formData) => async (dispatch) => {
  try {
    await api.addCourse(formData);
    dispatch(notify("Course added successfully", "success"));
    dispatch({ type: ADD_COURSE, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

// No client-side caching: courses must refresh after add/update/delete flows.
export const getCourses = () => async (dispatch) => {
  try {
    const { data } = await api.getCourses();
    dispatch({ type: GET_COURSES, payload: data.result });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const updateCourse = (formData) => async (dispatch) => {
  try {
    await api.updateCourse(formData);
    dispatch(notify("Course updated successfully", "success"));
    dispatch({ type: UPDATE_COURSE, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const deleteCourse = (courseId) => async (dispatch) => {
  try {
    await api.deleteCourse(courseId);
    dispatch(notify("Course deleted successfully", "success"));
    dispatch({ type: DELETE_COURSE, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};
export const deleteStudent = (formData) => async (dispatch) => {
  try {
    await api.deleteStudent(formData);
    dispatch(notify("Student deleted successfully", "success"));
    dispatch({ type: DELETE_STUDENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};
export const deleteSubject = (formData) => async (dispatch) => {
  try {
    await api.deleteSubject(formData);
    dispatch(notify("Subject deleted successfully", "success"));
    dispatch({ type: DELETE_SUBJECT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const addFaculty = (formData) => async (dispatch) => {
  try {
    const { data } = await api.addFaculty(formData);
    const username = data?.result?.username;
    dispatch(
      notify(
        username
          ? `Faculty added successfully. Username: ${username} (initial password: DOB in DD-MM-YYYY)`
          : "Faculty added successfully",
        "success",
        6000
      )
    );
    dispatch({ type: ADD_FACULTY, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const getFaculty = (department) => async (dispatch) => {
  try {
    const { data } = await api.getFaculty(department);
    dispatch({ type: GET_FACULTY, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const addSubject = (formData) => async (dispatch) => {
  try {
    await api.addSubject(formData);
    dispatch(notify("Subject added successfully", "success"));
    dispatch({ type: ADD_SUBJECT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const getSubject = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getSubject(formData);
    dispatch({ type: GET_SUBJECT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const addStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.addStudent(formData);
    const username = data?.result?.username;
    dispatch(
      notify(
        username
          ? `Student added successfully. Username: ${username} (initial password: DOB in DD-MM-YYYY)`
          : "Student added successfully",
        "success",
        6000
      )
    );
    dispatch({ type: ADD_STUDENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const getStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getStudent(formData);
    dispatch({ type: GET_STUDENT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const getNotice = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getNotice(formData);
    dispatch({ type: GET_NOTICE, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const updateFaculty = (formData) => async (dispatch) => {
  try {
    await api.editFaculty(formData);
    dispatch(notify("Faculty updated successfully", "success"));
    dispatch({ type: UPDATE_FACULTY, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const getSubjectsByCourse = (courseId) => async (dispatch) => {
  try {
    const { data } = await api.getSubjectsByCourse({ course: courseId });
    dispatch({ type: GET_SUBJECTS_BY_COURSE, payload: data.result });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

export const updateSubject = (formData) => async (dispatch) => {
  try {
    await api.updateSubject(formData);
    dispatch(notify("Subject updated successfully", "success"));
    dispatch({ type: UPDATE_SUBJECT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { backendError: "Something went wrong. Please try again." } });
  }
};

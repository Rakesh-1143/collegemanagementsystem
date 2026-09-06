import {
  SUPER_ADMIN_LOGIN,
  UPDATE_SUPER_ADMIN,
  UPDATE_PASSWORD,
  ADD_ADMIN,
  GET_ADMIN,
  DELETE_ADMIN,
  SET_ERRORS,
  UPDATE_ADMIN_STATUS,
  EDIT_ADMIN,
  ADD_DEPARTMENT,
  DELETE_DEPARTMENT,
  EDIT_DEPARTMENT,
  UPDATE_DEPARTMENT_STATUS,
  GET_UNASSIGNED_ADMINS,
  GET_SUPER_ADMIN_DEPARTMENTS,
  GET_ME,
} from "../actionTypes";
import * as api from "../api";
import { notify } from "./notificationActions";
import { setToken } from "../token";

export const superAdminSignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.superAdminSignIn(formData);
    // Persist the JWT for Authorization-header auth on later requests.
    setToken(data?.token);
    delete data.token;
    dispatch({ type: SUPER_ADMIN_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/superadmin/home");
    else navigate("/superadmin/update/password");
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const superAdminUpdatePassword = (formData, navigate) => async (dispatch) => {
  try {
    await api.superAdminUpdatePassword(formData);
    dispatch({ type: UPDATE_PASSWORD, payload: true });
    dispatch(notify("Password updated successfully", "success"));
    navigate("/superadmin/home");
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const updateSuperAdmin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateSuperAdmin(formData);
    dispatch({ type: UPDATE_SUPER_ADMIN, payload: true });
    // Reflect profile changes immediately in the header/profile UI.
    dispatch({ type: GET_ME, payload: { role: "superadmin", result: data } });
    dispatch(notify("Profile updated successfully", "success"));
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const addAdmin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.addAdmin(formData);
    const username = data?.result?.username;
    dispatch(
      notify(
        username
          ? `Admin added successfully. Username: ${username} (initial password: DOB in DD-MM-YYYY)`
          : "Admin added successfully",
        "success",
        6000
      )
    );
    dispatch({ type: ADD_ADMIN, payload: true });
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const getAdmin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getAdmin(formData);
    dispatch({ type: GET_ADMIN, payload: data });
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const deleteAdmin = (formData) => async (dispatch) => {
  try {
    await api.deleteAdmin(formData);
    dispatch(notify("Admin deleted successfully", "success"));
    dispatch({ type: DELETE_ADMIN, payload: true });
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const updateAdminStatus = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateAdminStatus(formData);
    dispatch(notify(data.message, "success"));
    dispatch({ type: UPDATE_ADMIN_STATUS, payload: true });
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const editAdmin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.editAdmin(formData);
    dispatch(notify(data.message, "success"));
    dispatch({ type: EDIT_ADMIN, payload: true });
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const addDepartment = (formData) => async (dispatch) => {
  try {
    await api.addDepartment(formData);
    dispatch(notify("Department added successfully", "success"));
    dispatch({ type: ADD_DEPARTMENT, payload: true });
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const deleteDepartment = (formData) => async (dispatch) => {
  try {
    await api.deleteDepartment(formData);
    dispatch(notify("Department deleted successfully", "success"));
    dispatch({ type: DELETE_DEPARTMENT, payload: true });
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const editDepartment = (formData) => async (dispatch) => {
  try {
    const { data } = await api.editDepartment(formData);
    dispatch(notify(data.message, "success"));
    dispatch({ type: EDIT_DEPARTMENT, payload: true });
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const updateDepartmentStatus = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateDepartmentStatus(formData);
    dispatch(notify(data.message, "success"));
    dispatch({ type: UPDATE_DEPARTMENT_STATUS, payload: true });
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const getUnassignedAdmins = () => async (dispatch) => {
  try {
    const { data } = await api.getUnassignedAdmins();
    dispatch({ type: GET_UNASSIGNED_ADMINS, payload: data.result });
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

export const getSuperAdminAllDepartment = () => async (dispatch) => {
  try {
    const { data } = await api.getSuperAdminAllDepartment();
    dispatch({ type: GET_SUPER_ADMIN_DEPARTMENTS, payload: data });
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response?.data || { backendError: "Something went wrong. Please try again." },
    });
  }
};

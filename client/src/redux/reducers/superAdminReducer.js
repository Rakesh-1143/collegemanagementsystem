import {
  SUPER_ADMIN_LOGIN,
  UPDATE_SUPER_ADMIN,
  UPDATE_PASSWORD,
  GET_ME,
  LOGOUT,
  ADD_ADMIN,
  GET_ADMIN,
  DELETE_ADMIN,
  UPDATE_ADMIN_STATUS,
  EDIT_ADMIN,
  ADD_DEPARTMENT,
  DELETE_DEPARTMENT,
  EDIT_DEPARTMENT,
  UPDATE_DEPARTMENT_STATUS,
  GET_UNASSIGNED_ADMINS,
  GET_SUPER_ADMIN_DEPARTMENTS,
} from "../actionTypes";

const initialState = {
  authData: null,
  sessionRestored: false,
  updatedPassword: false,
  updatedSuperAdmin: false,
  adminAdded: false,
  adminDeleted: false,
  adminStatusUpdated: false,
  adminEdited: false,
  admins: [],
  departmentAdded: false,
  departmentDeleted: false,
  departmentEdited: false,
  departmentStatusUpdated: false,
  departments: [],
  unassignedAdmins: [],
};

const superAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUPER_ADMIN_LOGIN:
      return { ...state, authData: action?.data, sessionRestored: true };
    case GET_ME:
      return {
        ...state,
        sessionRestored: true,
        authData:
          action?.payload?.role === "superadmin"
            ? { result: action.payload.result }
            : state.authData,
      };
    case LOGOUT:
      return { ...state, authData: null, sessionRestored: true };
    case UPDATE_PASSWORD:
      return {
        ...state,
        updatedPassword: action.payload,
      };
    case UPDATE_SUPER_ADMIN:
      return {
        ...state,
        updatedSuperAdmin: action.payload,
      };
    case ADD_ADMIN:
      return {
        ...state,
        adminAdded: action.payload,
      };
    case GET_ADMIN:
      return {
        ...state,
        admins: action.payload,
      };
    case DELETE_ADMIN:
      return {
        ...state,
        adminDeleted: action.payload,
      };
    case UPDATE_ADMIN_STATUS:
      return {
        ...state,
        adminStatusUpdated: action.payload,
      };
    case EDIT_ADMIN:
      return {
        ...state,
        adminEdited: action.payload,
      };
    case ADD_DEPARTMENT:
      return {
        ...state,
        departmentAdded: action.payload,
      };
    case DELETE_DEPARTMENT:
      return {
        ...state,
        departmentDeleted: action.payload,
      };
    case EDIT_DEPARTMENT:
      return {
        ...state,
        departmentEdited: action.payload,
      };
    case UPDATE_DEPARTMENT_STATUS:
      return {
        ...state,
        departmentStatusUpdated: action.payload,
      };
    case GET_SUPER_ADMIN_DEPARTMENTS:
      return {
        ...state,
        departments: action.payload,
      };
    case GET_UNASSIGNED_ADMINS:
      return {
        ...state,
        unassignedAdmins: action.payload,
      };
    default:
      return state;
  }
};

export default superAdminReducer;

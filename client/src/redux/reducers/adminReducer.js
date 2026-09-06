import {
  ADD_ADMIN,
  ADD_FACULTY,
  ADD_STUDENT,
  ADD_SUBJECT,
  ADMIN_LOGIN,
  GET_FACULTY,
  GET_SUBJECT,
  GET_ME,
  LOGOUT,
  UPDATE_ADMIN,
  GET_STUDENT,
  ADD_DEPARTMENT,
  GET_ALL_STUDENT,
  GET_ALL_SUBJECT,
  GET_ALL_FACULTY,
  GET_ALL_ADMIN,
  GET_ALL_DEPARTMENT,
  UPDATE_PASSWORD,
  GET_ADMIN,
  DELETE_ADMIN,
  DELETE_DEPARTMENT,
  DELETE_FACULTY,
  DELETE_STUDENT,
  DELETE_SUBJECT,
  CREATE_NOTICE,
  GET_NOTICE,
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
} from "../actionTypes";

const initialState = {
  authData: null,
  sessionRestored: false,
  updatedPassword: false,
  updatedAdmin: false,
  adminAdded: false,
  departmentAdded: false,
  facultyAdded: false,
  studentAdded: false,
  subjectAdded: false,
  allFaculty: [],
  allSubject: [],
  allStudent: [],
  allAdmin: [],
  allDepartment: [],
  students: [],
  faculties: [],
  subjects: [],
  admins: [],
  notices: [],
  adminDeleted: false,
  departmentDeleted: false,
  facultyDeleted: false,
  studentDeleted: false,
  subjectDeleted: false,
  noticeCreated: false,
  branches: [],
  courses: [],
  branchAdded: false,
  branchDeleted: false,
  branchUpdated: false,
  courseAdded: false,
  courseDeleted: false,
  courseUpdated: false,
  facultyUpdated: false,
  subjectsByCourse: [],
  subjectUpdated: false,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_LOGIN:
      return { ...state, authData: action?.data, sessionRestored: true };
    case GET_ME:
      return {
        ...state,
        sessionRestored: true,
        authData:
          action?.payload?.role === "admin"
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
    case UPDATE_ADMIN:
      return {
        ...state,
        updatedAdmin: action.payload,
      };
    case ADD_ADMIN:
      return {
        ...state,
        adminAdded: action.payload,
      };
    case CREATE_NOTICE:
      return {
        ...state,
        noticeCreated: action.payload,
      };
    case DELETE_ADMIN:
      return {
        ...state,
        adminDeleted: action.payload,
      };
    case DELETE_DEPARTMENT:
      return {
        ...state,
        departmentDeleted: action.payload,
      };
    case DELETE_FACULTY:
      return {
        ...state,
        facultyDeleted: action.payload,
      };
    case DELETE_STUDENT:
      return {
        ...state,
        studentDeleted: action.payload,
      };
    case DELETE_SUBJECT:
      return {
        ...state,
        subjectDeleted: action.payload,
      };
    case ADD_DEPARTMENT:
      return {
        ...state,
        departmentAdded: action.payload,
      };
    case ADD_FACULTY:
      return {
        ...state,
        facultyAdded: action.payload,
      };
    case GET_FACULTY:
      return {
        ...state,
        faculties: action.payload,
      };
    case GET_NOTICE:
      return {
        ...state,
        notices: action.payload,
      };
    case GET_ADMIN:
      return {
        ...state,
        admins: action.payload,
      };
    case GET_ALL_FACULTY:
      return {
        ...state,
        allFaculty: action.payload,
      };
    case GET_ALL_ADMIN:
      return {
        ...state,
        allAdmin: action.payload,
      };
    case GET_ALL_STUDENT:
      return {
        ...state,
        allStudent: action.payload,
      };
    case GET_ALL_DEPARTMENT:
      return {
        ...state,
        allDepartment: action.payload,
      };
    case ADD_SUBJECT:
      return {
        ...state,
        subjectAdded: action.payload,
      };
    case GET_SUBJECT:
      return {
        ...state,
        subjects: action.payload,
      };
    case GET_ALL_SUBJECT:
      return {
        ...state,
        allSubject: action.payload,
      };
    case ADD_STUDENT:
      return {
        ...state,
        studentAdded: action.payload,
      };
    case GET_STUDENT:
      return {
        ...state,
        students: action.payload,
      };
    case ADD_BRANCH:
      return { ...state, branchAdded: action.payload };
    case GET_BRANCHES:
      return { ...state, branches: action.payload };
    case UPDATE_BRANCH:
      return { ...state, branchUpdated: action.payload };
    case DELETE_BRANCH:
      return { ...state, branchDeleted: action.payload };
    case ADD_COURSE:
      return { ...state, courseAdded: action.payload };
    case GET_COURSES:
      return { ...state, courses: action.payload };
    case UPDATE_COURSE:
      return { ...state, courseUpdated: action.payload };
    case DELETE_COURSE:
      return { ...state, courseDeleted: action.payload };
    case UPDATE_FACULTY:
      return { ...state, facultyUpdated: action.payload };
    case GET_SUBJECTS_BY_COURSE:
      return { ...state, subjectsByCourse: action.payload };
    case "UPDATE_SUBJECT":
      return { ...state, subjectUpdated: action.payload };
    default:
      return state;
  }
};

export default adminReducer;
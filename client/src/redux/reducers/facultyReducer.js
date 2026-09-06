import {
  ADD_TEST,
  ATTENDANCE_MARKED,
  FACULTY_LOGIN,
  GET_TEST,
  GET_ME,
  LOGOUT,
  MARKS_UPLOADED,
  UPDATE_FACULTY,
  UPDATE_PASSWORD,
  GET_MY_SUBJECTS,
  GET_MY_STUDENTS,
} from "../actionTypes";

const initialState = {
  authData: null,
  sessionRestored: false,
  updatedPassword: false,
  updatedFaculty: false,
  testAdded: false,
  marksUploaded: false,
  attendanceUploaded: false,
  tests: [],
  mySubjects: [],
  myStudents: [],
};

const facultyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FACULTY_LOGIN:
      return { ...state, authData: action?.data, sessionRestored: true };
    case GET_ME:
      return {
        ...state,
        sessionRestored: true,
        authData:
          action?.payload?.role === "faculty"
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
    case UPDATE_FACULTY:
      return {
        ...state,
        updatedFaculty: action.payload,
      };
    case ADD_TEST:
      return {
        ...state,
        testAdded: action.payload,
      };
    case GET_TEST:
      return {
        ...state,
        tests: action.payload,
      };
    case GET_MY_SUBJECTS:
      return {
        ...state,
        mySubjects: action.payload,
      };
    case GET_MY_STUDENTS:
      return {
        ...state,
        myStudents: action.payload,
      };
    case MARKS_UPLOADED:
      return {
        ...state,
        marksUploaded: action.payload,
      };
    case ATTENDANCE_MARKED:
      return {
        ...state,
        attendanceUploaded: action.payload,
      };

    default:
      return state;
  }
};

export default facultyReducer;
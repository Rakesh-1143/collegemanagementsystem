import {
  LOGOUT,
  STUDENT_LOGIN,
  UPDATE_STUDENT,
  UPDATE_PASSWORD,
  TEST_RESULT,
  ATTENDANCE,
  GET_ME,
} from "../actionTypes";

const initialState = {
  authData: null,
  sessionRestored: false,
  updatedPassword: false,
  updatedStudent: false,
  testAdded: false,
  marksUploaded: false,
  attendanceUploaded: false,
  testResult: [],
  tests: [],
  attendance: [],
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case STUDENT_LOGIN:
      return { ...state, authData: action?.data, sessionRestored: true };
    case GET_ME:
      return {
        ...state,
        sessionRestored: true,
        authData:
          action?.payload?.role === "student"
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
    case UPDATE_STUDENT:
      return {
        ...state,
        updatedStudent: action.payload,
      };
    case TEST_RESULT:
      return {
        ...state,
        testResult: action.payload,
      };
    case ATTENDANCE:
      return {
        ...state,
        attendance: action.payload,
      };

    default:
      return state;
  }
};

export default studentReducer;
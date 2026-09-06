import { combineReducers } from "redux";
import adminReducer from "./adminReducer";
import errorReducer from "./errorReducer";
import facultyReducer from "./facultyReducer";
import studentReducer from "./studentReducer";
import notificationReducer from "./notificationReducer";
import superAdminReducer from "./superAdminReducer";

export default combineReducers({
  admin: adminReducer,
  superAdmin: superAdminReducer,
  errors: errorReducer,
  faculty: facultyReducer,
  student: studentReducer,
  notifications: notificationReducer,
});

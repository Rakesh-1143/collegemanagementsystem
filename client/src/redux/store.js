import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers";
import { thunk } from "redux-thunk";

// Single app store. Exported so non-React code (e.g. the axios 401
// interceptor in redux/api/index.js) can dispatch session-level actions.
const store = createStore(reducers, compose(applyMiddleware(thunk)));

export default store;

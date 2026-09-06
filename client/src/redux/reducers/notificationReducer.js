import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from "../actionTypes";

const initialState = { queue: [] };

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return { queue: [...state.queue, action.payload] };
    case HIDE_NOTIFICATION:
      return { queue: state.queue.filter((n) => n.id !== action.payload) };
    default:
      return state;
  }
};

export default notificationReducer;
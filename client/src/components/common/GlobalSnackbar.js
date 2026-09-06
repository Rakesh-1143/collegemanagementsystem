import React from "react";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { HIDE_NOTIFICATION } from "../../redux/actionTypes";

const GlobalSnackbar = () => {
  const queue = useSelector((state) => state.notifications?.queue || []);
  const dispatch = useDispatch();
  const current = queue[0] || null;
  const close = () => {
    if (current) dispatch({ type: HIDE_NOTIFICATION, payload: current.id });
  };

  return (
    <Snackbar
      open={!!current}
      autoHideDuration={4000}
      onClose={close}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={Slide}>
      <Alert
        severity={current?.severity || "info"}
        variant="filled"
        onClose={close}
        sx={{ width: "100%", fontWeight: 500, borderRadius: 2 }}>
        {current?.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
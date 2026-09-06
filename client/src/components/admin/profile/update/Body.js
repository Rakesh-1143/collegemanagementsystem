import React, { useEffect, useState } from "react";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import FileBase from "../../../../utils/FileBase";
import { useDispatch, useSelector } from "react-redux";
import { updateAdmin } from "../../../../redux/actions/adminActions";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Spinner from "../../../../utils/Spinner";
import { SET_ERRORS, UPDATE_ADMIN } from "../../../../redux/actionTypes";
import { notify } from "../../../../redux/actions/notificationActions";
import * as classes from "../../../../utils/styles";

const Body = () => {
  const user = useSelector((state) => state.admin.authData);
  const result = user?.result || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errors = useSelector((state) => state.errors);
  const updatedAdmin = useSelector((state) => state.admin.updatedAdmin);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: result.email,
    department: "",
    contactNumber: "",
    avatar: "",
  });

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    if (
      value.name === "" &&
      value.dob === "" &&
      value.department === "" &&
      value.contactNumber === "" &&
      value.avatar === ""
    ) {
      dispatch(notify("Enter at least one value to update", "warning"));
      setLoading(false);
    } else {
      dispatch(updateAdmin(value));
    }
  };

  useEffect(() => {
    if (errors || updatedAdmin) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [errors, updatedAdmin]);

  // Reset the success flag so the next submit can trigger the spinner again.
  useEffect(() => {
    if (updatedAdmin) {
      dispatch({ type: UPDATE_ADMIN, payload: false });
    }
  }, [updatedAdmin, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex  items-center justify-between mr-8">
          <div className="flex space-x-2 text-slate-400">
            <SecurityUpdateIcon />
            <h1>Update</h1>
          </div>

          <div
            onClick={() => navigate("/admin/update/password")}
            className="flex space-x-2 cursor-pointer">
            <VisibilityOffIcon />
            <h1 className="font-bold">Password</h1>
          </div>
        </div>

        <div className="bg-white flex flex-col rounded-xl lg:mr-10 ">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Name :</h1>
                  <input
                    placeholder={result?.name}
                    className={classes.adminInput}
                    type="text"
                    value={value.name}
                    onChange={(e) =>
                      setValue({ ...value, name: e.target.value })
                    }
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>DOB :</h1>
                  <input
                    placeholder={result?.dob}
                    className={classes.adminInput}
                    type="text"
                    value={value.dob}
                    onChange={(e) =>
                      setValue({ ...value, dob: e.target.value })
                    }
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Email :</h1>
                  <input
                    placeholder={result?.email}
                    disabled
                    className={classes.adminInput}
                    type="text"
                  />
                </div>
              </div>

              <div className={classes.adminForm2r}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Department :</h1>
                  <Select
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.department}
                    onChange={(e) =>
                      setValue({ ...value, department: e.target.value })
                    }>
                    <MenuItem value="">None</MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>
                        {dp.department}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Contact Number :</h1>
                  <input
                    placeholder={result?.contactNumber}
                    className={classes.adminInput}
                    type="text"
                    value={value.contactNumber}
                    onChange={(e) =>
                      setValue({ ...value, contactNumber: e.target.value })
                    }
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Avatar :</h1>
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) =>
                      setValue({ ...value, avatar: base64 })
                    }
                  />
                </div>
              </div>
            </div>

            <div className={classes.adminFormButton}>
              <button className={classes.adminFormSubmitButton} type="submit">
                Submit
              </button>

              <button
                onClick={() => navigate("/admin/profile")}
                className={classes.adminFormClearButton}
                type="button">
                Cancel
              </button>
            </div>

            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Updating"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {error.backendError && (
                <p className="text-red-500">{error.backendError}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
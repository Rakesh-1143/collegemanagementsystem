import React, { useEffect, useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "../../../utils/FileBase";
import { addAdmin } from "../../../redux/actions/superAdminActions";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { ADD_ADMIN, SET_ERRORS } from "../../../redux/actionTypes";
import PageHeader from "../../common/PageHeader";

const Body = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);
  const adminAdded = useSelector((state) => state.superAdmin.adminAdded);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: "",
    contactNumber: "",
    avatar: "",
    joiningYear: Date().split(" ")[3],
  });
  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setValue({ ...value, email: "" });
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addAdmin(value));
  };

  useEffect(() => {
    if (errors || adminAdded) {
      setLoading(false);
      if (adminAdded) {
        setValue({
          name: "",
          dob: "",
          email: "",
          contactNumber: "",
          avatar: "",
          joiningYear: Date().split(" ")[3],
          password: "",
          username: "",
        });
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_ADMIN, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [errors, adminAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <PageHeader icon={EngineeringIcon} title="Add Admin" subtitle="Create a new administrator account" />
        <div className="bg-white flex flex-col rounded-xl lg:mr-10 ">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Name :</h1>

                  <input
                    placeholder="Full Name"
                    required
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
                    placeholder="DD/MM/YYYY"
                    className={classes.adminInput}
                    required
                    type="date"
                    value={value.dob}
                    onChange={(e) =>
                      setValue({ ...value, dob: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Email :</h1>

                  <input
                    placeholder="Email"
                    required
                    className={classes.adminInput}
                    type="email"
                    value={value.email}
                    onChange={(e) =>
                      setValue({ ...value, email: e.target.value })
                    }
                  />
                </div>
              </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Contact Number :</h1>

                  <input
                    required
                    placeholder="Contact Number"
                    className={classes.adminInput}
                    type="number"
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
                onClick={() => {
                  setValue({
                    name: "",
                    dob: "",
                    email: "",
                    contactNumber: "",
                    avatar: "",
                    joiningYear: Date().split(" ")[3],
                    password: "",
                    username: "",
                  });
                  setError({});
                }}
                className={classes.adminFormClearButton}
                type="button">
                Clear
              </button>
            </div>
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Adding Admin"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.emailError || error.backendError) && (
                <p className="text-red-500">
                  {error.emailError || error.backendError}
                </p>
              )}
            </div>
            <p className="px-6 pb-4 text-sm text-slate-500">
              The username is auto-generated (e.g. ADM2026UN001 if unassigned). The initial
              password is the date of birth in DD-MM-YYYY format, and the new
              admin is asked to change it on first login.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;

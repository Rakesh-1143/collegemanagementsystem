import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { addDepartment } from "../../../redux/actions/superAdminActions";
import Spinner from "../../../utils/Spinner";
import { ADD_DEPARTMENT, SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";
import PageHeader from "../../common/PageHeader";

const Body = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState("");
  const [adminId, setAdminId] = useState("");
  const errors = useSelector((state) => state.errors);
  const departmentAdded = useSelector((state) => state.superAdmin.departmentAdded);
  const unassignedAdmins = useSelector((state) => state.superAdmin.unassignedAdmins);
  const [error, setError] = useState({});

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminId) {
      setError({ departmentError: "Please select an assigned admin" });
      return;
    }
    setError({});
    setLoading(true);
    dispatch(addDepartment({ department, adminId }));
  };

  useEffect(() => {
    if (errors || departmentAdded) {
      setLoading(false);
      if (departmentAdded) {
        setDepartment("");
        setAdminId("");
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_DEPARTMENT, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [errors, departmentAdded, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <PageHeader
          icon={AddIcon}
          title="Add Department"
          subtitle="Create a new academic department and assign its admin"
        />
        <div className="bg-white flex flex-col rounded-xl lg:mr-10 p-5">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Department Name :</h1>
                  <input
                    placeholder="Department"
                    required
                    className={classes.adminInput}
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>
              <div className={classes.adminForm2r}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Assign Admin :</h1>
                  {unassignedAdmins?.length > 0 ? (
                    <select
                      required
                      className={classes.adminInput}
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                    >
                      <option value="">Select an Admin</option>
                      {unassignedAdmins.map((admin) => (
                        <option key={admin._id} value={admin._id}>
                          {admin.name} ({admin.username})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-red-500 text-sm mt-2">
                      All Admins are already assigned. Please create a new Admin first.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={classes.adminFormButton}>
              <button 
                className={classes.adminFormSubmitButton} 
                type="submit"
                disabled={!unassignedAdmins?.length}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setDepartment("");
                  setAdminId("");
                }}
                className={classes.adminFormClearButton}
                type="button"
              >
                Clear
              </button>
            </div>
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Adding Department"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.departmentError || error.backendError) && (
                <p className="text-red-500">
                  {error.departmentError || error.backendError}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;

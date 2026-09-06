import React, { useEffect, useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useDispatch, useSelector } from "react-redux";
import { createNotice } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { CREATE_NOTICE, SET_ERRORS } from "../../../redux/actionTypes";
import PageHeader from "../../common/PageHeader";

const Body = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);
  const noticeCreated = useSelector((state) => state.admin.noticeCreated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    date: "",
    noticeFor: "",
    topic: "",
    content: "",
    from: "",
  });
  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setValue({ date: "", noticeFor: "", topic: "", content: "", from: "" });
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(createNotice(value));
  };

  useEffect(() => {
    if (errors || noticeCreated) {
      setLoading(false);
      if (noticeCreated) {
        setValue({
          date: "",
          noticeFor: "",
          topic: "",
          content: "",
          from: "",
        });
        dispatch({ type: CREATE_NOTICE, payload: false });
        dispatch({ type: SET_ERRORS, payload: {} });
      }
    } else {
      setLoading(true);
    }
  }, [errors, noticeCreated]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <PageHeader
          icon={EngineeringIcon}
          title="Create Notice"
          subtitle="Publish a notice to faculty or students"
        />
        <div className="bg-white flex flex-col rounded-xl lg:mr-10 ">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Date :</h1>

                  <input
                    placeholder="Date"
                    required
                    className={classes.adminInput}
                    type="date"
                    value={value.date}
                    onChange={(e) =>
                      setValue({ ...value, date: e.target.value })
                    }
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Topic :</h1>

                  <input
                    required
                    placeholder="Topic"
                    className={classes.adminInput}
                    type="text"
                    value={value.topic}
                    onChange={(e) =>
                      setValue({ ...value, topic: e.target.value })
                    }
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>To :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.noticeFor}
                    onChange={(e) =>
                      setValue({ ...value, noticeFor: e.target.value })
                    }>
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="faculty">Faculty</MenuItem>
                    <MenuItem value="student">Student</MenuItem>
                  </Select>
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>From :</h1>

                  <input
                    required
                    placeholder="From"
                    className={classes.adminInput}
                    type="text"
                    value={value.from}
                    onChange={(e) =>
                      setValue({ ...value, from: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className={classes.adminForm2r}>
                <div className={classes.adminForm3}>
                  <h1 className={`self-start  ${classes.adminLabel}`}>
                    Content :
                  </h1>

                  <textarea
                    rows={10}
                    cols={40}
                    required
                    placeholder="Content...."
                    className={classes.adminInput}
                    value={value.content}
                    onChange={(e) =>
                      setValue({ ...value, content: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}></div>
              </div>
            </div>
            <div className={classes.adminFormButton}>
              <button className={classes.adminFormSubmitButton} type="submit">
                Submit
              </button>
              <button
                onClick={() => {
                  setValue({
                    date: "",
                    noticeFor: "",
                    topic: "",
                    content: "",
                    from: "",
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
                  message="Creating Notice"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.noticeError || error.backendError) && (
                <p className="text-red-500">
                  {error.noticeError || error.backendError}
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

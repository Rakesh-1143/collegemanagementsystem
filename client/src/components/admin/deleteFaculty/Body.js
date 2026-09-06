import React, { useEffect, useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { deleteFaculty, getFaculty } from "../../../redux/actions/adminActions";
import { DELETE_FACULTY, SET_ERRORS } from "../../../redux/actionTypes";
import { notify } from "../../../redux/actions/notificationActions";
import * as classes from "../../../utils/styles";
import PageHeader from "../../common/PageHeader";
import DataTable from "../../common/DataTable";
import ConfirmDialog from "../../common/ConfirmDialog";

const Body = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const errors = useSelector((state) => state.errors);
  const facultyDeleted = useSelector((state) => state.admin.facultyDeleted);
  const faculties = useSelector((state) => state.admin.faculties.result);
  const [department, setDepartment] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
      setDeleting(false);
      setConfirmOpen(false);
    }
  }, [errors]);

  useEffect(() => {
    if (faculties) setLoading(false);
  }, [faculties]);

  useEffect(() => {
    if (facultyDeleted) {
      setDeleting(false);
      setConfirmOpen(false);
      setSelected([]);
      dispatch({ type: DELETE_FACULTY, payload: false });
      if (department) dispatch(getFaculty({ department }));
    }
  }, [facultyDeleted]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
    setLoading(true);
    dispatch(getFaculty({ department: "" }));
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    setSelected([]);
    dispatch(getFaculty({ department }));
  };

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const confirmDelete = () => {
    if (selected.length === 0) {
      dispatch(notify("Select at least one faculty member to delete", "warning"));
      return;
    }
    setConfirmOpen(true);
  };

  const columns = [
    { key: "select", label: "Select", sortable: false },
    { key: "_index", label: "Sr", numeric: true, sortable: false },
    { key: "name", label: "Name" },
    { key: "username", label: "Username" },
    { key: "designation", label: "Designation" },
    { key: "email", label: "Email" },
  ];

  return (
    <div className="w-full space-y-5">
      <PageHeader
        icon={EngineeringIcon}
        title="Remove Faculty"
        subtitle="Select faculty members to permanently delete"
      />

      <form
        onSubmit={handleSubmit}
        className={`${classes.filterPanel} grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4`}>
        <div className={classes.filterField}>
          <label className={classes.filterLabel}>Department</label>
          <Select
            displayEmpty
            size="small"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {departments?.map((dp) => (
              <MenuItem key={dp._id} value={dp.department}>
                {dp.department}
              </MenuItem>
            ))}
          </Select>
        </div>
        <button type="submit" className={classes.adminFormSubmitButton}>
          Search
        </button>
      </form>

      {error.noFacultyError || error.backendError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error.noFacultyError || error.backendError}
        </div>
      ) : (
        <div className="space-y-3">
          <DataTable
            columns={columns}
            rows={faculties || []}
            loading={loading}
            emptyTitle="No faculty found"
            emptyHint="Select a department, then press Search."
            renderCell={(row, col, index) => {
              if (col.key === "select")
                return (
                  <Checkbox
                    size="small"
                    checked={selected.includes(row._id)}
                    onChange={() => toggle(row._id)}
                    inputProps={{ "aria-label": `Select ${row.name}` }}
                  />
                );
              if (col.key === "_index") return index + 1;
              return null;
            }}
          />
          <div className="flex flex-wrap items-center justify-end gap-3">
            <span className="text-sm font-medium text-slate-500">
              {selected.length} selected
            </span>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={selected.length === 0}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete faculty?"
        message={`This will permanently delete ${selected.length} faculty member${
          selected.length === 1 ? "" : "s"
        }. This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={() => {
          setDeleting(true);
          dispatch(deleteFaculty(selected));
        }}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Body;
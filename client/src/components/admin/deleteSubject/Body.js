import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { deleteSubject, getSubject } from "../../../redux/actions/adminActions";
import { DELETE_SUBJECT, SET_ERRORS } from "../../../redux/actionTypes";
import { notify } from "../../../redux/actions/notificationActions";
import * as classes from "../../../utils/styles";
import PageHeader from "../../common/PageHeader";
import DataTable from "../../common/DataTable";
import ConfirmDialog from "../../common/ConfirmDialog";

const Body = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const errors = useSelector((state) => state.errors);
  const subjectDeleted = useSelector((state) => state.admin.subjectDeleted);
  const subjects = useSelector((state) => state.admin.subjects.result);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [value, setValue] = useState({ department: "", year: "" });

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
      setDeleting(false);
      setConfirmOpen(false);
    }
  }, [errors]);

  useEffect(() => {
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  useEffect(() => {
    if (subjectDeleted) {
      setDeleting(false);
      setConfirmOpen(false);
      setSelected([]);
      dispatch({ type: DELETE_SUBJECT, payload: false });
      if (value.department && value.year) dispatch(getSubject(value));
    }
  }, [subjectDeleted]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    setSelected([]);
    dispatch(getSubject(value));
  };

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const confirmDelete = () => {
    if (selected.length === 0) {
      dispatch(notify("Select at least one subject to delete", "warning"));
      return;
    }
    setConfirmOpen(true);
  };

  const columns = [
    { key: "select", label: "Select", sortable: false },
    { key: "_index", label: "Sr", numeric: true, sortable: false },
    { key: "subjectCode", label: "Subject Code" },
    { key: "subjectName", label: "Subject Name" },
    { key: "department", label: "Department" },
    { key: "year", label: "Year" },
  ];

  return (
    <div className="w-full space-y-5">
      <PageHeader
        icon={MenuBookIcon}
        title="Remove Subjects"
        subtitle="Select subjects to permanently delete"
      />

      <form
        onSubmit={handleSubmit}
        className={`${classes.filterPanel} grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4`}>
        <div className={classes.filterField}>
          <label className={classes.filterLabel}>Department</label>
          <Select
            required
            displayEmpty
            size="small"
            value={value.department}
            onChange={(e) => setValue({ ...value, department: e.target.value })}>
            <MenuItem value="">None</MenuItem>
            {departments?.map((dp) => (
              <MenuItem key={dp._id} value={dp.department}>
                {dp.department}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.filterField}>
          <label className={classes.filterLabel}>Year</label>
          <Select
            required
            displayEmpty
            size="small"
            value={value.year}
            onChange={(e) => setValue({ ...value, year: e.target.value })}>
            <MenuItem value="">None</MenuItem>
            {[1, 2, 3, 4].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </div>
        <button type="submit" className={classes.adminFormSubmitButton}>
          Search
        </button>
      </form>

      {error.noSubjectError || error.backendError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error.noSubjectError || error.backendError}
        </div>
      ) : (
        <div className="space-y-3">
          <DataTable
            columns={columns}
            rows={subjects || []}
            loading={loading}
            emptyTitle="No subjects found"
            emptyHint="Select a department and year, then press Search."
            renderCell={(row, col, index) => {
              if (col.key === "select")
                return (
                  <Checkbox
                    size="small"
                    checked={selected.includes(row._id)}
                    onChange={() => toggle(row._id)}
                    inputProps={{ "aria-label": `Select ${row.subjectName}` }}
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
        title="Delete subjects?"
        message={`This will permanently delete ${selected.length} subject${
          selected.length === 1 ? "" : "s"
        }. This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={() => {
          setDeleting(true);
          dispatch(deleteSubject(selected));
        }}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Body;
import React, { useEffect, useMemo, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputAdornment, MenuItem, Select, TextField, Switch, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getSubject, getBranches, getCourses, updateSubject, deleteSubject } from "../../../redux/actions/adminActions";
import { SET_ERRORS, UPDATE_SUBJECT, DELETE_SUBJECT } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";
import PageHeader from "../../common/PageHeader";
import DataTable from "../../common/DataTable";

const Body = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const branches = useSelector((state) => state.admin.branches);
  const courses = useSelector((state) => state.admin.courses);
  const errors = useSelector((state) => state.errors);
  const subjects = useSelector((state) => state.admin.subjects.result);
  const subjectUpdated = useSelector((state) => state.admin.subjectUpdated);
  const subjectDeleted = useSelector((state) => state.admin.subjectDeleted);

  const [query, setQuery] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Filter state
  const [value, setValue] = useState({ department: "", year: "", branch: "", course: "" });

  // Edit Dialog State
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    dispatch(getBranches());
    dispatch(getCourses());
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
    }
  }, [errors]);

  useEffect(() => {
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  // Refresh subjects after update/delete
  useEffect(() => {
    if (subjectUpdated || subjectDeleted) {
      setEditOpen(false);
      if (value.department && value.year) {
        dispatch(getSubject(value));
      }
      dispatch({ type: UPDATE_SUBJECT, payload: false });
      dispatch({ type: DELETE_SUBJECT, payload: false });
    }
  }, [subjectUpdated, subjectDeleted, dispatch, value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    dispatch(getSubject(value));
  };

  const handleEditOpen = (subject) => {
    setEditData({
      _id: subject._id,
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      totalLectures: subject.totalLectures,
      isActive: subject.isActive !== false, // default true
      branch: subject.branch?._id || "",
      course: subject.course?._id || ""
    });
    setEditOpen(true);
  };

  const handleEditSubmit = () => {
    dispatch(updateSubject(editData));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      dispatch(deleteSubject([id])); // deleteSubject expects an array of ids
    }
  };

  const handleToggleStatus = (subject) => {
    dispatch(updateSubject({ _id: subject._id, isActive: subject.isActive === false ? true : false }));
  };

  const filtered = useMemo(() => {
    if (!subjects) return [];
    const q = query.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) =>
      [s.subjectCode, s.subjectName, s.department].some((v) =>
        String(v || "").toLowerCase().includes(q)
      )
    );
  }, [subjects, query]);

  const columns = [
    { key: "_index", label: "Sr", numeric: true, sortable: false },
    { key: "subjectCode", label: "Subject Code" },
    { key: "subjectName", label: "Subject Name" },
    { key: "department", label: "Department" },
    { key: "branch", label: "Branch" },
    { key: "course", label: "Course" },
    { key: "year", label: "Year" },
    { key: "totalLectures", label: "Total Lectures", numeric: true },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="w-full space-y-5">
      <PageHeader
        icon={MenuBookIcon}
        title="Subjects"
        subtitle="Manage academic subjects"
      />

      <form
        onSubmit={handleSubmit}
        className={`${classes.filterPanel} grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-5`}>
        <div className={classes.filterField}>
          <label className={classes.filterLabel}>Department</label>
          <Select
            required
            displayEmpty
            size="small"
            value={value.department}
            onChange={(e) => setValue({ ...value, department: e.target.value, branch: "", course: "" })}>
            <MenuItem value="">None</MenuItem>
            {departments?.map((dp) => (
              <MenuItem key={dp._id} value={dp.department}>
                {dp.department}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.filterField}>
          <label className={classes.filterLabel}>Branch</label>
          <Select
            displayEmpty
            size="small"
            value={value.branch}
            onChange={(e) => setValue({ ...value, branch: e.target.value, course: "" })}>
            <MenuItem value="">All Branches</MenuItem>
            {branches?.map((br) => (
              <MenuItem key={br._id} value={br._id}>
                {br.branchName}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.filterField}>
          <label className={classes.filterLabel}>Course</label>
          <Select
            displayEmpty
            size="small"
            value={value.course}
            disabled={!value.branch}
            onChange={(e) => setValue({ ...value, course: e.target.value })}>
            <MenuItem value="">All Courses</MenuItem>
            {courses?.filter(c => c.branch?._id === value.branch || c.branch === value.branch).map((co) => (
              <MenuItem key={co._id} value={co._id}>
                {co.courseName}
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
          <TextField
            size="small"
            placeholder="Search by code, name or department…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <DataTable
            columns={columns}
            rows={filtered}
            loading={loading}
            emptyTitle={query ? "No matches" : "No subjects found"}
            emptyHint={
              query
                ? "Try a different search term."
                : "Select filters and press Search."
            }
            renderCell={(row, col, index) => {
              if (col.key === "_index") return index + 1;
              if (col.key === "branch") return row.branch?.branchName || "-";
              if (col.key === "course") return row.course?.courseName || "-";
              if (col.key === "status") {
                return (
                  <Switch
                    checked={row.isActive !== false}
                    onChange={() => handleToggleStatus(row)}
                    color="primary"
                    size="small"
                  />
                );
              }
              if (col.key === "actions") {
                return (
                  <div className="flex space-x-2">
                    <IconButton size="small" onClick={() => handleEditOpen(row)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(row._id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                );
              }
              return null;
            }}
          />
        </div>
      )}

      {/* Edit Subject Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Subject</DialogTitle>
        <DialogContent dividers className="space-y-4">
          <TextField
            label="Subject Name"
            fullWidth
            size="small"
            value={editData.subjectName || ""}
            onChange={(e) => setEditData({ ...editData, subjectName: e.target.value })}
          />
          <TextField
            label="Subject Code"
            fullWidth
            size="small"
            value={editData.subjectCode || ""}
            onChange={(e) => setEditData({ ...editData, subjectCode: e.target.value })}
          />
          <TextField
            label="Total Lectures"
            type="number"
            fullWidth
            size="small"
            value={editData.totalLectures || ""}
            onChange={(e) => setEditData({ ...editData, totalLectures: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <Select
              fullWidth
              size="small"
              value={editData.branch}
              onChange={(e) => setEditData({ ...editData, branch: e.target.value, course: "" })}>
              <MenuItem value="">None</MenuItem>
              {branches?.map((br) => (
                <MenuItem key={br._id} value={br._id}>{br.branchName}</MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <Select
              fullWidth
              size="small"
              value={editData.course}
              disabled={!editData.branch}
              onChange={(e) => setEditData({ ...editData, course: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              {courses?.filter(c => c.branch?._id === editData.branch || c.branch === editData.branch).map((co) => (
                <MenuItem key={co._id} value={co._id}>{co.courseName}</MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Active:</span>
            <Switch
              checked={editData.isActive}
              onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
              color="primary"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Body;
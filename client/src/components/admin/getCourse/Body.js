import React, { useEffect, useMemo, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SET_ERRORS } from "../../../redux/actionTypes";
import { deleteCourse, getCourses, updateCourse, getBranches } from "../../../redux/actions/adminActions";
import { Select, MenuItem } from "@mui/material";
import PageHeader from "../../common/PageHeader";
import DataTable from "../../common/DataTable";

const Body = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);
  const courses = useSelector((state) => state.admin.courses);
  const branches = useSelector((state) => state.admin.branches);
  const courseDeleted = useSelector((state) => state.admin.courseDeleted);
  const courseUpdated = useSelector((state) => state.admin.courseUpdated);
  const [query, setQuery] = useState("");
  const [error, setError] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalType, setModalType] = useState("");
  const [editForm, setEditForm] = useState({ courseName: "", courseCode: "", courseType: "", duration: "", branchId: "" });
  const [filterBranch, setFilterBranch] = useState("");

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
    }
  }, [errors]);

  useEffect(() => {
    if (courseDeleted) {
      dispatch(getCourses());
      dispatch({ type: "DELETE_COURSE", payload: false });
    }
  }, [courseDeleted, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
    dispatch(getBranches());
  }, [dispatch]);

  useEffect(() => {
    if (courseUpdated) {
      dispatch(getCourses());
      dispatch({ type: "UPDATE_COURSE", payload: false });
      setModalType("");
    }
  }, [courseUpdated, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      dispatch(deleteCourse(id));
    }
  };

  const handleToggleStatus = (course) => {
    if (window.confirm(`Are you sure you want to ${course.isActive ? "deactivate" : "activate"} this course?`)) {
      dispatch(updateCourse({ _id: course._id, isActive: !course.isActive }));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCourse({ _id: selectedCourse._id, ...editForm }));
  };

  const filtered = useMemo(() => {
    if (!courses) return [];
    const q = query.trim().toLowerCase();
    
    return courses.filter((c) => {
      const matchesBranch = filterBranch ? c.branch?._id === filterBranch : true;
      const matchesQuery = q ? [c.courseCode, c.courseName, c.branch?.branchName].some((v) =>
        String(v || "").toLowerCase().includes(q)
      ) : true;
      return matchesBranch && matchesQuery;
    });
  }, [courses, query, filterBranch]);

  const columns = [
    { key: "_index", label: "Sr", numeric: true, sortable: false },
    { key: "courseCode", label: "Code" },
    { key: "courseName", label: "Course Name" },
    { key: "branch", label: "Branch" },
    { key: "courseType", label: "Type" },
    { key: "duration", label: "Duration" },
    { key: "isActive", label: "Status" },
    { key: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="w-full space-y-5">
      <PageHeader
        icon={MenuBookIcon}
        title="Courses"
        subtitle="Manage courses within your branches"
      />

      {error.backendError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error.backendError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <TextField
          size="small"
          placeholder="Search courses..."
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
        <div className="w-48 flex-shrink-0">
          <Select
            displayEmpty
            size="small"
            fullWidth
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="bg-white"
          >
            <MenuItem value="">All Branches</MenuItem>
            {branches?.map((br) => (
              <MenuItem key={br._id} value={br._id}>
                {br.branchName}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="space-y-3">
        <DataTable
          columns={columns}
          rows={filtered}
          loading={!courses}
          emptyTitle={query ? "No matches" : "No courses found"}
          emptyHint={
            query
              ? "Try a different search term."
              : "You haven't added any courses yet."
          }
          renderCell={(row, col, index) => {
            if (col.key === "_index") return index + 1;
            if (col.key === "branch") return row.branch?.branchName;
            if (col.key === "isActive") return row.isActive ? "Active" : "Inactive";
            if (col.key === "actions") {
              return (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedCourse(row); setModalType("view"); }}
                    className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => { 
                      setSelectedCourse(row); 
                      setEditForm({ courseName: row.courseName, courseCode: row.courseCode, courseType: row.courseType, duration: row.duration, branchId: row.branch?._id });
                      setModalType("edit"); 
                    }}
                    className="px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(row)}
                    className={`px-2 py-1 text-xs font-semibold text-white rounded transition-colors ${row.isActive ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}`}
                  >
                    {row.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(row._id)}
                    className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              );
            }
            return null;
          }}
        />
      </div>

      <Dialog open={modalType !== ""} onClose={() => setModalType("")} fullWidth maxWidth="sm">
        <DialogTitle>{modalType === "view" ? "Course Details" : "Edit Course"}</DialogTitle>
        <DialogContent dividers>
          {modalType === "view" && selectedCourse && (
            <div className="space-y-4">
              <div><strong className="text-gray-700">Name:</strong> {selectedCourse.courseName}</div>
              <div><strong className="text-gray-700">Code:</strong> {selectedCourse.courseCode}</div>
              <div><strong className="text-gray-700">Type:</strong> {selectedCourse.courseType}</div>
              <div><strong className="text-gray-700">Duration:</strong> {selectedCourse.duration}</div>
              <div><strong className="text-gray-700">Status:</strong> {selectedCourse.isActive ? "Active" : "Inactive"}</div>
              <div><strong className="text-gray-700">Branch:</strong> {selectedCourse.branch?.branchName}</div>
              <div><strong className="text-gray-700">Department:</strong> {selectedCourse.department?.department}</div>
            </div>
          )}
          {modalType === "edit" && selectedCourse && (
            <form id="editCourseForm" onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Name</label>
                <input required type="text" value={editForm.courseName} onChange={(e) => setEditForm({...editForm, courseName: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Code</label>
                <input required type="text" value={editForm.courseCode} onChange={(e) => setEditForm({...editForm, courseCode: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Type</label>
                <select value={editForm.courseType} onChange={(e) => setEditForm({...editForm, courseType: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm border p-2 bg-white">
                  <option value="UG">UG</option>
                  <option value="PG">PG</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (in years)</label>
                <input required type="number" step="0.5" value={editForm.duration} onChange={(e) => setEditForm({...editForm, duration: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm border p-2" />
              </div>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalType("")}>Close</Button>
          {modalType === "edit" && <Button type="submit" form="editCourseForm" variant="contained" color="primary">Save Changes</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Body;

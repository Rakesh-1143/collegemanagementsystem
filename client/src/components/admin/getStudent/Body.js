import React, { useEffect, useMemo, useState } from "react";
import BoyIcon from "@mui/icons-material/Boy";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, MenuItem, Select, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getStudent } from "../../../redux/actions/adminActions";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";
import PageHeader from "../../common/PageHeader";
import DataTable from "../../common/DataTable";

const Body = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const errors = useSelector((state) => state.errors);
  const students = useSelector((state) => state.admin.students.result);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState({ department: "", year: "" });

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
    }
  }, [errors]);

  useEffect(() => {
    if (students?.length !== 0) setLoading(false);
  }, [students]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    dispatch(getStudent(value));
  };

  const filtered = useMemo(() => {
    if (!students) return [];
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [s.name, s.username, s.email, String(s.section)].some((v) =>
        String(v || "").toLowerCase().includes(q)
      )
    );
  }, [students, query]);

  const columns = [
    { key: "_index", label: "Sr", numeric: true, sortable: false },
    { key: "name", label: "Name" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "section", label: "Section" },
    { key: "year", label: "Year", numeric: true },
    { key: "batch", label: "Batch" },
  ];

  return (
    <div className="w-full space-y-5">
      <PageHeader
        icon={BoyIcon}
        title="All Students"
        subtitle="Filter by department and year"
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

      {error.noStudentError || error.backendError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error.noStudentError || error.backendError}
        </div>
      ) : (
        <div className="space-y-3">
          <TextField
            size="small"
            placeholder="Search by name, username or email…"
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
            emptyTitle={query ? "No matches" : "No students found"}
            emptyHint={
              query
                ? "Try a different search term."
                : "Select a department and year, then press Search."
            }
            renderCell={(row, col, index) =>
              col.key === "_index" ? index + 1 : null
            }
          />
        </div>
      )}
    </div>
  );
};

export default Body;
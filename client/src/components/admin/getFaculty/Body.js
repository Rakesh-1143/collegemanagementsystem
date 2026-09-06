import React, { useEffect, useMemo, useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { getFaculty } from "../../../redux/actions/adminActions";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";
import PageHeader from "../../common/PageHeader";
import DataTable from "../../common/DataTable";

const Body = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const errors = useSelector((state) => state.errors);
  const faculties = useSelector((state) => state.admin.faculties?.result || []);
  const totalRecords = useSelector((state) => state.admin.faculties?.totalRecords || 0);
  const [department, setDepartment] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (hasSearched) {
      setLoading(true);
      dispatch(getFaculty({ department, search: debouncedQuery, page: page + 1, limit: rowsPerPage }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, page, rowsPerPage]);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
    }
  }, [errors]);

  useEffect(() => {
    if (faculties?.length !== 0) setLoading(false);
  }, [faculties]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    setPage(0);
    setHasSearched(true);
    dispatch(getFaculty({ department, search: debouncedQuery, page: 1, limit: rowsPerPage }));
  };

  const filtered = faculties || [];

  const columns = [
    { key: "_index", label: "Sr", numeric: true, sortable: false },
    { key: "name", label: "Name" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "designation", label: "Designation" },
  ];

  return (
    <div className="w-full space-y-5">
      <PageHeader
        icon={EngineeringIcon}
        title="Our Faculty"
        subtitle="Browse faculty by department"
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
            value={department}
            onChange={(e) => setDepartment(e.target.value)}>
            <MenuItem value="">None</MenuItem>
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
          <TextField
            size="small"
            placeholder="Search by name, username, email or designation…"
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
            emptyTitle={query ? "No matches" : "No faculty found"}
            emptyHint={
              query
                ? "Try a different search term."
                : "Select a department, then press Search."
            }
            renderCell={(row, col, index) =>
              col.key === "_index" ? (page * rowsPerPage) + index + 1 : null
            }
            serverSide={true}
            totalRows={totalRecords}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newRows) => setRowsPerPage(newRows)}
          />
        </div>
      )}
    </div>
  );
};

export default Body;
import React, { useEffect, useMemo, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SET_ERRORS } from "../../../redux/actionTypes";
import { deleteBranch, getBranches, updateBranch } from "../../../redux/actions/adminActions";
import PageHeader from "../../common/PageHeader";
import DataTable from "../../common/DataTable";

const Body = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);
  const branches = useSelector((state) => state.admin.branches);
  const branchDeleted = useSelector((state) => state.admin.branchDeleted);
  const branchUpdated = useSelector((state) => state.admin.branchUpdated);
  const [query, setQuery] = useState("");
  const [error, setError] = useState({});
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [modalType, setModalType] = useState("");
  const [editForm, setEditForm] = useState({ branchName: "", branchCode: "", description: "" });

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
    }
  }, [errors]);

  useEffect(() => {
    if (branchDeleted) {
      dispatch(getBranches());
      dispatch({ type: "DELETE_BRANCH", payload: false });
    }
  }, [branchDeleted, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  useEffect(() => {
    if (branchUpdated) {
      dispatch(getBranches());
      dispatch({ type: "UPDATE_BRANCH", payload: false });
      setModalType("");
    }
  }, [branchUpdated, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      dispatch(deleteBranch(id));
    }
  };

  const handleToggleStatus = (branch) => {
    if (window.confirm(`Are you sure you want to ${branch.isActive ? "deactivate" : "activate"} this branch?`)) {
      dispatch(updateBranch({ _id: branch._id, isActive: !branch.isActive }));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBranch({ _id: selectedBranch._id, ...editForm }));
  };

  const filtered = useMemo(() => {
    if (!branches) return [];
    const q = query.trim().toLowerCase();
    if (!q) return branches;
    return branches.filter((b) =>
      [b.branchCode, b.branchName, b.description].some((v) =>
        String(v || "").toLowerCase().includes(q)
      )
    );
  }, [branches, query]);

  const columns = [
    { key: "_index", label: "Sr", numeric: true, sortable: false },
    { key: "branchCode", label: "Code" },
    { key: "branchName", label: "Branch Name" },
    { key: "description", label: "Description" },
    { key: "isActive", label: "Status" },
    { key: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="w-full space-y-5">
      <PageHeader
        icon={MenuBookIcon}
        title="Branches / Specializations"
        subtitle="Manage branches within your department"
      />

      {error.backendError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error.backendError}
        </div>
      )}

      <div className="space-y-3">
        <TextField
          size="small"
          placeholder="Search branches..."
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
          loading={!branches}
          emptyTitle={query ? "No matches" : "No branches found"}
          emptyHint={
            query
              ? "Try a different search term."
              : "You haven't added any branches yet."
          }
          renderCell={(row, col, index) => {
            if (col.key === "_index") return index + 1;
            if (col.key === "isActive") return row.isActive ? "Active" : "Inactive";
            if (col.key === "actions") {
              return (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedBranch(row); setModalType("view"); }}
                    className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => { 
                      setSelectedBranch(row); 
                      setEditForm({ branchName: row.branchName, branchCode: row.branchCode, description: row.description });
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
        <DialogTitle>{modalType === "view" ? "Branch Details" : "Edit Branch"}</DialogTitle>
        <DialogContent dividers>
          {modalType === "view" && selectedBranch && (
            <div className="space-y-4">
              <div><strong className="text-gray-700">Name:</strong> {selectedBranch.branchName}</div>
              <div><strong className="text-gray-700">Code:</strong> {selectedBranch.branchCode}</div>
              <div><strong className="text-gray-700">Description:</strong> {selectedBranch.description || "N/A"}</div>
              <div><strong className="text-gray-700">Status:</strong> {selectedBranch.isActive ? "Active" : "Inactive"}</div>
              <div><strong className="text-gray-700">Department:</strong> {selectedBranch.department?.department}</div>
            </div>
          )}
          {modalType === "edit" && selectedBranch && (
            <form id="editBranchForm" onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                <input required type="text" value={editForm.branchName} onChange={(e) => setEditForm({...editForm, branchName: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Branch Code</label>
                <input required type="text" value={editForm.branchCode} onChange={(e) => setEditForm({...editForm, branchCode: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm border p-2" />
              </div>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalType("")}>Close</Button>
          {modalType === "edit" && <Button type="submit" form="editBranchForm" variant="contained" color="primary">Save Changes</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Body;

import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import {
  editDepartment,
  updateDepartmentStatus,
  deleteDepartment,
  getSuperAdminAllDepartment,
  getUnassignedAdmins,
} from "../../../redux/actions/superAdminActions";
import { SET_ERRORS, EDIT_DEPARTMENT, UPDATE_DEPARTMENT_STATUS, DELETE_DEPARTMENT } from "../../../redux/actionTypes";
import PageHeader from "../../common/PageHeader";

const Body = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.superAdmin.departments || []);
  const unassignedAdmins = useSelector((state) => state.superAdmin.unassignedAdmins || []);
  const departmentEdited = useSelector((state) => state.superAdmin.departmentEdited);
  const departmentStatusUpdated = useSelector((state) => state.superAdmin.departmentStatusUpdated);
  const departmentDeleted = useSelector((state) => state.superAdmin.departmentDeleted);

  const [editingDept, setEditingDept] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAdminId, setEditAdminId] = useState("");

  useEffect(() => {
    if (departmentEdited || departmentStatusUpdated || departmentDeleted) {
      dispatch(getSuperAdminAllDepartment());
      dispatch(getUnassignedAdmins());
      dispatch({ type: EDIT_DEPARTMENT, payload: false });
      dispatch({ type: UPDATE_DEPARTMENT_STATUS, payload: false });
      dispatch({ type: DELETE_DEPARTMENT, payload: false });
      setEditingDept(null);
    }
  }, [departmentEdited, departmentStatusUpdated, departmentDeleted, dispatch]);

  const handleEditClick = (dept) => {
    setEditingDept(dept._id);
    setEditName(dept.department);
    setEditAdminId(dept.admin ? dept.admin._id : "");
  };

  const handleSave = (id) => {
    dispatch(editDepartment({ id, department: editName, adminId: editAdminId }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      dispatch(deleteDepartment({ id }));
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    dispatch(updateDepartmentStatus({ id, isActive: !currentStatus }));
  };

  return (
    <div className="mt-3 flex-[0.8]">
      <div className="space-y-5">
        <PageHeader
          icon={MenuBookIcon}
          title="Manage Departments"
          subtitle="View, edit, and assign admins to departments"
        />

        <div className="mr-0 overflow-hidden rounded-xl bg-white shadow-sm lg:mr-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Sr no.</th>
                  <th className="px-6 py-4 font-semibold">Department Code</th>
                  <th className="px-6 py-4 font-semibold">Department Name</th>
                  <th className="px-6 py-4 font-semibold">Assigned Admin</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No departments found
                    </td>
                  </tr>
                ) : (
                  departments.map((dept, index) => (
                    <tr key={dept._id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{dept.departmentCode}</td>
                      <td className="px-6 py-4">
                        {editingDept === dept._id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="rounded border border-slate-300 p-1 text-sm"
                          />
                        ) : (
                          dept.department
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingDept === dept._id ? (
                          <select
                            value={editAdminId}
                            onChange={(e) => setEditAdminId(e.target.value)}
                            className="rounded border border-slate-300 p-1 text-sm"
                          >
                            <option value="">No Admin Assigned</option>
                            {dept.admin && (
                              <option value={dept.admin._id}>
                                {dept.admin.name} ({dept.admin.username}) - Current
                              </option>
                            )}
                            {unassignedAdmins.map((adm) => (
                              <option key={adm._id} value={adm._id}>
                                {adm.name} ({adm.username})
                              </option>
                            ))}
                          </select>
                        ) : (
                          dept.admin ? `${dept.admin.name} (${dept.admin.username})` : "None"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            dept.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {dept.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingDept === dept._id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleSave(dept._id)}
                              className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingDept(null)}
                              className="rounded bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(dept)}
                              className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleStatus(dept._id, dept.isActive)}
                              className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                            >
                              {dept.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleDelete(dept._id)}
                              className="rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;

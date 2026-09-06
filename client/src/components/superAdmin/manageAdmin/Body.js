import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdmin, updateAdminStatus } from "../../../redux/actions/superAdminActions";
import Spinner from "../../../utils/Spinner";
import DataTable from "../../common/DataTable";

const Body = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const admins = useSelector((state) => state.superAdmin.admins?.result);
  const adminStatusUpdated = useSelector((state) => state.superAdmin.adminStatusUpdated);

  useEffect(() => {
    dispatch(getAdmin({ department: "" }));
  }, [dispatch, adminStatusUpdated]);

  const handleToggleStatus = (id, currentStatus) => {
    setLoading(true);
    dispatch(updateAdminStatus({ id, isActive: !currentStatus }));
  };

  useEffect(() => {
    if (adminStatusUpdated) {
      setLoading(false);
    }
  }, [adminStatusUpdated]);

  const columns = [
    { label: "Sr no.", key: "srNo" },
    { label: "Name", key: "name" },
    { label: "Username", key: "username" },
    { label: "Email", key: "email" },
    { label: "Status", key: "status" },
    { label: "Action", key: "action", sortable: false },
  ];

  const rows =
    admins?.map((admin, idx) => ({
      _id: admin._id,
      srNo: idx + 1,
      name: admin.name,
      username: admin.username,
      email: admin.email,
      status: admin.isActive === false ? "Inactive" : "Active",
      isActive: admin.isActive !== false,
      action: "toggle",
    })) || [];

  const renderCell = (row, col) => {
    if (col.key === "status") {
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
          {row.status}
        </span>
      );
    }
    if (col.key === "action") {
      return (
        <button
          onClick={() => handleToggleStatus(row._id, row.isActive)}
          className={`rounded px-3 py-1 text-sm text-white transition-all duration-200 ${
            row.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}>
          {row.isActive ? "Deactivate" : "Activate"}
        </button>
      );
    }
    return null;
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Manage Admins</h1>
      </div>

      <div className="w-full">
        {admins?.length > 0 ? (
          <DataTable columns={columns} rows={rows} renderCell={renderCell} />
        ) : (
          <p className="text-center text-slate-500">No Admins found.</p>
        )}
      </div>
      {loading && <Spinner message="Updating status" />}
    </div>
  );
};

export default Body;

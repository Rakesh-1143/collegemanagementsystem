import React, { useEffect, useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { addBranch } from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import { ADD_BRANCH, SET_ERRORS } from "../../../redux/actionTypes";
import PageHeader from "../../common/PageHeader";

const Body = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);
  const branchAdded = useSelector((state) => state.admin.branchAdded);
  const departments = useSelector((state) => state.admin.allDepartment);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const errorRef = useRef(null);

  const adminDept = departments?.[0]?.department || "";

  const [value, setValue] = useState({
    branchName: "",
    branchCode: "",
    description: "",
    status: true,
  });

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addBranch(value));
  };

  const handleClear = () => {
    setValue({
      branchName: "",
      branchCode: "",
      description: "",
      status: true,
    });
    setError({});
  };

  useEffect(() => {
    if (errors || branchAdded) {
      setLoading(false);
      if (branchAdded) {
        handleClear();
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_BRANCH, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [errors, branchAdded, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="w-full space-y-6 pb-10">
      <PageHeader
        icon={AddIcon}
        title="Add Branch / Specialization"
        subtitle="Create a new branch for your department"
      />

      <div ref={errorRef}>
        {(error.branchError || error.backendError) && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 mb-4 text-sm font-medium text-red-700">
            {error.branchError || error.backendError}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
          
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Branch Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Department - Read Only */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Department <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  disabled
                  value={adminDept}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm outline-none bg-slate-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="hidden md:block"></div> {/* Spacer */}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Branch Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={value.branchName}
                  onChange={(e) => setValue({ ...value, branchName: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="e.g. Structural Engineering"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Branch Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={value.branchCode}
                  onChange={(e) => setValue({ ...value, branchCode: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="e.g. CE-STR"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  rows="3"
                  value={value.description}
                  onChange={(e) => setValue({ ...value, description: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all resize-none"
                  placeholder="Optional description of the branch..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Status <span className="text-red-500">*</span></label>
                <select
                  required
                  value={value.status}
                  onChange={(e) => setValue({ ...value, status: e.target.value === "true" })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

            </div>
          </div>

          <div className="p-6 sm:p-8 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3">
             <button
               type="button"
               onClick={handleClear}
               disabled={loading}
               className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none transition-all disabled:opacity-50"
             >
               Clear
             </button>
             <button
               type="submit"
               disabled={loading}
               className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 outline-none transition-all disabled:opacity-70 flex items-center justify-center gap-2 min-w-[140px]"
             >
               {loading ? <Spinner height={20} width={20} color="#fff" /> : "Create Branch"}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Body;

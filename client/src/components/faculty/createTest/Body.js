import React, { useEffect, useState } from "react";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useDispatch, useSelector } from "react-redux";
import { createTest } from "../../../redux/actions/facultyActions";
import Spinner from "../../../utils/Spinner";
import { ADD_TEST, SET_ERRORS } from "../../../redux/actionTypes";
import PageHeader from "../../common/PageHeader";

const Body = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);
  const testAdded = useSelector((state) => state.faculty.testAdded);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    test: "",
    totalMarks: "",
    date: "",
  });

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(createTest(value));
  };

  const handleClear = () => {
    setValue({
      test: "",
      totalMarks: "",
      date: "",
    });
    setError({});
  };

  useEffect(() => {
    if (errors || testAdded) {
      setLoading(false);
      if (testAdded) {
        handleClear();
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_TEST, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [errors, testAdded, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="w-full space-y-6 pb-10">
      <PageHeader
        icon={NoteAddIcon}
        title="Create Test"
        subtitle="Set up a new test for your assigned subject."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
          
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Test Details</h2>
            
            {(error.testError || error.backendError) && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 mb-4 text-sm font-medium text-red-700">
                {error.testError || error.backendError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Test Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={value.test}
                  onChange={(e) => setValue({ ...value, test: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="e.g. Midterm Examination"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  value={value.date}
                  onChange={(e) => setValue({ ...value, date: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Maximum Marks <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min="1"
                  value={value.totalMarks}
                  onChange={(e) => setValue({ ...value, totalMarks: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="e.g. 100"
                />
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
               {loading ? <Spinner height={20} width={20} color="#fff" /> : "Create Test"}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Body;
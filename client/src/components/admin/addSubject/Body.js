import React, { useEffect, useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { addSubject, getBranches, getCourses } from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import { ADD_SUBJECT, SET_ERRORS } from "../../../redux/actionTypes";
import PageHeader from "../../common/PageHeader";

const Body = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);
  const subjectAdded = useSelector((state) => state.admin.subjectAdded);
  const departments = useSelector((state) => state.admin.allDepartment);
  const branches = useSelector((state) => state.admin.branches);
  const courses = useSelector((state) => state.admin.courses);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const errorRef = useRef(null);

  const adminDept = departments?.[0]?.department || "";

  const [value, setValue] = useState({
    subjectName: "",
    subjectCode: "",
    year: "",
    totalLectures: "",
    department: adminDept,
    branch: "",
    course: "",
  });

  useEffect(() => {
    if (adminDept && !value.department) {
      setValue((prev) => ({ ...prev, department: adminDept }));
    }
  }, [adminDept, value.department]);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [errors]);

  useEffect(() => {
    dispatch(getBranches());
    dispatch(getCourses());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addSubject(value));
  };

  const handleClear = () => {
    setValue({
      subjectName: "",
      subjectCode: "",
      year: "",
      totalLectures: "",
      department: adminDept,
      branch: "",
      course: "",
    });
    setError({});
  };

  useEffect(() => {
    if (errors || subjectAdded) {
      setLoading(false);
      if (subjectAdded) {
        handleClear();
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_SUBJECT, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [errors, subjectAdded, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="w-full space-y-6 pb-10">
      <PageHeader
        icon={AddIcon}
        title="Add Subject"
        subtitle="Create a subject for a specific course"
      />

      <div ref={errorRef}>
        {(error.subjectError || error.backendError) && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 mb-4 text-sm font-medium text-red-700">
            {error.subjectError || error.backendError}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
          
          {/* Academic Information */}
          <div className="p-6 sm:p-8 space-y-6 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-gray-900">Academic Target</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Department - Read Only */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Department <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  disabled
                  value={adminDept}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Branch <span className="text-red-500">*</span></label>
                <select
                  required
                  disabled={!value.department}
                  value={value.branch}
                  onChange={(e) => setValue({ ...value, branch: e.target.value, course: "" })}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select Branch</option>
                  {branches?.map((br, idx) => (
                    <option key={idx} value={br._id}>{br.branchName}</option>
                  ))}
                </select>
              </div>

              {/* Course */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Course <span className="text-red-500">*</span></label>
                <select
                  required
                  disabled={!value.branch}
                  value={value.course}
                  onChange={(e) => setValue({ ...value, course: e.target.value })}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select Course</option>
                  {courses?.filter(c => c.branch?._id === value.branch || c.branch === value.branch).map((co, idx) => (
                    <option key={idx} value={co._id}>{co.courseName}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Year <span className="text-red-500">*</span></label>
                <select
                  required
                  value={value.year}
                  onChange={(e) => setValue({ ...value, year: e.target.value })}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white"
                >
                  <option value="" disabled hidden>Select Year</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

            </div>
          </div>

          {/* Subject Information */}
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Subject Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subject Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={value.subjectName}
                  onChange={(e) => setValue({ ...value, subjectName: e.target.value })}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="e.g. Structural Dynamics"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subject Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={value.subjectCode}
                  onChange={(e) => setValue({ ...value, subjectCode: e.target.value })}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="e.g. CE-STR-101"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Total Lectures <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min="1"
                  value={value.totalLectures}
                  onChange={(e) => setValue({ ...value, totalLectures: e.target.value })}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="e.g. 40"
                />
              </div>

            </div>
          </div>

          <div className="p-6 sm:p-8 bg-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3">
             <button
               type="button"
               onClick={handleClear}
               disabled={loading}
               className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-600 outline-none transition-all disabled:opacity-50"
             >
               Clear
             </button>
             <button
               type="submit"
               disabled={loading}
               className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 outline-none transition-all disabled:opacity-70 flex items-center justify-center gap-2 min-w-[140px]"
             >
               {loading ? <Spinner height={20} width={20} color="#fff" /> : "Create Subject"}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Body;

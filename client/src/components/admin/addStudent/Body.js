import React, { useEffect, useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "../../../utils/FileBase";
import { addStudent, getBranches, getCourses } from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import { ADD_STUDENT, SET_ERRORS } from "../../../redux/actionTypes";
import PageHeader from "../../common/PageHeader";

const Body = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);
  const studentAdded = useSelector((state) => state.admin.studentAdded);
  const departments = useSelector((state) => state.admin.allDepartment);
  const branches = useSelector((state) => state.admin.branches);
  const courses = useSelector((state) => state.admin.courses);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const errorRef = useRef(null);

  const adminDept = departments?.[0]?.department || "";

  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: "",
    department: adminDept,
    branch: "",
    course: "",
    contactNumber: "",
    avatar: "",
    batch: "",
    gender: "",
    year: "",
    fatherName: "",
    motherName: "",
    section: "",
    fatherContactNumber: "",
    motherContactNumber: "",
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
      setValue((prev) => ({ ...prev, email: "" }));
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
    dispatch(addStudent(value));
  };

  const handleClear = () => {
    setValue({
      name: "",
      dob: "",
      email: "",
      department: adminDept,
      branch: "",
      course: "",
      contactNumber: "",
      avatar: "",
      batch: "",
      gender: "",
      year: "",
      fatherName: "",
      motherName: "",
      section: "",
      fatherContactNumber: "",
      motherContactNumber: "",
    });
    setError({});
  };

  useEffect(() => {
    if (errors || studentAdded) {
      setLoading(false);
      if (studentAdded) {
        handleClear();
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_STUDENT, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [errors, studentAdded, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="w-full space-y-6 pb-10">
      <PageHeader
        icon={AddIcon}
        title="Add Student"
        subtitle="Create a student profile and assign the student to the appropriate academic program."
      />

      <div ref={errorRef}>
        {(error.emailError || error.backendError) && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 mb-4 text-sm font-medium text-red-700">
            {error.emailError || error.backendError}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
          
          {/* Personal Information */}
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={value.name}
                  onChange={(e) => setValue({ ...value, name: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="Full Name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  value={value.dob}
                  onChange={(e) => setValue({ ...value, dob: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  value={value.email}
                  onChange={(e) => setValue({ ...value, email: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Gender <span className="text-red-500">*</span></label>
                <select
                  required
                  value={value.gender}
                  onChange={(e) => setValue({ ...value, gender: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white"
                >
                  <option value="" disabled hidden>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Contact Number <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  value={value.contactNumber}
                  onChange={(e) => setValue({ ...value, contactNumber: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="Phone Number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Avatar</label>
                <div className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm bg-slate-50 flex items-center h-[42px] overflow-hidden">
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => setValue({ ...value, avatar: base64 })}
                  />
                </div>
              </div>

              {/* Parents Details */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Father's Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={value.fatherName}
                  onChange={(e) => setValue({ ...value, fatherName: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="Father's Name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Father's Contact <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  value={value.fatherContactNumber}
                  onChange={(e) => setValue({ ...value, fatherContactNumber: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="Father's Contact"
                />
              </div>
              
              <div className="hidden lg:block"></div> {/* Spacing on large screens */}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Mother's Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={value.motherName}
                  onChange={(e) => setValue({ ...value, motherName: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="Mother's Name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Mother's Contact <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  value={value.motherContactNumber}
                  onChange={(e) => setValue({ ...value, motherContactNumber: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="Mother's Contact"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="p-6 sm:p-8 space-y-6 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900">Academic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Department - Read Only */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Department <span className="text-red-500">*</span></label>
                <select
                  required
                  disabled
                  value={value.department}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-slate-100 text-gray-600 cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select Department</option>
                  {departments?.map((dp, idx) => (
                    <option key={idx} value={dp.department}>{dp.department}</option>
                  ))}
                </select>
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Branch <span className="text-red-500">*</span></label>
                <select
                  required
                  disabled={!value.department}
                  value={value.branch}
                  onChange={(e) => setValue({ ...value, branch: e.target.value, course: "" })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select Branch</option>
                  {branches?.map((br, idx) => (
                    <option key={idx} value={br._id}>{br.branchName}</option>
                  ))}
                </select>
              </div>

              {/* Course */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Course <span className="text-red-500">*</span></label>
                <select
                  required
                  disabled={!value.branch}
                  value={value.course}
                  onChange={(e) => setValue({ ...value, course: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select Course</option>
                  {courses?.filter(c => c.branch?._id === value.branch || c.branch === value.branch).map((co, idx) => (
                    <option key={idx} value={co._id}>{co.courseName}</option>
                  ))}
                </select>
              </div>

              {/* Batch */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Batch <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={value.batch}
                  onChange={(e) => setValue({ ...value, batch: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="e.g. 2024-2028"
                />
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Year <span className="text-red-500">*</span></label>
                <select
                  required
                  value={value.year}
                  onChange={(e) => setValue({ ...value, year: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white"
                >
                  <option value="" disabled hidden>Select Year</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              {/* Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Section <span className="text-red-500">*</span></label>
                <select
                  required
                  value={value.section}
                  onChange={(e) => setValue({ ...value, section: e.target.value })}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white"
                >
                  <option value="" disabled hidden>Select Section</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 sm:p-8 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="text-[13px] text-slate-500 max-w-lg">
              <span className="font-semibold text-slate-700">Note:</span> Username is auto-generated (e.g. STU202600100). The initial password is the date of birth in DD-MM-YYYY format.
             </div>
             
             <div className="w-full sm:w-auto flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
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
                 {loading ? <Spinner height={20} width={20} color="#fff" /> : "Create Student"}
               </button>
             </div>
          </div>

        </form>
      </div>

    </div>
  );
};

export default Body;

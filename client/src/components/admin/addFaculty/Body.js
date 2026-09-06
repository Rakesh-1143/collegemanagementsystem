import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "../../../utils/FileBase";
import { addFaculty, getBranches, getCourses, getSubjectsByCourse } from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import { ADD_FACULTY, SET_ERRORS } from "../../../redux/actionTypes";
import PageHeader from "../../common/PageHeader";

const Body = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);
  const facultyAdded = useSelector((state) => state.admin.facultyAdded);
  const departments = useSelector((state) => state.admin.allDepartment);
  const branches = useSelector((state) => state.admin.branches);
  const courses = useSelector((state) => state.admin.courses);
  const subjects = useSelector((state) => state.admin.subjectsByCourse);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: "",
    department: "",
    branch: "",
    course: "",
    subject: "",
    contactNumber: "",
    avatar: "",
    joiningYear: Date().split(" ")[3],
    gender: "",
    designation: "",
  });

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setValue({ ...value, email: "" });
    }
  }, [errors]);

  useEffect(() => {
    dispatch(getBranches());
    dispatch(getCourses());
  }, [dispatch]);

  useEffect(() => {
    if (value.course) {
      dispatch(getSubjectsByCourse(value.course));
    }
  }, [value.course, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addFaculty(value));
  };

  const handleClear = () => {
    setValue({
      name: "",
      dob: "",
      email: "",
      department: "",
      branch: "",
      course: "",
      subject: "",
      contactNumber: "",
      avatar: "",
      joiningYear: Date().split(" ")[3],
      gender: "",
      designation: "",
    });
    setError({});
  };

  useEffect(() => {
    if (errors || facultyAdded) {
      setLoading(false);
      if (facultyAdded) {
        handleClear();
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_FACULTY, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [errors, facultyAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="w-full space-y-6 pb-10">
      <PageHeader 
        icon={AddIcon} 
        title="Add Faculty" 
        subtitle="Create and assign a faculty member to a department, course, and subject." 
      />

      {(error.emailError || error.backendError) && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error.emailError || error.backendError}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
          
          {/* Personal Information */}
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Name <span className="text-red-500">*</span></label>
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
            </div>
          </div>

          {/* Professional Information */}
          <div className="p-6 sm:p-8 space-y-6 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Designation <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required 
                  value={value.designation} 
                  onChange={(e) => setValue({ ...value, designation: e.target.value })} 
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all" 
                  placeholder="e.g. Assistant Professor" 
                />
              </div>
            </div>
          </div>

          {/* Academic Assignment */}
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Academic Assignment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Department <span className="text-red-500">*</span></label>
                <select 
                  required 
                  value={value.department} 
                  onChange={(e) => setValue({ ...value, department: e.target.value, branch: "", course: "", subject: "" })} 
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white"
                >
                  <option value="" disabled hidden>Select Department</option>
                  {departments?.map((dp, idx) => (
                    <option key={idx} value={dp.department}>{dp.department}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Branch <span className="text-red-500">*</span></label>
                <select 
                  required 
                  disabled={!value.department} 
                  value={value.branch} 
                  onChange={(e) => setValue({ ...value, branch: e.target.value, course: "", subject: "" })} 
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select Branch</option>
                  {branches?.map((br, idx) => (
                    <option key={idx} value={br._id}>{br.branchName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Course <span className="text-red-500">*</span></label>
                <select 
                  required 
                  disabled={!value.branch} 
                  value={value.course} 
                  onChange={(e) => setValue({ ...value, course: e.target.value, subject: "" })} 
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select Course</option>
                  {courses?.filter(c => c.branch?._id === value.branch || c.branch === value.branch).map((co, idx) => (
                    <option key={idx} value={co._id}>{co.courseName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Subject <span className="text-red-500">*</span></label>
                <select 
                  required 
                  disabled={!value.course} 
                  value={value.subject} 
                  onChange={(e) => setValue({ ...value, subject: e.target.value })} 
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>{!value.course ? "Select a course first" : "Select Subject"}</option>
                  {subjects?.map((su, idx) => (
                    <option key={idx} value={su._id}>{su.subjectName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 sm:p-8 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="text-[13px] text-slate-500 max-w-lg">
              <span className="font-semibold text-slate-700">Note:</span> Username is auto-generated (e.g. FAC202600100). The initial password is the date of birth in DD-MM-YYYY format.
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
                 {loading ? <Spinner height={20} width={20} color="#fff" /> : "Create Faculty"}
               </button>
             </div>
          </div>

        </form>
      </div>

    </div>
  );
};

export default Body;

import React, { useEffect, useState, useMemo } from "react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useDispatch, useSelector } from "react-redux";
import { getMyStudents, markAttendance } from "../../../redux/actions/facultyActions";
import Spinner from "../../../utils/Spinner";
import { ATTENDANCE_MARKED, SET_ERRORS } from "../../../redux/actionTypes";
import PageHeader from "../../common/PageHeader";
import EmptyState from "../../common/EmptyState";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const errors = useSelector((state) => state.errors);
  const attendanceUploaded = useSelector((state) => state.faculty.attendanceUploaded);
  const myStudents = useSelector((state) => state.faculty.myStudents) || [];
  
  const [date, setDate] = useState("");
  const [checkedValue, setCheckedValue] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Load students on mount
    dispatch(getMyStudents());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
    }
  }, [errors]);

  const handleCheckboxChange = (id) => {
    setCheckedValue((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setCheckedValue(myStudents.map(s => s._id));
    } else {
      setCheckedValue([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      setError({ backendError: "Please select a date." });
      return;
    }
    setError({});
    setLoading(true);
    dispatch(markAttendance(checkedValue, date));
  };

  useEffect(() => {
    if (errors || attendanceUploaded) {
      setLoading(false);
      if (attendanceUploaded) {
        setDate("");
        setCheckedValue([]);
        setSelectAll(false);
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ATTENDANCE_MARKED, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [errors, attendanceUploaded, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="w-full space-y-6 pb-10">
      <PageHeader
        icon={EventAvailableIcon}
        title="Mark Attendance"
        subtitle="Select the date and mark students as present."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
          
          <div className="p-6 sm:p-8 space-y-6 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900">Attendance Details</h2>
            
            {(error.backendError || error.attendanceError) && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 mb-4 text-sm font-medium text-red-700">
                {error.backendError || error.attendanceError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white"
                />
              </div>
            </div>
          </div>

          <div className="p-0">
            {myStudents.length === 0 ? (
               <div className="p-6">
                 <EmptyState
                    title="No Students Enrolled"
                    hint="You cannot mark attendance because there are no students assigned to your subject."
                  />
               </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-slate-50">
                      <th className="px-6 py-4 text-sm font-semibold text-slate-900 w-16">
                        <input 
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-900">Sr No.</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-900">Roll Number</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-900">Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {myStudents.map((stu, idx) => {
                      const isPresent = checkedValue.includes(stu._id);
                      return (
                        <tr key={stu._id} className={`hover:bg-slate-50 transition-colors ${isPresent ? 'bg-blue-50/30' : ''}`}>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={isPresent}
                              onChange={() => handleCheckboxChange(stu._id)}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{idx + 1}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{stu.username}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                              <img src={stu.avatar || `https://ui-avatars.com/api/?name=${stu.name}`} alt="" className="h-8 w-8 rounded-full bg-slate-100" />
                              {stu.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                               {isPresent ? 'Present' : 'Absent'}
                             </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3">
             <button
               type="submit"
               disabled={loading || myStudents.length === 0}
               className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 outline-none transition-all disabled:opacity-70 flex items-center justify-center gap-2 min-w-[180px]"
             >
               {loading ? <Spinner height={20} width={20} color="#fff" /> : "Save Attendance"}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Body;
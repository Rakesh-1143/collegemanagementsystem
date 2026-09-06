import React, { useEffect, useState, useMemo } from "react";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import { useDispatch, useSelector } from "react-redux";
import { getTest, getMyStudents, uploadMark } from "../../../redux/actions/facultyActions";
import Spinner from "../../../utils/Spinner";
import { MARKS_UPLOADED, SET_ERRORS } from "../../../redux/actionTypes";
import PageHeader from "../../common/PageHeader";
import EmptyState from "../../common/EmptyState";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const errors = useSelector((state) => state.errors);
  const marksUploaded = useSelector((state) => state.faculty.marksUploaded);
  const tests = useSelector((state) => state.faculty.tests.result) || [];
  const myStudents = useSelector((state) => state.faculty.myStudents) || [];
  
  const [selectedTestId, setSelectedTestId] = useState("");
  const [marks, setMarks] = useState([]); // [{ _id, value }]
  
  const selectedTest = useMemo(() => {
    return tests.find(t => t._id === selectedTestId);
  }, [tests, selectedTestId]);

  useEffect(() => {
    dispatch(getTest());
    dispatch(getMyStudents());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
    }
  }, [errors]);

  const handleInputChange = (value, _id) => {
    const val = value === "" ? "" : Number(value);
    const newMarks = [...marks];
    let index = newMarks.findIndex((m) => m._id === _id);
    if (index === -1) {
      newMarks.push({ _id, value: val });
    } else {
      newMarks[index].value = val;
    }
    setMarks(newMarks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTestId) {
      setError({ examError: "Please select a test first." });
      return;
    }
    
    // Validate marks against total marks
    const invalidMarks = marks.filter(m => m.value !== "" && (m.value > selectedTest.totalMarks || m.value < 0));
    if (invalidMarks.length > 0) {
      setError({ examError: `Marks cannot exceed ${selectedTest.totalMarks} or be negative.` });
      return;
    }
    
    const validMarks = marks.filter(m => m.value !== "");
    if (validMarks.length === 0) {
      setError({ examError: "Please enter marks for at least one student." });
      return;
    }

    setError({});
    setLoading(true);
    dispatch(uploadMark(validMarks, selectedTestId));
  };

  useEffect(() => {
    if (errors || marksUploaded) {
      setLoading(false);
      if (marksUploaded) {
        setSelectedTestId("");
        setMarks([]);
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: MARKS_UPLOADED, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [errors, marksUploaded, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="w-full space-y-6 pb-10">
      <PageHeader
        icon={ScoreboardIcon}
        title="Upload Marks"
        subtitle="Enter student marks for your created tests."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
          
          <div className="p-6 sm:p-8 space-y-6 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-gray-900">Select Test</h2>
            
            {(error.examError || error.backendError) && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 mb-4 text-sm font-medium text-red-700">
                {error.examError || error.backendError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Test <span className="text-red-500">*</span></label>
                <select
                  required
                  value={selectedTestId}
                  onChange={(e) => setSelectedTestId(e.target.value)}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white"
                >
                  <option value="" disabled hidden>Select Test</option>
                  {tests.map((test) => (
                    <option key={test._id} value={test._id}>{test.test} (Max: {test.totalMarks})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-0">
            {!selectedTestId ? (
               <div className="p-6">
                 <EmptyState
                    title="No Test Selected"
                    hint="Please select a test from the dropdown above to enter marks."
                  />
               </div>
            ) : myStudents.length === 0 ? (
               <div className="p-6">
                 <EmptyState
                    title="No Students Enrolled"
                    hint="You cannot upload marks because there are no students assigned to your subject."
                  />
               </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 w-16">Sr No.</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900">Roll Number</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right w-48">Marks Obtained</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {myStudents.map((stu, idx) => {
                      const markVal = marks.find((m) => m._id === stu._id)?.value ?? "";
                      return (
                        <tr key={stu._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600">{idx + 1}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{stu.username}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                              <img src={stu.avatar || `https://ui-avatars.com/api/?name=${stu.name}`} alt="" className="h-8 w-8 rounded-full bg-gray-100" />
                              {stu.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <input
                                 type="number"
                                 min="0"
                                 max={selectedTest.totalMarks}
                                 step="0.5"
                                 value={markVal}
                                 onChange={(e) => handleInputChange(e.target.value, stu._id)}
                                 className="w-24 rounded border-gray-300 border px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none text-right"
                                 placeholder={`/ ${selectedTest.totalMarks}`}
                               />
                             </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 bg-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3">
             <button
               type="submit"
               disabled={loading || myStudents.length === 0 || !selectedTestId}
               className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 outline-none transition-all disabled:opacity-70 flex items-center justify-center gap-2 min-w-[180px]"
             >
               {loading ? <Spinner height={20} width={20} color="#fff" /> : "Submit Marks"}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Body;
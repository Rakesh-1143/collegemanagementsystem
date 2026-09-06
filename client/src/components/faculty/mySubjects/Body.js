import React from "react";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useSelector } from "react-redux";
import PageHeader from "../../common/PageHeader";
import EmptyState from "../../common/EmptyState";
import DataTable from "../../common/DataTable";

const Body = () => {
  const mySubjects = useSelector((state) => state.faculty.mySubjects) || [];

  const columns = [
    { key: "subjectCode", label: "Subject Code" },
    { key: "subjectName", label: "Subject Name" },
    { key: "department", label: "Department" },
    { key: "branch", label: "Branch", format: (val) => val?.branchName || "N/A" },
    { key: "course", label: "Course", format: (val) => val?.courseName || "N/A" },
    { key: "year", label: "Year" },
    { key: "totalLectures", label: "Total Lectures" },
  ];

  return (
    <div className="w-full space-y-6 pb-10">
      <PageHeader
        icon={AssignmentIndIcon}
        title="My Assigned Subject"
        subtitle="View the academic subject assigned to you."
      />

      {mySubjects.length === 0 ? (
        <EmptyState
          title="No Subject Assigned"
          hint="You have not been assigned to a subject yet. Please contact the Admin."
        />
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <DataTable
            columns={columns}
            rows={mySubjects}
          />
        </div>
      )}
    </div>
  );
};

export default Body;

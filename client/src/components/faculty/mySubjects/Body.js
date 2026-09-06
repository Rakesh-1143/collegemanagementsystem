import React from "react";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useSelector } from "react-redux";
import PageHeader from "../../common/PageHeader";
import EmptyState from "../../common/EmptyState";
import DataTable from "../../common/DataTable";

const Body = () => {
  const mySubjects = useSelector((state) => state.faculty.mySubjects) || [];

  const columns = [
    { key: "_index", label: "Sr", numeric: true, sortable: false },
    { key: "subjectCode", label: "Subject Code" },
    { key: "subjectName", label: "Subject Name" },
    { key: "department", label: "Department" },
    { key: "branch", label: "Branch" },
    { key: "course", label: "Course" },
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
            renderCell={(row, col, index) => {
              if (col.key === "_index") return index + 1;
              if (col.key === "branch") return row.branch?.branchName || "N/A";
              if (col.key === "course") return row.course?.courseName || "N/A";
              return null;
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Body;

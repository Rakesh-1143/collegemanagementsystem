import React, { useState, useMemo } from "react";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useSelector } from "react-redux";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PageHeader from "../../common/PageHeader";
import EmptyState from "../../common/EmptyState";
import DataTable from "../../common/DataTable";

const Body = () => {
  const myStudents = useSelector((state) => state.faculty.myStudents) || [];
  const [query, setQuery] = useState("");

  const filteredStudents = useMemo(() => {
    if (!myStudents) return [];
    const q = query.trim().toLowerCase();
    
    return myStudents.filter((s) => {
      const matchesQuery = q ? [s.name, s.username, s.email].some((v) =>
        String(v || "").toLowerCase().includes(q)
      ) : true;
      return matchesQuery;
    });
  }, [myStudents, query]);

  const columns = [
    { key: "_index", label: "Sr", numeric: true, sortable: false },
    { key: "avatar", label: "Profile" },
    { key: "username", label: "Roll Number" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "contactNumber", label: "Phone" },
    { key: "year", label: "Year" },
    { key: "section", label: "Section" },
  ];

  return (
    <div className="w-full space-y-6 pb-10">
      <PageHeader
        icon={HowToRegIcon}
        title="My Students"
        subtitle="View all students enrolled in your assigned subject."
      />

      {myStudents.length === 0 ? (
        <EmptyState
          title="No Students Enrolled"
          hint="There are currently no students assigned to your subject."
        />
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <TextField
              size="small"
              placeholder="Search by name, roll number, or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-96 bg-white"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-slate-400" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <DataTable
            columns={columns}
            rows={filteredStudents}
            renderCell={(row, col, index) => {
              if (col.key === "_index") return index + 1;
              if (col.key === "avatar") return (
                <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200">
                  <img
                    src={row.avatar || "https://ui-avatars.com/api/?name=" + row.name}
                    alt={row.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              );
              if (col.key === "contactNumber") return row.contactNumber || "N/A";
              return null;
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Body;

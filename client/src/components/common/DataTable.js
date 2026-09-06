import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Spinner from "../../utils/Spinner";
import EmptyState from "./EmptyState";

// columns: [{ key, label, numeric?, sortable?, align? }]
// rows: array of objects
// renderCell?: (row, column, index) => ReactNode  (override default cell content)
// loading, emptyTitle, emptyHint, pagination, defaultRowsPerPage
const DataTable = ({
  columns = [],
  rows = [],
  loading = false,
  renderCell,
  emptyTitle = "No records found",
  emptyHint = "Try changing your filters or search.",
  pagination = true,
  defaultRowsPerPage = 8,
  serverSide = false,
  totalRows = 0,
  page: serverPage = 0,
  rowsPerPage: serverRowsPerPage = 8,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const [localPage, setLocalPage] = useState(0);
  const [localRowsPerPage, setLocalRowsPerPage] = useState(defaultRowsPerPage);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.key || "");

  const actualPage = serverSide ? serverPage : localPage;
  const actualRowsPerPage = serverSide ? serverRowsPerPage : localRowsPerPage;

  useEffect(() => {
    if (!serverSide) setLocalPage(0);
  }, [rows, serverSide]);

  const handleRequestSort = (key) => {
    const isAsc = orderBy === key && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(key);
  };

  const sortedRows = useMemo(() => {
    if (!orderBy) return rows;
    const sorted = [...rows].sort((a, b) => {
      const av = a?.[orderBy];
      const bv = b?.[orderBy];
      let cmp = 0;
      if (typeof av === "number" && typeof bv === "number") {
        cmp = av - bv;
      } else {
        cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
          sensitivity: "base",
        });
      }
      return order === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [rows, order, orderBy]);

  const pageRows = serverSide 
    ? sortedRows 
    : pagination
      ? sortedRows.slice(actualPage * actualRowsPerPage, actualPage * actualRowsPerPage + actualRowsPerPage)
      : sortedRows;

  const actualTotalCount = serverSide ? totalRows : rows.length;

  const handlePageChange = (_, newPage) => {
    if (serverSide && onPageChange) onPageChange(newPage);
    else setLocalPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    const newRows = parseInt(e.target.value, 10);
    if (serverSide && onRowsPerPageChange) {
      onRowsPerPageChange(newRows);
    } else {
      setLocalRowsPerPage(newRows);
      setLocalPage(0);
    }
  };

  const visibleColumns = columns.filter((c) => c.hidden !== true);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "#e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}>
      <TableContainer sx={{ maxHeight: "70vh" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align || (col.numeric ? "right" : "left")}
                  sx={{
                    fontWeight: 700,
                    bgcolor: "background.paper",
                    whiteSpace: "nowrap",
                    px: 2,
                  }}>
                  {col.sortable === false ? (
                    col.label
                  ) : (
                    <TableSortLabel
                      active={orderBy === col.key}
                      direction={orderBy === col.key ? order : "asc"}
                      onClick={() => handleRequestSort(col.key)}>
                      {col.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length || 1}>
                  <Box sx={{ py: 4 }}>
                    <Spinner message="Loading…" height={40} width={120} color="#4f46e5" messageColor="#64748b" />
                  </Box>
                </TableCell>
              </TableRow>
            ) : pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length || 1}>
                  <EmptyState title={emptyTitle} hint={emptyHint} />
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, idx) => (
                <TableRow
                  key={row._id || idx}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  {visibleColumns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align || (col.numeric ? "right" : "left")}
                      sx={{
                        whiteSpace: col.nowrap === false ? "normal" : "nowrap",
                        px: 2,
                      }}>
                      {(renderCell ? renderCell(row, col, (serverSide ? 0 : actualPage * actualRowsPerPage) + idx) : null) ??
                        (row[col.key] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && actualTotalCount > 0 && (
        <TablePagination
          component="div"
          count={actualTotalCount}
          page={actualPage}
          onPageChange={handlePageChange}
          rowsPerPage={actualRowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[8, 15, 25, 50]}
          labelRowsPerPage="Rows"
        />
      )}
    </Paper>
  );
};

export default DataTable;
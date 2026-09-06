import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
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
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.key || "");

  useEffect(() => {
    setPage(0);
  }, [rows]);

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

  const pageRows = pagination
    ? sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedRows;

  const visibleColumns = columns.filter((c) => c.hidden !== true);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
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
                    <Spinner message="Loading…" height={40} width={120} color="#7c3aed" messageColor="#64748b" />
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
                      {(renderCell ? renderCell(row, col, page * rowsPerPage + idx) : null) ??
                        (row[col.key] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && rows.length > 0 && (
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[8, 15, 25, 50]}
          labelRowsPerPage="Rows"
        />
      )}
    </Paper>
  );
};

export default DataTable;
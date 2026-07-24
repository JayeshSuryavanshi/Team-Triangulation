import { useState } from 'react';
import {
  Alert, Box, CircularProgress, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TablePagination, TableRow, Typography,
} from '@mui/material';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

function formatCell(value) {
  if (value === null || value === undefined) return '—';
  return String(value);
}

// Renders a { columns, rows } result set as a paginated MUI table, with its own
// loading / error / empty states. Replaces the old react-table-6 component.
export default function ResultsTable({ result, loading, error }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = result?.columns ?? [];
  const rows = result?.rows ?? [];

  // Reset to the first page whenever a new result set arrives — React's
  // supported "adjust state during render" pattern (no effect needed).
  const resultKey = result ? `${columns.length}:${rows.length}` : 'none';
  const [prevKey, setPrevKey] = useState(resultKey);
  if (prevKey !== resultKey) {
    setPrevKey(resultKey);
    setPage(0);
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!result) return null;

  if (rows.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        No rows returned.
      </Typography>
    );
  }

  const start = page * rowsPerPage;
  const pageRows = rows.slice(start, start + rowsPerPage);

  return (
    <Paper variant="outlined" sx={{ mt: 2, overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 460 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.accessor} sx={{ fontWeight: 700 }}>
                  {col.Header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((row, i) => (
              <TableRow key={start + i} hover>
                {columns.map((col) => (
                  <TableCell key={col.accessor}>{formatCell(row[col.accessor])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, next) => setPage(next)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={PAGE_SIZE_OPTIONS}
      />
    </Paper>
  );
}

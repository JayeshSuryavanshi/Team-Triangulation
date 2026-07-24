import { useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import useQueryRunner from '../hooks/useQueryRunner';
import ResultsTable from './ResultsTable';

const MAX_N = 200;

// Reusable panel for the "top N …" explorers. `buildQuery(n)` returns
// { sql, params }; the count is validated and passed as a bound parameter.
export default function TopNPanel({ title, description, unit, buildQuery, defaultCount = 10 }) {
  const [count, setCount] = useState(String(defaultCount));
  const { result, loading, error, run, reset } = useQueryRunner();

  const parsed = parseInt(count, 10);
  const valid = Number.isInteger(parsed) && parsed >= 1 && parsed <= MAX_N;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!valid) return;
    const { sql, params } = buildQuery(parsed);
    run(sql, params);
  };

  const handleClear = () => {
    setCount(String(defaultCount));
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>{description}</Typography>

      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
        <TextField
          label={`How many ${unit}?`}
          type="number"
          size="small"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          error={count !== '' && !valid}
          helperText={count !== '' && !valid ? `Enter a whole number from 1 to ${MAX_N}` : ' '}
          inputProps={{ min: 1, max: MAX_N }}
          sx={{ width: 180 }}
        />
        <Button type="submit" variant="contained" disabled={!valid || loading}>
          Run
        </Button>
        <Button type="button" variant="outlined" onClick={handleClear} disabled={loading}>
          Clear
        </Button>
      </Stack>

      <ResultsTable result={result} loading={loading} error={error} />
    </Box>
  );
}

import { useState } from 'react';
import {
  Box, Button, Chip, Divider, Stack, TextField, Typography,
} from '@mui/material';
import useQueryRunner from '../hooks/useQueryRunner';
import { EXAMPLE_QUERIES, SCHEMA_REFERENCE } from '../queries';
import ResultsTable from './ResultsTable';

const STARTER_QUERY = EXAMPLE_QUERIES[0].sql;

// Free-form SQL playground. The query runs against the sandboxed in-browser
// SQLite database, so there is no server to attack — but it is still a real,
// full SQL engine.
export default function SqlConsole() {
  const [query, setQuery] = useState(STARTER_QUERY);
  const { result, loading, error, run, reset } = useQueryRunner();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) run(query);
  };

  const handleClear = () => {
    setQuery('');
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>SQL console</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Write any SQL and run it against the bundled SQLite database. Everything
        executes locally in your browser.
      </Typography>

      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        multiline
        minRows={5}
        fullWidth
        placeholder="SELECT * FROM titles LIMIT 10;"
        spellCheck={false}
        InputProps={{ sx: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 14 } }}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
        <Button type="submit" variant="contained" disabled={loading || !query.trim()}>
          Run query
        </Button>
        <Button type="button" variant="outlined" onClick={handleClear} disabled={loading}>
          Clear
        </Button>
      </Stack>

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>Try an example</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {EXAMPLE_QUERIES.map((ex) => (
          <Chip
            key={ex.label}
            label={ex.label}
            variant="outlined"
            onClick={() => setQuery(ex.sql)}
            clickable
          />
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" sx={{ mb: 1 }}>Schema</Typography>
      <Stack spacing={0.5}>
        {SCHEMA_REFERENCE.map(({ table, columns }) => (
          <Typography
            key={table}
            variant="body2"
            sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
          >
            <Box component="span" sx={{ fontWeight: 700 }}>{table}</Box>
            {` (${columns.join(', ')})`}
          </Typography>
        ))}
      </Stack>

      <ResultsTable result={result} loading={loading} error={error} />
    </Box>
  );
}

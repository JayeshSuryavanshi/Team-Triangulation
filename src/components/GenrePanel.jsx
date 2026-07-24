import { useState } from 'react';
import {
  Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography,
} from '@mui/material';
import useQueryRunner from '../hooks/useQueryRunner';
import { GENRES, titlesByGenre } from '../queries';
import ResultsTable from './ResultsTable';

// Browse titles by genre. The selected genre comes from a fixed list and is
// passed as a bound parameter.
export default function GenrePanel() {
  const [genre, setGenre] = useState('');
  const { result, loading, error, run, reset } = useQueryRunner();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!genre) return;
    const { sql, params } = titlesByGenre(genre);
    run(sql, params);
  };

  const handleClear = () => {
    setGenre('');
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>Browse by genre</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Pick a genre to list matching titles, best-rated first.
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="genre-label">Genre</InputLabel>
          <Select
            labelId="genre-label"
            label="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            {GENRES.map((g) => (
              <MenuItem key={g} value={g}>{g}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" disabled={!genre || loading}>
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

import { useState } from 'react';
import {
  AppBar, Box, Card, CardContent, Chip, Container, IconButton, Link, Tab,
  Tabs, Toolbar, Tooltip, Typography,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import StorageIcon from '@mui/icons-material/Storage';
import SqlConsole from './components/SqlConsole';
import TopNPanel from './components/TopNPanel';
import GenrePanel from './components/GenrePanel';
import { topDirectors, topMovies, topTvSeries } from './queries';

const REPO_URL = 'https://github.com/JayeshSuryavanshi/Team-Triangulation';

const TABS = [
  { label: 'SQL Console', render: () => <SqlConsole /> },
  {
    label: 'Top Movies',
    render: () => (
      <TopNPanel
        title="Top movies"
        description="Highest-rated movies with more than 1,000 votes."
        unit="movies"
        buildQuery={topMovies}
      />
    ),
  },
  {
    label: 'Top TV Series',
    render: () => (
      <TopNPanel
        title="Top TV series"
        description="Highest-rated TV series with more than 1,000 votes."
        unit="series"
        buildQuery={topTvSeries}
      />
    ),
  },
  {
    label: 'Top Directors',
    render: () => (
      <TopNPanel
        title="Top directors"
        description="Directors ranked by the average rating across their titles."
        unit="directors"
        buildQuery={topDirectors}
      />
    ),
  },
  { label: 'By Genre', render: () => <GenrePanel /> },
];

// Keeps every tab mounted (so panel state survives switching) but hides the
// inactive ones.
function TabPanel({ active, children }) {
  return (
    <Box role="tabpanel" hidden={!active} sx={{ display: active ? 'block' : 'none' }}>
      {children}
    </Box>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
        <Toolbar sx={{ flexWrap: 'wrap', gap: 1 }}>
          <StorageIcon color="primary" sx={{ mr: 1 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h1" sx={{ lineHeight: 1.2 }}>
              Triangulation
            </Typography>
            <Typography variant="caption" color="text.secondary">
              IMDb SQL Explorer
            </Typography>
          </Box>
          <Chip
            size="small"
            variant="outlined"
            label="Sample data · runs in your browser"
            sx={{ mr: 1 }}
          />
          <Tooltip title="View source on GitHub">
            <IconButton component="a" href={REPO_URL} target="_blank" rel="noopener noreferrer" size="small">
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Explore an IMDb-style database with SQL
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
          Run pre-built queries or write your own SQL against a bundled sample of
          well-known movies and TV series. A real SQLite database (compiled to
          WebAssembly) is created in your browser — no backend, no network.
        </Typography>

        <Card variant="outlined">
          <Tabs
            value={tab}
            onChange={(_, next) => setTab(next)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider', px: 1 }}
          >
            {TABS.map((t) => (
              <Tab key={t.label} label={t.label} />
            ))}
          </Tabs>
          <CardContent>
            {TABS.map((t, i) => (
              <TabPanel key={t.label} active={tab === i}>
                {t.render()}
              </TabPanel>
            ))}
          </CardContent>
        </Card>

        <Box component="footer" sx={{ mt: 5, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Sample dataset is a small, hand-curated set of well-known titles for
            demonstration — not the full IMDb dataset. Ratings and vote counts are
            approximate.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Built by <strong>Team Triangulation</strong> (University at Buffalo, DMQL, 2022) ·{' '}
            <Link href={REPO_URL} target="_blank" rel="noopener noreferrer">
              source on GitHub
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

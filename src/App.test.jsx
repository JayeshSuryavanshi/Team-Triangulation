import { render, screen } from '@testing-library/react';
import App from './App';

// Avoid loading the SQLite WASM engine in jsdom — the panels only need a
// runQuery that resolves.
vi.mock('./db', () => ({
  runQuery: vi.fn().mockResolvedValue({ columns: [], rows: [] }),
}));

test('renders the app header and query tabs', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /triangulation/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /sql console/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /top directors/i })).toBeInTheDocument();
});

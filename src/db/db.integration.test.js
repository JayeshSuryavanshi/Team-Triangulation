/**
 * @jest-environment node
 *
 * End-to-end check of the actual SQLite engine: initialize sql.js, seed the
 * bundled data, and run the real query builders. This exercises the schema DDL,
 * the dataset, and every pre-built query through the same engine the browser
 * uses (the other suites mock the DB).
 */
import initSqlJs from 'sql.js';
import { seedDatabase, toResult } from './index';
import { titlesByGenre, topDirectors, topMovies, topTvSeries } from '../queries';

let db;

beforeAll(async () => {
  const SQL = await initSqlJs();
  db = seedDatabase(new SQL.Database());
});

afterAll(() => db && db.close());

const query = ({ sql, params }) => toResult(db.exec(sql, params));

test('top movie is the highest-rated movie in the sample', () => {
  const { columns, rows } = query(topMovies(3));
  expect(columns.map((c) => c.accessor)).toEqual(['original_title', 'average_rating', 'start_year']);
  expect(rows).toHaveLength(3);
  expect(rows[0].original_title).toBe('The Shawshank Redemption');
  // Descending by rating.
  expect(rows[0].average_rating).toBeGreaterThanOrEqual(rows[1].average_rating);
});

test('top TV series only returns tvSeries titles', () => {
  const { rows } = query(topTvSeries(5));
  expect(rows.length).toBeGreaterThan(0);
  // Breaking Bad (9.5) tops the sample.
  expect(rows[0].original_title).toBe('Breaking Bad');
});

test('top directors aggregates average rating across titles', () => {
  const { rows } = query(topDirectors(5));
  expect(rows[0]).toHaveProperty('full_name');
  expect(rows[0]).toHaveProperty('average_rating');
  expect(rows[0]).toHaveProperty('num_titles');
  // Ranking spans all title types; Vince Gilligan directs only Breaking Bad
  // (9.5), the highest-rated title in the sample, so he tops the average.
  expect(rows[0].full_name).toBe('Vince Gilligan');
  expect(rows[0].average_rating).toBeCloseTo(9.5);
  // Descending by average rating.
  expect(rows[0].average_rating).toBeGreaterThanOrEqual(rows[1].average_rating);
});

test('genre browsing returns matching titles', () => {
  const { rows } = query(titlesByGenre('Sci-Fi'));
  expect(rows.length).toBeGreaterThan(0);
  const titles = rows.map((r) => r.original_title);
  expect(titles).toContain('The Matrix');
});

test('a malicious genre string is treated as data, not SQL', () => {
  const { rows } = query(titlesByGenre("Sci-Fi'; DROP TABLE titles;--"));
  expect(rows).toHaveLength(0); // no such genre; nothing matched
  // The titles table is still intact.
  const check = toResult(db.exec('SELECT COUNT(*) AS n FROM titles'));
  expect(check.rows[0].n).toBeGreaterThan(0);
});

test('free-form SQL runs against the seeded schema', () => {
  const { rows } = toResult(
    db.exec('SELECT genre, COUNT(*) AS n FROM title_genres GROUP BY genre ORDER BY n DESC')
  );
  expect(rows.length).toBeGreaterThan(0);
  expect(rows[0]).toHaveProperty('genre');
  expect(rows[0]).toHaveProperty('n');
});

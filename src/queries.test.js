import { GENRES, titlesByGenre, topDirectors, topMovies, topTvSeries } from './queries';

describe('query builders bind user input as parameters', () => {
  test('topMovies passes the count as a bound parameter', () => {
    const { sql, params } = topMovies(5);
    expect(params).toEqual([5]);
    expect(sql).toMatch(/title_type = 'movie'/);
    expect(sql).toContain('LIMIT ?');
    expect(sql).not.toContain('5'); // the literal is never inlined
  });

  test('topTvSeries filters tvSeries and binds the count', () => {
    const { sql, params } = topTvSeries(3);
    expect(params).toEqual([3]);
    expect(sql).toMatch(/title_type = 'tvSeries'/);
  });

  test('topDirectors binds the count', () => {
    const { params } = topDirectors(10);
    expect(params).toEqual([10]);
  });

  test('titlesByGenre binds the genre rather than concatenating it', () => {
    const { sql, params } = titlesByGenre("Sci-Fi'; DROP TABLE titles;--");
    expect(params).toEqual(["Sci-Fi'; DROP TABLE titles;--"]);
    expect(sql).toContain('WHERE tg.genre = ?');
    expect(sql).not.toContain('DROP TABLE');
  });
});

test('GENRES is a non-empty list of unique values', () => {
  expect(GENRES.length).toBeGreaterThan(0);
  expect(new Set(GENRES).size).toBe(GENRES.length);
});

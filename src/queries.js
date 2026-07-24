// Query builders for the pre-built explorers, plus schema/example metadata for
// the SQL console.
//
// Every value that comes from user input (the "top N" count, the selected
// genre) is passed as a bound parameter — never concatenated into the SQL
// string — so the injection hole in the original version is closed.

export const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'Game-Show', 'History',
  'Horror', 'Music', 'Musical', 'Mystery', 'News', 'Reality-TV', 'Romance',
  'Sci-Fi', 'Short', 'Sport', 'Talk-Show', 'Thriller', 'War', 'Western',
];

// Top N highest-rated titles of a given type (with a meaningful vote count).
function topTitlesByType(titleType, limit) {
  return {
    sql: `
      SELECT t.original_title, tr.average_rating, t.start_year
      FROM titles t
      JOIN title_ratings tr ON tr.title_id = t.title_id
      WHERE t.title_type = '${titleType}' AND tr.num_votes > 1000
      ORDER BY tr.average_rating DESC, tr.num_votes DESC
      LIMIT ?`,
    params: [limit],
  };
}

export const topMovies = (limit) => topTitlesByType('movie', limit);
export const topTvSeries = (limit) => topTitlesByType('tvSeries', limit);

// Top N directors ranked by the average rating across their titles.
export const topDirectors = (limit) => ({
  sql: `
    SELECT pn.full_name,
           ROUND(AVG(tr.average_rating), 2) AS average_rating,
           COUNT(*) AS num_titles
    FROM directors d
    JOIN title_ratings tr ON tr.title_id = d.title_id
    JOIN person_names pn ON pn.name_id = d.name_id
    GROUP BY d.name_id
    ORDER BY average_rating DESC, num_titles DESC
    LIMIT ?`,
  params: [limit],
});

// Titles matching a genre, best-rated first.
export const titlesByGenre = (genre) => ({
  sql: `
    SELECT t.original_title, t.title_type, t.start_year, tr.average_rating
    FROM titles t
    JOIN title_genres tg ON tg.title_id = t.title_id
    LEFT JOIN title_ratings tr ON tr.title_id = t.title_id
    WHERE tg.genre = ?
    ORDER BY tr.average_rating DESC, t.original_title ASC
    LIMIT 100`,
  params: [genre],
});

// Note: title_type above is a fixed internal constant (never user input), so it
// is safe to inline; the genre and limit are always bound parameters.

// ---- SQL console metadata -------------------------------------------------

export const SCHEMA_REFERENCE = [
  { table: 'titles', columns: ['title_id', 'title_type', 'original_title', 'start_year'] },
  { table: 'title_ratings', columns: ['title_id', 'average_rating', 'num_votes'] },
  { table: 'title_genres', columns: ['title_id', 'genre'] },
  { table: 'person_names', columns: ['name_id', 'full_name'] },
  { table: 'directors', columns: ['title_id', 'name_id'] },
];

export const EXAMPLE_QUERIES = [
  {
    label: 'Highest-rated titles overall',
    sql: "SELECT original_title, title_type, average_rating\nFROM titles\nJOIN title_ratings USING (title_id)\nORDER BY average_rating DESC\nLIMIT 10;",
  },
  {
    label: 'How many titles per genre',
    sql: 'SELECT genre, COUNT(*) AS titles\nFROM title_genres\nGROUP BY genre\nORDER BY titles DESC;',
  },
  {
    label: "Christopher Nolan's filmography",
    sql: "SELECT t.original_title, t.start_year, tr.average_rating\nFROM titles t\nJOIN directors d   ON d.title_id = t.title_id\nJOIN person_names p ON p.name_id = d.name_id\nJOIN title_ratings tr ON tr.title_id = t.title_id\nWHERE p.full_name = 'Christopher Nolan'\nORDER BY tr.average_rating DESC;",
  },
  {
    label: 'Best sci-fi movies',
    sql: "SELECT t.original_title, tr.average_rating\nFROM titles t\nJOIN title_genres g  ON g.title_id = t.title_id\nJOIN title_ratings tr ON tr.title_id = t.title_id\nWHERE g.genre = 'Sci-Fi' AND t.title_type = 'movie'\nORDER BY tr.average_rating DESC\nLIMIT 10;",
  },
];

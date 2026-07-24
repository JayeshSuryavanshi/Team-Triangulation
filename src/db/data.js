// ---------------------------------------------------------------------------
// Bundled sample dataset for the in-browser IMDb explorer.
//
// This is a small, hand-curated set of well-known titles — NOT the full IMDb
// dataset (which is gigabytes and licensed for non-commercial use only). Values
// approximate real IMDb ratings/votes and are meant purely to make the demo fun
// to explore. The schema mirrors the original course project so the same style
// of SQL still works.
//
// Records are authored in a compact form below, then normalised into the five
// relational tables in src/db/index.js using bound parameters (no string
// interpolation, so seeding is injection-safe by construction).
// ---------------------------------------------------------------------------

export const SCHEMA = `
CREATE TABLE titles (
  title_id       TEXT PRIMARY KEY,
  title_type     TEXT NOT NULL,
  original_title TEXT NOT NULL,
  start_year     INTEGER
);

CREATE TABLE title_ratings (
  title_id       TEXT PRIMARY KEY REFERENCES titles(title_id),
  average_rating REAL NOT NULL,
  num_votes      INTEGER NOT NULL
);

CREATE TABLE title_genres (
  title_id TEXT NOT NULL REFERENCES titles(title_id),
  genre    TEXT NOT NULL,
  PRIMARY KEY (title_id, genre)
);

CREATE TABLE person_names (
  name_id   TEXT PRIMARY KEY,
  full_name TEXT NOT NULL
);

CREATE TABLE directors (
  title_id TEXT NOT NULL REFERENCES titles(title_id),
  name_id  TEXT NOT NULL REFERENCES person_names(name_id),
  PRIMARY KEY (title_id, name_id)
);

CREATE INDEX idx_ratings_avg   ON title_ratings(average_rating);
CREATE INDEX idx_genres_genre  ON title_genres(genre);
CREATE INDEX idx_titles_type   ON titles(title_type);
`;

// [ type, title, year, rating, votes, [genres], director | null ]
const RECORDS = [
  // ---- Movies -----------------------------------------------------------
  ['movie', 'The Shawshank Redemption', 1994, 9.3, 2800000, ['Drama'], 'Frank Darabont'],
  ['movie', 'The Godfather', 1972, 9.2, 1950000, ['Crime', 'Drama'], 'Francis Ford Coppola'],
  ['movie', 'The Dark Knight', 2008, 9.0, 2750000, ['Action', 'Crime', 'Drama'], 'Christopher Nolan'],
  ['movie', 'The Godfather Part II', 1974, 9.0, 1330000, ['Crime', 'Drama'], 'Francis Ford Coppola'],
  ['movie', 'Pulp Fiction', 1994, 8.9, 2150000, ['Crime', 'Drama'], 'Quentin Tarantino'],
  ['movie', "Schindler's List", 1993, 9.0, 1400000, ['Biography', 'Drama', 'History'], 'Steven Spielberg'],
  ['movie', 'Inception', 2010, 8.8, 2450000, ['Action', 'Adventure', 'Sci-Fi'], 'Christopher Nolan'],
  ['movie', 'Fight Club', 1999, 8.8, 2250000, ['Drama'], 'David Fincher'],
  ['movie', 'Forrest Gump', 1994, 8.8, 2150000, ['Drama', 'Romance'], 'Robert Zemeckis'],
  ['movie', 'The Lord of the Rings: The Return of the King', 2003, 9.0, 1900000, ['Action', 'Adventure', 'Drama'], 'Peter Jackson'],
  ['movie', 'The Lord of the Rings: The Fellowship of the Ring', 2001, 8.9, 1950000, ['Action', 'Adventure', 'Drama'], 'Peter Jackson'],
  ['movie', 'The Lord of the Rings: The Two Towers', 2002, 8.8, 1720000, ['Action', 'Adventure', 'Drama'], 'Peter Jackson'],
  ['movie', 'The Matrix', 1999, 8.7, 2000000, ['Action', 'Sci-Fi'], 'Lana Wachowski'],
  ['movie', 'Goodfellas', 1990, 8.7, 1230000, ['Biography', 'Crime', 'Drama'], 'Martin Scorsese'],
  ['movie', 'Se7en', 1995, 8.6, 1720000, ['Crime', 'Drama', 'Mystery'], 'David Fincher'],
  ['movie', 'Interstellar', 2014, 8.7, 2050000, ['Adventure', 'Drama', 'Sci-Fi'], 'Christopher Nolan'],
  ['movie', 'Parasite', 2019, 8.5, 900000, ['Drama', 'Thriller'], 'Bong Joon-ho'],
  ['movie', 'The Silence of the Lambs', 1991, 8.6, 1520000, ['Crime', 'Drama', 'Thriller'], 'Jonathan Demme'],
  ['movie', 'Saving Private Ryan', 1998, 8.6, 1450000, ['Drama', 'War'], 'Steven Spielberg'],
  ['movie', 'Gladiator', 2000, 8.5, 1600000, ['Action', 'Adventure', 'Drama'], 'Ridley Scott'],
  ['movie', 'The Departed', 2006, 8.5, 1350000, ['Crime', 'Drama', 'Thriller'], 'Martin Scorsese'],
  ['movie', 'Whiplash', 2014, 8.5, 950000, ['Drama', 'Music'], 'Damien Chazelle'],
  ['movie', 'The Prestige', 2006, 8.5, 1370000, ['Drama', 'Mystery', 'Thriller'], 'Christopher Nolan'],
  ['movie', 'Alien', 1979, 8.5, 950000, ['Horror', 'Sci-Fi'], 'Ridley Scott'],
  ['movie', '2001: A Space Odyssey', 1968, 8.3, 720000, ['Adventure', 'Sci-Fi'], 'Stanley Kubrick'],
  ['movie', 'A Clockwork Orange', 1971, 8.2, 850000, ['Crime', 'Drama', 'Sci-Fi'], 'Stanley Kubrick'],
  ['movie', 'Spirited Away', 2001, 8.6, 830000, ['Animation', 'Adventure', 'Family'], 'Hayao Miyazaki'],
  ['movie', 'Princess Mononoke', 1997, 8.3, 400000, ['Animation', 'Adventure', 'Fantasy'], 'Hayao Miyazaki'],
  ['movie', 'Blade Runner 2049', 2017, 8.0, 720000, ['Action', 'Drama', 'Sci-Fi'], 'Denis Villeneuve'],
  ['movie', 'Dune', 2021, 8.0, 780000, ['Action', 'Adventure', 'Sci-Fi'], 'Denis Villeneuve'],
  ['movie', 'Psycho', 1960, 8.5, 700000, ['Horror', 'Mystery', 'Thriller'], 'Alfred Hitchcock'],
  ['movie', 'Rear Window', 1954, 8.5, 500000, ['Mystery', 'Thriller'], 'Alfred Hitchcock'],
  ['movie', 'Titanic', 1997, 7.9, 1200000, ['Drama', 'Romance'], 'James Cameron'],
  ['movie', 'Terminator 2: Judgment Day', 1991, 8.6, 1120000, ['Action', 'Sci-Fi'], 'James Cameron'],
  ['movie', '12 Angry Men', 1957, 9.0, 850000, ['Crime', 'Drama'], 'Sidney Lumet'],
  ['movie', 'Life Is Beautiful', 1997, 8.6, 720000, ['Comedy', 'Drama', 'Romance'], 'Roberto Benigni'],
  ['movie', 'Joker', 2019, 8.4, 1450000, ['Crime', 'Drama', 'Thriller'], 'Todd Phillips'],
  ['movie', 'Avengers: Endgame', 2019, 8.4, 1200000, ['Action', 'Adventure', 'Drama'], 'Anthony Russo'],
  ['movie', 'Star Wars: Episode IV - A New Hope', 1977, 8.6, 1420000, ['Action', 'Adventure', 'Fantasy'], 'George Lucas'],
  ["movie", "It's a Wonderful Life", 1946, 8.6, 500000, ['Drama', 'Family', 'Fantasy'], 'Frank Capra'],
  ['movie', 'The Good, the Bad and the Ugly', 1966, 8.8, 800000, ['Adventure', 'Western'], 'Sergio Leone'],
  ['movie', 'Once Upon a Time in the West', 1968, 8.5, 340000, ['Western'], 'Sergio Leone'],
  ['movie', "One Flew Over the Cuckoo's Nest", 1975, 8.7, 1080000, ['Drama'], 'Milos Forman'],
  ['movie', 'Up', 2009, 8.3, 1080000, ['Animation', 'Adventure', 'Comedy'], 'Pete Docter'],
  ['movie', 'WALL·E', 2008, 8.4, 1180000, ['Animation', 'Adventure', 'Family'], 'Andrew Stanton'],
  ['movie', 'Coco', 2017, 8.4, 550000, ['Animation', 'Adventure', 'Family'], 'Lee Unkrich'],
  ['movie', 'Toy Story 3', 2010, 8.3, 880000, ['Animation', 'Adventure', 'Comedy'], 'Lee Unkrich'],
  ['movie', 'La La Land', 2016, 8.0, 620000, ['Comedy', 'Drama', 'Musical'], 'Damien Chazelle'],
  ['movie', 'Rocky', 1976, 8.1, 620000, ['Drama', 'Sport'], 'John G. Avildsen'],
  ['movie', 'Free Solo', 2018, 8.1, 130000, ['Documentary', 'Adventure', 'Sport'], 'Elizabeth Chai Vasarhelyi'],

  // ---- Short films ------------------------------------------------------
  ['short', 'Piper', 2016, 8.4, 45000, ['Short', 'Animation', 'Family'], 'Alan Barillaro'],
  ['short', 'Paperman', 2012, 8.0, 40000, ['Short', 'Animation', 'Romance'], 'John Kahrs'],
  ['short', 'La Jetée', 1962, 8.2, 40000, ['Short', 'Sci-Fi', 'Romance'], 'Chris Marker'],

  // ---- TV series --------------------------------------------------------
  ['tvSeries', 'Breaking Bad', 2008, 9.5, 2100000, ['Crime', 'Drama', 'Thriller'], 'Vince Gilligan'],
  ['tvSeries', 'Game of Thrones', 2011, 9.2, 2250000, ['Action', 'Adventure', 'Drama'], 'David Benioff'],
  ['tvSeries', 'The Wire', 2002, 9.3, 380000, ['Crime', 'Drama', 'Thriller'], 'David Simon'],
  ['tvSeries', 'The Sopranos', 1999, 9.2, 470000, ['Crime', 'Drama'], 'David Chase'],
  ['tvSeries', 'Chernobyl', 2019, 9.3, 880000, ['Drama', 'History', 'Thriller'], 'Craig Mazin'],
  ['tvSeries', 'The Crown', 2016, 8.6, 230000, ['Biography', 'Drama', 'History'], 'Peter Morgan'],
  ['tvSeries', 'Black Mirror', 2011, 8.7, 640000, ['Drama', 'Sci-Fi', 'Thriller'], 'Charlie Brooker'],
  ['tvSeries', 'The Office', 2005, 9.0, 700000, ['Comedy'], 'Greg Daniels'],
  ['tvSeries', 'Friends', 1994, 8.9, 1000000, ['Comedy', 'Romance'], 'David Crane'],
  ['tvSeries', 'Sherlock', 2010, 9.1, 980000, ['Crime', 'Drama', 'Mystery'], 'Mark Gatiss'],
  ['tvSeries', 'Stranger Things', 2016, 8.6, 1400000, ['Drama', 'Fantasy', 'Horror'], 'Matt Duffer'],
  ['tvSeries', 'Attack on Titan', 2013, 9.1, 500000, ['Animation', 'Action', 'Adventure'], 'Tetsuro Araki'],
  ['tvSeries', 'Rick and Morty', 2013, 9.1, 570000, ['Animation', 'Adventure', 'Comedy'], 'Dan Harmon'],
  ['tvSeries', 'Planet Earth II', 2016, 9.5, 160000, ['Documentary'], null],
  ['tvSeries', 'Jeopardy!', 1984, 8.6, 12000, ['Game-Show'], null],
  ['tvSeries', 'The Amazing Race', 2001, 7.5, 15000, ['Reality-TV', 'Adventure', 'Game-Show'], null],
  ['tvSeries', 'The Tonight Show Starring Johnny Carson', 1962, 8.5, 5000, ['Talk-Show', 'Comedy'], null],
  ['tvSeries', '60 Minutes', 1968, 8.3, 5000, ['News'], null],
];

const pad = (n, width) => String(n).padStart(width, '0');

// Normalise the compact records into rows for the five tables. name_id values
// are assigned in first-seen order over the distinct director names.
function buildDataset() {
  const titles = [];
  const ratings = [];
  const genres = [];
  const directors = [];
  const nameIdByPerson = new Map();

  RECORDS.forEach((record, i) => {
    const [type, title, year, rating, votes, titleGenres, director] = record;
    const titleId = `tt${pad(i + 1, 7)}`;

    titles.push({ title_id: titleId, title_type: type, original_title: title, start_year: year });
    ratings.push({ title_id: titleId, average_rating: rating, num_votes: votes });
    titleGenres.forEach((genre) => genres.push({ title_id: titleId, genre }));

    if (director) {
      if (!nameIdByPerson.has(director)) {
        nameIdByPerson.set(director, `nm${pad(nameIdByPerson.size + 1, 7)}`);
      }
      directors.push({ title_id: titleId, name_id: nameIdByPerson.get(director) });
    }
  });

  const people = [...nameIdByPerson.entries()].map(([full_name, name_id]) => ({ name_id, full_name }));

  return { titles, ratings, genres, people, directors };
}

export const DATASET = buildDataset();

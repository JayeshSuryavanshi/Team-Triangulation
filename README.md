# Triangulation — IMDb SQL Explorer

A React single-page app for exploring an IMDb-style movie & TV database with
SQL. Write free-form queries or run pre-built explorers (top movies, top TV
series, top directors, browse-by-genre) and view the results in a paginated
table.

**It runs entirely in your browser.** A real SQLite database (SQLite compiled to
WebAssembly via [sql.js](https://sql.js.org/)) is created in memory and seeded
from a bundled sample dataset — so there is no backend to run and no network
calls. Clone it, `npm install`, `npm run dev`, and you're querying.

> Originally a University at Buffalo *Data Management & Query Languages* (DMQL)
> course project (2022). The original frontend POSTed SQL to a Flask backend on
> an EC2 box; that server is long gone. This refined version embeds the database
> so the app is self-contained and runnable by anyone. The optional backend path
> is preserved — see [Using a real backend](#using-a-real-backend-optional).

## Features

- **SQL console** — write any SQL and run it against the in-browser database,
  with a schema reference and one-click example queries.
- **Top movies / TV series** — the top *N* highest-rated titles (with more than
  1,000 votes).
- **Top directors** — directors ranked by the average rating across their titles.
- **Browse by genre** — pick from 26 genres and list matching titles, best-rated
  first.
- **Paginated results** with adjustable page size.

## Tech stack

- [React 18](https://react.dev/) (function components + hooks)
- [Material UI v5](https://mui.com/) for the interface
- [sql.js](https://sql.js.org/) — SQLite compiled to WebAssembly, running in the
  browser
- [Vite](https://vite.dev/) for the dev server and production build, with
  [Vitest](https://vitest.dev/) for the test suite

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (a current LTS release) and npm.

### Installation

```bash
git clone https://github.com/JayeshSuryavanshi/Team-Triangulation.git
cd Team-Triangulation
npm install
```

Vite bundles the sql.js WebAssembly binary as a hashed asset automatically (via
an `import … ?url`), so there is no separate copy step to run.

### Running the app

```bash
npm run dev
```

Opens the app at [http://localhost:5173](http://localhost:5173) with hot reload.

### Tests

```bash
npm test
```

### Production build

```bash
npm run build
```

Outputs an optimized bundle to `dist/`. Because Vite `base` is set to `"./"`, the
build uses relative asset paths and can be served from any static host or
subpath.

## How it works

On first query the app initializes sql.js, creates the schema, and seeds it from
the bundled dataset (`src/db/data.js`). Every query then runs locally:

```
Panel / SQL console ──▶ runQuery(sql, params) ──▶ sql.js (SQLite/WASM) ──▶ { columns, rows } ──▶ ResultsTable
```

### Schema

| Table           | Columns                                              |
| --------------- | ---------------------------------------------------- |
| `titles`        | `title_id`, `title_type`, `original_title`, `start_year` |
| `title_ratings` | `title_id`, `average_rating`, `num_votes`            |
| `title_genres`  | `title_id`, `genre`                                  |
| `person_names`  | `name_id`, `full_name`                               |
| `directors`     | `title_id`, `name_id`                                |

### Project structure

```
src/
├── App.jsx                 # Layout: header, tabs, footer
├── queries.js              # Pre-built query builders + schema/example metadata
├── theme.js                # MUI theme
├── db/
│   ├── data.js             # Bundled sample dataset + schema DDL
│   └── index.js            # sql.js engine + runQuery()
├── hooks/
│   └── useQueryRunner.js   # Shared run/loading/error/result lifecycle
└── components/
    ├── SqlConsole.jsx      # Free-form SQL playground
    ├── TopNPanel.jsx       # Reusable "top N …" explorer
    ├── GenrePanel.jsx      # Browse-by-genre explorer
    └── ResultsTable.jsx    # Paginated MUI results table
```

## A note on SQL injection

The original version concatenated user input straight into SQL strings and sent
free-form SQL to a live database — a textbook injection hole. This version:

- passes all user input (the "top N" count, the selected genre) as **bound
  parameters**, never string concatenation; and
- runs the free-form SQL console against a **sandboxed, in-memory SQLite database
  that lives only in your browser tab** — there is no shared server or data to
  compromise. It's a SQL playground by design.

## Using a real backend (optional)

To point the app at a query API instead of the embedded database, set:

```bash
# .env
VITE_QUERY_API=https://your-host/query
```

Queries are then `POST`ed as `{ "query": "<sql>", "params": [...] }` and the
endpoint must return `{ "columns": [{ "Header", "accessor" }], "rows": [ ... ] }`.

## Data & attribution

The bundled dataset is a small, hand-curated set of well-known titles for
demonstration only — **not** the full [IMDb dataset](https://www.imdb.com/interfaces/).
Ratings and vote counts are approximate. IMDb is a trademark of IMDb.com, Inc.

## License

[MIT](./LICENSE) — built by the **Triangulation** team.

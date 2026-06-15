# Triangulation — IMDb Movie & TV Database Explorer

A React single-page web app for exploring an IMDb-style movies and TV database.
It provides a simple UI to run ad-hoc SQL queries and a set of pre-built "top N"
queries (top movies, top TV series, top directors, and titles by genre) against
a backend query API, displaying the results in paginated tables.

This is the frontend client built by the Triangulation team. It talks to a
separate backend service that executes SQL against the project database and
returns column/row JSON.

## Features

- **Free-form SQL query** — type any query and view the results in a table.
- **Top movies** — list the top N highest-rated movies (with more than 1000 votes).
- **Top TV series** — list the top N highest-rated TV series (with more than 1000 votes).
- **Top directors** — list the top N directors ranked by the average rating of their titles.
- **Browse by genre** — pick a genre (Action, Comedy, Drama, Horror, Sci-Fi, and ~20 more) and list matching titles.
- **Paginated results** — every result set is rendered with `react-table` (configurable page size).

## Tech Stack

- [React 18](https://reactjs.org/) (class components)
- [Create React App](https://github.com/facebook/create-react-app) / `react-scripts` (build tooling)
- [Material UI (MUI v5)](https://mui.com/) and `@material-ui/core` v4 for UI components
- [Emotion](https://emotion.sh/) for styling (MUI peer dependency)
- [`react-table-6`](https://www.npmjs.com/package/react-table-6) for rendering result tables
- Fetches data from a backend query API via `fetch` (HTTP `POST /query`)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (a current LTS release is recommended) and npm.
- Access to the backend query API. The frontend `POST`s queries to a query
  endpoint and expects a JSON response of the form `{ "columns": [...], "rows": [...] }`.
  The endpoint URL is currently hard-coded in `src/App.js`; update it there to
  point at your backend instance.

### Installation

```bash
git clone https://github.com/JayeshSuryavanshi/Team-Triangulation.git
cd Team-Triangulation
npm install
```

### Running the app

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
The page reloads automatically on changes.

### Running tests

```bash
npm test
```

Launches the test runner in interactive watch mode.

### Production build

```bash
npm run build
```

Builds the app into the `build/` folder, optimized and minified for deployment.

## Project Structure

```
.
├── public/                # Static assets and HTML template
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.js             # Main component: query form, top-N forms, genre selector
│   ├── TableComponent.js  # Renders query results in a paginated react-table
│   ├── index.js           # React entry point
│   ├── App.css / index.css
│   └── reportWebVitals.js
├── package.json
└── README.md
```

## How It Works

`App.js` builds SQL strings from user input (a free-form query, a count for the
top-N forms, or a selected genre) and sends them to the backend query endpoint.
The backend returns `columns` and `rows`, which are passed to `TableComponent`
and rendered as a paginated table.

## Notes

- The backend query endpoint is hard-coded in `src/App.js`. For a different
  environment, change that URL (and consider moving it to an environment
  variable / `.env` file).

---

Built by the **Triangulation** team.

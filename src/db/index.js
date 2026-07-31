// Embedded database layer.
//
// By default the app runs entirely in the browser: a real SQLite database
// (SQLite compiled to WebAssembly via sql.js) is created in memory and seeded
// from the bundled sample dataset. No server, no network.
//
// The original course project POSTed SQL to a Flask backend. That path is
// preserved as an opt-in: set VITE_QUERY_API to a query endpoint and every
// query is forwarded there instead. See README for the expected response shape.

import initSqlJs from 'sql.js';
// Vite emits the sql.js wasm as a hashed asset and gives us its URL. Used as the
// `locateFile` target for the browser build (replaces the old copy-to-public step).
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { SCHEMA, DATASET } from './data';

const API_URL = import.meta.env.VITE_QUERY_API;

let dbPromise = null;

function insertMany(db, table, columns, rows) {
  if (rows.length === 0) return;
  const placeholders = columns.map(() => '?').join(', ');
  const stmt = db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`);
  try {
    for (const row of rows) {
      stmt.run(columns.map((col) => row[col]));
    }
  } finally {
    stmt.free();
  }
}

// Applies the schema and seeds the sample data into a fresh sql.js Database.
// Exported so it can be exercised directly (see db.integration.test.js).
export function seedDatabase(db) {
  db.run(SCHEMA);
  insertMany(db, 'titles', ['title_id', 'title_type', 'original_title', 'start_year'], DATASET.titles);
  insertMany(db, 'title_ratings', ['title_id', 'average_rating', 'num_votes'], DATASET.ratings);
  insertMany(db, 'title_genres', ['title_id', 'genre'], DATASET.genres);
  insertMany(db, 'person_names', ['name_id', 'full_name'], DATASET.people);
  insertMany(db, 'directors', ['title_id', 'name_id'], DATASET.directors);
  return db;
}

async function createDb() {
  // Environment-aware wasm resolution:
  //  - Browser (dev/prod): load the binary from the URL Vite emits for the asset.
  //  - Vitest (node): pass no config so sql.js resolves the binary from its own
  //    installed dist directory on disk (node_modules/sql.js/dist/sql-wasm.wasm),
  //    where the Vite asset URL would not resolve.
  const options =
    import.meta.env.MODE === 'test' ? undefined : { locateFile: () => sqlWasmUrl };
  const SQL = await initSqlJs(options);

  return seedDatabase(new SQL.Database());
}

function getDb() {
  if (!dbPromise) {
    dbPromise = createDb().catch((err) => {
      // Reset so a later call can retry rather than caching a rejected promise.
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

// Shape sql.js output into { columns, rows } — columns are react-table style
// { Header, accessor } descriptors, rows are objects keyed by column name.
export function toResult(execResult) {
  if (!execResult || execResult.length === 0) {
    return { columns: [], rows: [] };
  }
  const { columns: names, values } = execResult[0];
  const columns = names.map((name) => ({ Header: name, accessor: name }));
  const rows = values.map((value) =>
    Object.fromEntries(names.map((name, i) => [name, value[i]]))
  );
  return { columns, rows };
}

/**
 * Run a SQL query and resolve to { columns, rows }.
 * Uses the embedded SQLite database unless REACT_APP_QUERY_API is configured,
 * in which case the query is forwarded to that backend.
 */
export async function runQuery(sql, params = []) {
  if (API_URL) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sql, params }),
    });
    if (!response.ok) {
      throw new Error(`Query API responded with ${response.status}`);
    }
    return response.json();
  }

  const db = await getDb();
  // db.exec supports bound parameters, keeping user input out of the SQL string.
  return toResult(db.exec(sql, params));
}

import { DATASET } from './data';
import { GENRES } from '../queries';

const { titles, ratings, genres, people, directors } = DATASET;

test('every title has exactly one rating', () => {
  expect(ratings).toHaveLength(titles.length);
  const titleIds = new Set(titles.map((t) => t.title_id));
  for (const r of ratings) {
    expect(titleIds.has(r.title_id)).toBe(true);
    expect(r.num_votes).toBeGreaterThan(0);
  }
});

test('director rows reference real titles and people', () => {
  const titleIds = new Set(titles.map((t) => t.title_id));
  const nameIds = new Set(people.map((p) => p.name_id));
  for (const d of directors) {
    expect(titleIds.has(d.title_id)).toBe(true);
    expect(nameIds.has(d.name_id)).toBe(true);
  }
});

test('name_id values are unique', () => {
  expect(new Set(people.map((p) => p.name_id)).size).toBe(people.length);
});

test('every browsable genre has at least one title', () => {
  const present = new Set(genres.map((g) => g.genre));
  const missing = GENRES.filter((g) => !present.has(g));
  expect(missing).toEqual([]);
});

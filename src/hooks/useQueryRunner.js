import { useCallback, useRef, useState } from 'react';
import { runQuery } from '../db';

// Encapsulates the run/loading/error/result lifecycle shared by every panel.
// Replaces the five near-identical fetch handlers in the original App.js.
export default function useQueryRunner() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guards against an earlier slow query overwriting a newer one's result.
  const runId = useRef(0);

  const run = useCallback(async (sql, params = []) => {
    const id = ++runId.current;
    setLoading(true);
    setError(null);
    try {
      const data = await runQuery(sql, params);
      if (id === runId.current) setResult(data);
    } catch (err) {
      if (id === runId.current) {
        setError(err instanceof Error ? err.message : String(err));
        setResult(null);
      }
    } finally {
      if (id === runId.current) setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    runId.current += 1;
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { result, loading, error, run, reset };
}

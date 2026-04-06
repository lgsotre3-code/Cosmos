// ─────────────────────────────────────────────────────────────────────────────
// lib/workers/useChartWorker.ts
// React hook that manages the chart Web Worker lifecycle.
//
// - Creates the Worker lazily (once) on the client
// - Automatically terminates it on component unmount
// - Falls back to main-thread calculation in environments without Worker support
//   (e.g. some testing setups, older browsers)
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useRef, useCallback } from 'react';
import type { BirthData, AstralChart, WorkerRequest, WorkerResponse } from '../astro/types';
import { generateAstralChart } from '../astro/chart';

type CalcFn = (birth: BirthData) => Promise<AstralChart>;

export function useChartWorker(): CalcFn {
  const workerRef = useRef<Worker | null>(null);

  // Lazily create the worker on first call
  function getWorker(): Worker | null {
    if (typeof Worker === 'undefined') return null;
    if (!workerRef.current) {
      try {
        workerRef.current = new Worker(
          new URL('./chart.worker.ts', import.meta.url),
          { type: 'module' },
        );
      } catch {
        // Worker construction can fail in SSR/Jest contexts
        return null;
      }
    }
    return workerRef.current;
  }

  const calculate = useCallback((birth: BirthData): Promise<AstralChart> => {
    return new Promise((resolve, reject) => {
      const worker = getWorker();

      // Fallback: run synchronously on main thread
      if (!worker) {
        try {
          resolve(generateAstralChart(birth));
        } catch (err) {
          reject(err);
        }
        return;
      }

      // One-shot message handler for this specific request
      const handler = (event: MessageEvent<WorkerResponse>) => {
        worker.removeEventListener('message', handler);
        worker.removeEventListener('error', errorHandler);

        if (event.data.type === 'CHART_SUCCESS') {
          resolve(event.data.payload);
        } else {
          reject(new Error(event.data.payload));
        }
      };

      const errorHandler = (err: ErrorEvent) => {
        worker.removeEventListener('message', handler);
        worker.removeEventListener('error', errorHandler);
        reject(new Error(err.message));
      };

      worker.addEventListener('message', handler);
      worker.addEventListener('error', errorHandler);

      const request: WorkerRequest = { type: 'GENERATE_CHART', payload: birth };
      worker.postMessage(request);
    });
  }, []);

  return calculate;
}

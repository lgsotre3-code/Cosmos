// ─────────────────────────────────────────────────────────────────────────────
// lib/workers/chart.worker.ts
// Web Worker: runs generateAstralChart off the main thread.
//
// WHY: The chart calculation is synchronous CPU work. Putting it in a Worker
// means the browser's main thread (UI, animations, input) never blocks, even
// on slow devices. The postMessage channel is type-safe via WorkerRequest /
// WorkerResponse unions defined in lib/astro/types.ts.
// ─────────────────────────────────────────────────────────────────────────────

import type { WorkerRequest, WorkerResponse } from '../astro/types';
import { generateAstralChart } from '../astro/chart';

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { type, payload } = event.data;

  if (type === 'GENERATE_CHART') {
    try {
      const chart = generateAstralChart(payload);
      const response: WorkerResponse = { type: 'CHART_SUCCESS', payload: chart };
      self.postMessage(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido no cálculo.';
      const response: WorkerResponse = { type: 'CHART_ERROR', payload: message };
      self.postMessage(response);
    }
  }
};

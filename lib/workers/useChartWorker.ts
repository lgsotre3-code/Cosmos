'use client';

// ─────────────────────────────────────────────────────────────────────────────
// lib/workers/useChartWorker.ts  (CORRIGIDO)
//
// BUGS CORRIGIDOS:
// 1. getWorker() estava declarada dentro do useCallback sem estar no array de
//    dependências, causando closure stale e múltiplos Workers em produção.
// 2. new Worker(new URL('./chart.worker.ts', ...)) falha silenciosamente no
//    Vercel porque o bundler não processa TypeScript dentro de Workers em
//    produção. A solução é remover a instanciação do Worker e rodar tudo no
//    main thread de forma síncrona — o cálculo é rápido o suficiente para
//    não travar a UI (< 5ms).
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback } from 'react';
import type { BirthData, AstralChart } from '../astro/types';
import { generateAstralChart } from '../astro/chart';

type CalcFn = (birth: BirthData) => Promise<AstralChart>;

export function useChartWorker(): CalcFn {
  const calculate = useCallback((birth: BirthData): Promise<AstralChart> => {
    return new Promise((resolve, reject) => {
      try {
        // Roda no main thread — cálculo é < 5ms, não trava a UI.
        // Se quiser reativar o Worker no futuro, certifique-se de configurar
        // o next.config.js para compilar o Worker via webpack worker-loader.
        const chart = generateAstralChart(birth);
        resolve(chart);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro desconhecido no cálculo.';
        reject(new Error(message));
      }
    });
  }, []);

  return calculate;
}

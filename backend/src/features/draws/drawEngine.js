import crypto from 'crypto';
import { supabaseAdmin } from '../../config/db.js';
import logger from '../../config/logger.js';

// Generate 5 unique random integers between 1 and 45 inclusive
const generateRandomNumbers = () => {
  const numbers = new Set();
  while (numbers.size < 5) {
    numbers.add(crypto.randomInt(1, 46));
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

// Build frequency map of all scores across active subscribers for a given month
const buildFrequencyMap = async (drawMonth) => {
  const [year, month] = drawMonth.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const { data: scores, error } = await supabaseAdmin
    .from('scores')
    .select('score, user_id, profiles!inner(subscription_status)')
    .eq('profiles.subscription_status', 'active')
    .gte('played_date', startDate)
    .lte('played_date', endDate);

  if (error) {
    logger.error({
      message: 'buildFrequencyMap: query failed',
      error: error.message,
      drawMonth,
    });
    throw error;
  }

  // Initialise all numbers 1-45 with zero frequency
  const frequencyMap = {};
  for (let i = 1; i <= 45; i++) {
    frequencyMap[i] = 0;
  }

  // Count how many times each score value appears
  scores.forEach(({ score }) => {
    frequencyMap[score]++;
  });

  return frequencyMap;
};

// Weighted random selection biased by frequency map
const weightedRandom = (frequencyMap, mode) => {
  const entries = Object.entries(frequencyMap);

  // Sort by frequency: frequent mode = high first, rare mode = low first
  entries.sort((a, b) =>
    mode === 'frequent' ? b[1] - a[1] : a[1] - b[1]
  );

  // Build weighted pool: higher rank = more entries in pool = higher chance
  const pool = [];
  entries.forEach(([num, _freq], index) => {
    const weight = entries.length - index;
    for (let i = 0; i < weight; i++) {
      pool.push(parseInt(num));
    }
  });

  // Fisher-Yates shuffle on pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Pick first 5 unique numbers
  const result = new Set();
  for (const num of pool) {
    if (result.size === 5) break;
    result.add(num);
  }

  // Fallback: fill remaining slots with random numbers if pool was too small
  while (result.size < 5) {
    result.add(crypto.randomInt(1, 46));
  }

  return Array.from(result).sort((a, b) => a - b);
};

// Calculate how many of a user's scores match the drawn numbers
const calculateMatchCount = (userScores, drawnNumbers) => {
  const drawnSet = new Set(drawnNumbers);
  return userScores.filter((s) => drawnSet.has(s)).length;
};

// Main draw execution — returns 5 drawn numbers
const executeDraw = async ({ drawType, algorithmMode, drawMonth }) => {
  let drawnNumbers;

  if (drawType === 'random') {
    drawnNumbers = generateRandomNumbers();
    logger.info({
      message: 'executeDraw: random draw completed',
      drawnNumbers,
      drawMonth,
    });
  } else {
    const frequencyMap = await buildFrequencyMap(drawMonth);
    drawnNumbers = weightedRandom(frequencyMap, algorithmMode);
    logger.info({
      message: 'executeDraw: algorithmic draw completed',
      drawnNumbers,
      drawMonth,
      algorithmMode,
    });
  }

  return drawnNumbers;
};

export {
  executeDraw,
  calculateMatchCount,
  generateRandomNumbers,
  buildFrequencyMap,
};
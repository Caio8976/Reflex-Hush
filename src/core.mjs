export function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
export function nextDelay(random = Math.random) {
  return 1400 + Math.floor(random() * 2600);
}
export function recordRound(state, time) {
  if (state.phase !== 'go' || !Number.isFinite(time) || time < 0) return state;
  const times = [...state.times, time];
  return { phase: times.length === 5 ? 'done' : 'between', times };
}

import { median, nextDelay, recordRound } from './core.mjs';
const $ = id => document.getElementById(id);
let state = { phase: 'idle', times: [] };
let timer;
let start = 0;
let best = null;
try { const saved = Number(localStorage.getItem('reflex-rush:best')); if (saved > 0) best = saved; } catch {}
function render() {
  $('round').textContent = `${state.times.length} / 5`;
  $('median').textContent = state.times.length ? Math.round(median(state.times)) : '—';
  $('best').textContent = best === null ? '—' : Math.round(best);
  $('results').replaceChildren(...state.times.map(time => {
    const item = document.createElement('li');
    item.textContent = `${Math.round(time)} ms`;
    return item;
  }));
  $('pad').dataset.state = state.phase;
}
function message(cue, detail) { $('cue').textContent = cue; $('detail').textContent = detail; }
function begin() {
  clearTimeout(timer);
  state.phase = 'waiting';
  message('Hold it…', 'Wait for the green pad');
  $('announcement').textContent = '';
  render();
  timer = setTimeout(() => {
    state.phase = 'go';
    message('GO!', 'Click or press Space');
    render();
    start = performance.now();
  }, nextDelay());
}
function activate() {
  if (state.phase === 'waiting') {
    clearTimeout(timer);
    state.phase = 'between';
    message('Too early.', 'Click to retry this round');
    $('announcement').textContent = 'False start. Your completed rounds are safe.';
  } else if (state.phase === 'go') {
    const time = performance.now() - start;
    state = recordRound(state, time);
    if (state.phase === 'done') {
      const score = median(state.times);
      if (best === null || score < best) {
        best = score;
        try { localStorage.setItem('reflex-rush:best', String(best)); } catch {}
      }
      message(`${Math.round(score)} ms`, 'Session median · Click to play again');
      $('announcement').textContent = 'Five rounds complete.';
    } else message(`${Math.round(time)} ms`, 'Click for the next round');
  } else {
    if (state.phase === 'done') state.times = [];
    begin();
  }
  render();
}
$('pad').addEventListener('pointerdown', event => { if (event.button === 0) { event.preventDefault(); $('pad').focus(); activate(); } });
$('pad').addEventListener('click', event => { if (event.detail === 0) activate(); });
document.addEventListener('keydown', event => {
  if (event.code === 'Space' && !event.repeat && !['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(event.target.tagName)) { event.preventDefault(); activate(); }
});
$('reset').addEventListener('click', () => { clearTimeout(timer); state = { phase: 'idle', times: [] }; message('Ready when you are.', 'Click here or press Space to start'); $('announcement').textContent = ''; render(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden && ['waiting','go'].includes(state.phase)) { clearTimeout(timer); state.phase = 'between'; message('Round paused.', 'Click to retry when you are back'); render(); }
});
render();

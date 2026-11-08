// Site49: scroll effects, parallax, How-it-works stepper and the optional scene sound.
// Self-hosted, no trackers. Motion is skipped when the visitor prefers reduced motion.
(() => {
  const doc = document.documentElement;
  const motionQ = matchMedia('(prefers-reduced-motion: no-preference)');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked: choice lasts this page only */ } },
  };

  /* ---------- header state, progress bar, parallax ---------- */
  const header = document.querySelector('.site-header');
  const bar = document.querySelector('.progress');
  const layers = [...document.querySelectorAll('[data-speed]')];
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, max = doc.scrollHeight - innerHeight;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (bar) bar.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
    if (!motionQ.matches) return;
    const vh = innerHeight;
    for (const el of layers) {
      const box = (el.parentElement || el).getBoundingClientRect();
      if (box.bottom < -200 || box.top > vh + 200) continue;
      const centre = box.top + box.height / 2 - vh / 2;
      el.style.transform = `translate3d(0,${(centre * -parseFloat(el.dataset.speed)).toFixed(1)}px,0)`;
    }
  }
  const schedule = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  motionQ.addEventListener('change', () => { if (!motionQ.matches) layers.forEach(l => (l.style.transform = '')); schedule(); });
  schedule();

  /* ---------- scroll reveal ---------- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('in'));

  /* ---------- How it works: highlight the step in view, swap the sticky screen ---------- */
  const steps = [...document.querySelectorAll('.step')];
  const panes = [...document.querySelectorAll('.pane')];
  const stepCap = document.querySelector('.caption-step');
  const url = document.querySelector('.how-visual .screen-bar span');
  function activate(i) {
    steps.forEach((s, k) => s.classList.toggle('active', k === i));
    panes.forEach((p, k) => p.classList.toggle('show', k === i));
    if (stepCap && steps[i]) stepCap.textContent = `Step ${i + 1} of ${steps.length}: ${steps[i].querySelector('h3').textContent}`;
    if (url && panes[i]) url.textContent = panes[i].dataset.url || url.textContent;
  }
  if (steps.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) activate(steps.indexOf(e.target)); }), { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(s => so.observe(s));
    activate(0);
  }

  /* ---------- domain address typing ---------- */
  const typed = document.querySelector('[data-type]');
  if (typed) {
    const words = typed.dataset.type.split('|');
    if (!motionQ.matches) typed.textContent = words[0];
    else {
      let w = 0, c = 0, dir = 1, started = false;
      const tick = () => {
        const word = words[w];
        c += dir; typed.textContent = word.slice(0, c);
        let wait = dir > 0 ? 75 : 35;
        if (c >= word.length) { dir = -1; wait = 1800; }
        else if (c <= 0) { dir = 1; w = (w + 1) % words.length; wait = 400; }
        setTimeout(tick, wait);
      };
      new IntersectionObserver((es, o) => { if (!started && es[0].isIntersecting) { started = true; o.disconnect(); tick(); } }).observe(typed);
    }
  }

  /* ---------- videos: one at a time; ambient sound waits while a video plays ---------- */
  const videos = [...document.querySelectorAll('video.vid')];
  let videoPlaying = false;
  const onVideoChange = () => { videoPlaying = videos.some(v => !v.paused && !v.muted); if (window.site49Ambient) window.site49Ambient(); };
  videos.forEach(v => {
    v.addEventListener('play', () => { if (!v.muted) videos.forEach(o => { if (o !== v && !o.paused && !o.muted) o.pause(); }); onVideoChange(); });
    v.addEventListener('pause', onVideoChange);
    v.addEventListener('ended', onVideoChange);
    v.addEventListener('volumechange', () => {
      if (!v.muted) videos.forEach(o => { if (o !== v && !o.paused) o.pause(); });
      onVideoChange();
    });
  });
  // Welcome video: a small silent preview (about 350 KB) loops muted while on screen; never with sound on its own.
  // The full video with sound loads only when the visitor presses "Play with sound".
  const welcome = document.querySelector('video[data-autoplay]');
  const pauseBtn = document.querySelector('.vid-pause');
  const saveData = navigator.connection && navigator.connection.saveData;
  let userPaused = false, inView = false;
  const setPauseBtn = () => {
    if (!pauseBtn) return;
    const playing = !welcome.paused;
    pauseBtn.classList.toggle('is-paused', !playing);
    pauseBtn.querySelector('.lbl').textContent = playing ? 'Pause preview' : 'Play preview';
  };
  if (welcome) {
    welcome.addEventListener('play', setPauseBtn); welcome.addEventListener('pause', setPauseBtn);
    if (pauseBtn) {
      pauseBtn.hidden = false; setPauseBtn();
      pauseBtn.addEventListener('click', () => {
        if (welcome.paused) { userPaused = false; welcome.play().catch(() => {}); }
        else { userPaused = true; welcome.pause(); }
      });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(e => {
        inView = e.isIntersecting;
        if (!welcome.muted) return;
        if (inView && motionQ.matches && !saveData && !userPaused) welcome.play().catch(() => {});
        else if (!inView) welcome.pause();
      }), { threshold: 0.4 }).observe(welcome);
    }
  }
  document.querySelectorAll('.vid-sound').forEach(b => b.addEventListener('click', () => {
    const v = document.querySelector(`video[data-video="${b.dataset.for}"]`);
    if (v.dataset.full && !v.dataset.loadedFull) { v.dataset.loadedFull = '1'; v.src = v.dataset.full; }
    v.muted = false; v.loop = false; v.controls = true; v.currentTime = 0;
    const t = v.textTracks && v.textTracks[0]; if (t) t.mode = 'showing';
    v.play().catch(() => {}); b.hidden = true; if (pauseBtn && v === welcome) pauseBtn.hidden = true; v.focus();
  }));

  /* ---------- marquee: pause control (choice remembered on this device) ---------- */
  const marquee = document.querySelector('.marquee');
  const mBtn = document.querySelector('.marquee-pause');
  if (marquee && mBtn) {
    const setM = paused => { marquee.classList.toggle('paused', paused); mBtn.textContent = paused ? 'Play scrolling list' : 'Pause scrolling list'; };
    setM(store.get('site49-marquee') === 'paused');
    mBtn.addEventListener('click', () => { const p = !marquee.classList.contains('paused'); setM(p); store.set('site49-marquee', p ? 'paused' : 'playing'); });
  }

  /* ---------- scene sound: off by default, plays only after the visitor turns it on ---------- */
  const btn = document.querySelector('.sound-btn');
  const scenes = [...document.querySelectorAll('[data-sound]')];
  if (!btn) return;
  const base = btn.dataset.base || 'assets/audio/';
  const tracks = {};
  const visible = new Map();
  // Always starts off on every page; only the Sound button turns it on (no auto-resume from a past visit).
  let on = false;
  let current = null;

  function track(name) {
    if (!tracks[name]) {
      const a = new Audio(base + name + '.mp3');
      a.loop = true; a.preload = 'auto'; a.volume = 0;
      tracks[name] = { a, target: 0 };
    }
    return tracks[name];
  }
  function fade() {
    let busy = false;
    for (const t of Object.values(tracks)) {
      const v = t.a.volume, d = t.target - v;
      if (Math.abs(d) > 0.01) { t.a.volume = Math.min(1, Math.max(0, v + Math.sign(d) * 0.02)); busy = true; }
      else { t.a.volume = t.target; if (t.target === 0 && !t.a.paused) t.a.pause(); }
    }
    if (busy) requestAnimationFrame(fade);
  }
  function pick() {
    let best = null, ratio = 0;
    visible.forEach((r, el) => { if (r > ratio) { ratio = r; best = el; } });
    return best && ratio > 0.25 ? best.dataset.sound : null;
  }
  function update() {
    const want = on && !videoPlaying ? pick() : null;
    if (want !== current) {
      if (current) track(current).target = 0;
      if (want) { const t = track(want); t.target = 0.55; t.a.play().catch(() => {}); }
      current = want;
    }
    requestAnimationFrame(fade);
  }
  function render() {
    btn.setAttribute('aria-pressed', String(on));
    btn.title = on ? 'Turn scene sound off' : 'Turn scene sound on';
  }
  btn.addEventListener('click', () => {
    on = !on; render(); update();
  });
  if ('IntersectionObserver' in window && scenes.length) {
    const ao = new IntersectionObserver(es => { es.forEach(e => visible.set(e.target, e.intersectionRatio)); update(); }, { threshold: [0, .25, .5, .75, 1] });
    scenes.forEach(s => ao.observe(s));
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) Object.values(tracks).forEach(t => t.a.pause()); else if (current) track(current).a.play().catch(() => {}); });
  window.site49Ambient = update;
  render();
})();

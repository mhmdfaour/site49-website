// Site49: scroll effects, parallax and the How-it-works stepper.
// Self-hosted, no trackers. Counts visits without cookies (see "visit counting" below). Motion is skipped when the visitor prefers reduced motion.
(() => {
  /* ---------- visit counting: no cookie, no storage; sends only when the page carries the s49-stats meta tag ---------- */
  try {
    const meta = document.querySelector('meta[name="s49-stats"]');
    const endpoint = meta && meta.content;
    const host = location.hostname.toLowerCase();
    const live = (location.protocol === 'https:' && (host === 'site49.co.za' || host === 'www.site49.co.za')) || (location.protocol === 'http:' && host === 'localhost');
    if (endpoint && live && !navigator.webdriver) {
      const send = body => {
        try {
          const data = JSON.stringify(body);
          if (navigator.sendBeacon && navigator.sendBeacon(endpoint, new Blob([data], { type: 'text/plain' }))) return;
          fetch(endpoint, { method: 'POST', body: data, keepalive: true, mode: 'no-cors', credentials: 'omit' }).catch(() => {});
        } catch { /* counting never affects the page */ }
      };
      const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (!document.prerendering && !(nav && nav.type === 'back_forward')) {
        let ref = '';
        try { ref = new URL(document.referrer).hostname.toLowerCase().replace(/^www\./, ''); } catch { /* no referrer */ }
        send({ k: 'view', p: location.pathname, r: ref });
      }
      const buttons = [['https://app.site49.co.za/signup', 'signup'], ['https://app.site49.co.za/login', 'login'], ['https://wa.me/', 'whatsapp']];
      document.addEventListener('click', e => {
        const a = e.target && e.target.closest && e.target.closest('a[href]');
        const hit = a && buttons.find(b => a.href.startsWith(b[0]));
        if (hit) send({ k: 'click', p: location.pathname, r: '', b: hit[1] });
      });
    }
  } catch { /* counting never affects the page */ }

})();

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

  /* ---------- videos: one at a time ---------- */
  const videos = [...document.querySelectorAll('video.vid')];
  const onVideoChange = () => {};
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

})();

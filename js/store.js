/* Hong Seh repair tracker: data store.
   No backend. Jobs live in localStorage, seeded from data/demo-jobs.js on first visit.
   If localStorage is blocked (private window, embedded preview), it falls back to memory.
   To move to a real API, keep this interface (find / save / reset / codes) and swap the bodies
   for fetch('/api/jobs/' + code) and so on. */
(function () {
  const KEY = HS_CONFIG.storageKey;
  let mem = null;

  function load() {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function persist(db) {
    mem = db;
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* memory only */ }
  }
  function seed() {
    const db = { version: HS_CONFIG.dataVersion, jobs: {} };
    HS_DEMO_JOBS().forEach(j => { db.jobs[j.code] = j; });
    persist(db);
    return db;
  }
  function db() {
    if (mem) return mem;
    const stored = load();
    mem = (stored && stored.version === HS_CONFIG.dataVersion) ? stored : seed();
    return mem;
  }
  function normalise(code) {
    const c = String(code || '').trim().toUpperCase().replace(/\s+/g, '');
    const m = c.match(/^HS-?(\d{3,6})$/);
    return m ? 'HS-' + m[1] : c;
  }

  window.HSStore = {
    normalise,
    find(code) { const j = db().jobs[normalise(code)]; return j ? JSON.parse(JSON.stringify(j)) : null; },
    save(job) { const d = db(); d.jobs[job.code] = job; persist(d); },
    reset() { try { localStorage.removeItem(KEY); } catch (e) {} mem = null; seed(); },
    codes() { return Object.keys(db().jobs); },
    // Re-read when another tab (e.g. the job card) changes the data
    onChange(cb) { window.addEventListener('storage', e => { if (e.key === KEY) { mem = null; cb(); } }); }
  };
})();

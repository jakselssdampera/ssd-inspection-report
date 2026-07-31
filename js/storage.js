/**
 * storage.js
 * localStorage & sessionStorage operations for workshop info,
 * current report data, and login session management.
 */

const STORAGE_KEYS = {
  WORKSHOP: 'cir_workshop_info',
  REPORT:   'cir_current_report',
  SESSION:  'cir_session'
};

// ─── In-memory cache (cache-first pattern) ───────────────────────────
let _cache = {
  workshop: null,
  report: null
};

// ─── Helpers ─────────────────────────────────────────────────────────

function safeJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function safeJSONStringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch {
    console.error('[Storage] Failed to stringify data');
    return null;
  }
}

// ─── Workshop Info ───────────────────────────────────────────────────

function loadWorkshopInfo() {
  if (_cache.workshop) return _cache.workshop;

  const stored = localStorage.getItem(STORAGE_KEYS.WORKSHOP);
  if (stored) {
    _cache.workshop = safeJSONParse(stored);
    return _cache.workshop;
  }

  // First time — use defaults from form-data.js
  _cache.workshop = { ...DEFAULT_WORKSHOP };
  saveWorkshopInfo(_cache.workshop);
  return _cache.workshop;
}

function saveWorkshopInfo(data) {
  _cache.workshop = data;
  const json = safeJSONStringify(data);
  if (json) {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKSHOP, json);
    } catch (e) {
      console.error('[Storage] Failed to save workshop info:', e);
    }
  }
}

// ─── Current Report ──────────────────────────────────────────────────

function createEmptyReport() {
  const inspections = {};
  INSPECTION_CATEGORIES.forEach(cat => {
    inspections[cat.id] = {};
    cat.items.forEach(item => {
      inspections[cat.id][item.id] = {
        status: 'unchecked',
        note: '',
        photos: []
      };
    });
  });

  return {
    customer: {},
    inspections: inspections,
    summary: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function loadReport() {
  if (_cache.report) return _cache.report;

  const stored = localStorage.getItem(STORAGE_KEYS.REPORT);
  if (stored) {
    _cache.report = safeJSONParse(stored);
    if (_cache.report) return _cache.report;
  }

  _cache.report = createEmptyReport();
  return _cache.report;
}

function saveReport(data) {
  if (!data) return;
  data.updatedAt = new Date().toISOString();
  _cache.report = data;

  const json = safeJSONStringify(data);
  if (json) {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORT, json);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('[Storage] localStorage quota exceeded. Consider reducing photo quality.');
        showToast('Penyimpanan penuh! Kurangi jumlah foto.', 'danger');
      } else {
        console.error('[Storage] Failed to save report:', e);
      }
    }
  }
}

function updateReportField(path, value) {
  const report = loadReport();
  const keys = path.split('.');
  let obj = report;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!obj[keys[i]]) obj[keys[i]] = {};
    obj = obj[keys[i]];
  }
  obj[keys[keys.length - 1]] = value;

  saveReport(report);
  return report;
}

function resetReport() {
  _cache.report = null;
  localStorage.removeItem(STORAGE_KEYS.REPORT);
  _cache.report = createEmptyReport();
  saveReport(_cache.report);
  return _cache.report;
}

// ─── Login Session ───────────────────────────────────────────────────

function isLoggedIn() {
  return sessionStorage.getItem(STORAGE_KEYS.SESSION) === 'true';
}

function setLoggedIn(val) {
  if (val) {
    sessionStorage.setItem(STORAGE_KEYS.SESSION, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

function authenticate(username, password) {
  if (username === AUTH_CREDENTIALS.username && password === AUTH_CREDENTIALS.password) {
    setLoggedIn(true);
    return true;
  }
  return false;
}

function logout() {
  setLoggedIn(false);
}

// ─── Derived State Helpers ───────────────────────────────────────────

function getInspectionStats() {
  const report = loadReport();
  const stats = { good: 0, warning: 0, danger: 0, unchecked: 0, total: 0 };

  INSPECTION_CATEGORIES.forEach(cat => {
    cat.items.forEach(item => {
      const data = report.inspections?.[cat.id]?.[item.id];
      const status = data?.status || 'unchecked';
      stats[status]++;
      stats.total++;
    });
  });

  return stats;
}

function getCategoryStats(categoryId) {
  const report = loadReport();
  const stats = { good: 0, warning: 0, danger: 0, unchecked: 0, total: 0 };
  const catData = report.inspections?.[categoryId];

  if (catData) {
    Object.values(catData).forEach(item => {
      const status = item.status || 'unchecked';
      stats[status]++;
      stats.total++;
    });
  }

  return stats;
}

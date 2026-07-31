/**
 * app.js
 * Entry point & orchestrator.
 * Initializes all modules, manages login flow, and wires up events.
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Check login state
  if (isLoggedIn()) {
    showAppView();
    bootstrapApp();
  } else {
    showLoginView();
  }

  // Login form handler
  initLoginForm();
}

// ─── Login ───────────────────────────────────────────────────────────

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    if (!username || !password) {
      errorEl.textContent = 'Username dan password harus diisi.';
      errorEl.classList.add('visible');
      return;
    }

    if (authenticate(username, password)) {
      errorEl.classList.remove('visible');
      showAppView();
      bootstrapApp();
    } else {
      errorEl.textContent = 'Username atau password salah.';
      errorEl.classList.add('visible');
      // Shake animation
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    }
  });

  // Password visibility toggle
  const toggleBtn = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('login-password');
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      toggleBtn.setAttribute('aria-label', type === 'password' ? 'Tampilkan password' : 'Sembunyikan password');
      // Update icon
      const icon = toggleBtn.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
        if (window.lucide) lucide.createIcons({ nodes: [toggleBtn] });
      }
    });
  }
}

// ─── Bootstrap App ───────────────────────────────────────────────────

function bootstrapApp() {
  // Load & render workshop header
  renderWorkshopHeader();

  // Render customer form
  renderCustomerForm();

  // Render inspection forms
  renderInspectionForms();

  // Initialize inspection events (status, notes, photos)
  initInspectionEvents();

  // Render summary form
  renderSummaryForm();

  // Initialize sidebar navigation
  initSidebarNav();
  initMobileSidebar();

  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();

  // Wire up global actions
  initGlobalActions();
}

// ─── Workshop Header ─────────────────────────────────────────────────

function renderWorkshopHeader() {
  const workshop = loadWorkshopInfo();
  const container = document.getElementById('workshop-header-info');
  if (!container) return;

  const logoEl = document.getElementById('workshop-logo');
  if (logoEl) logoEl.src = workshop.logo;

  const nameEl = document.getElementById('workshop-name');
  if (nameEl) nameEl.textContent = workshop.name;

  const detailEl = document.getElementById('workshop-details');
  if (detailEl) {
    detailEl.innerHTML = `
      <p>${workshop.address}</p>
      <p>
        <i data-lucide="phone" class="inline-icon"></i> ${workshop.phone}
        <span class="separator">|</span>
        <i data-lucide="message-circle" class="inline-icon"></i> WA: ${workshop.whatsapp}
      </p>
      <p>
        <i data-lucide="mail" class="inline-icon"></i> ${workshop.email}
      </p>
    `;
    if (window.lucide) lucide.createIcons({ nodes: [detailEl] });
  }
}

// ─── Global Actions ──────────────────────────────────────────────────

function initGlobalActions() {
  // Download PDF
  const pdfBtn = document.getElementById('btn-download-pdf');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', () => generatePDF());
  }

  // Reset Report
  const resetBtn = document.getElementById('btn-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      showConfirmModal(
        'Reset Report',
        'Semua data inspeksi akan dihapus dan form akan dikosongkan. Lanjutkan?',
        () => {
          resetReport();
          bootstrapApp();
          showToast('Report berhasil direset.', 'info');
        }
      );
    });
  }

  // Logout
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      showLoginView();
      showToast('Berhasil logout.', 'info');
    });
  }
}

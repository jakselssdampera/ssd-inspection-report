/**
 * pdf-export.js
 * Generates professional PDF report from current inspection data.
 * Uses html2pdf.js for client-side PDF generation.
 */

// ─── Generate PDF ────────────────────────────────────────────────────

async function generatePDF() {
  const btn = document.getElementById('btn-download-pdf');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader" class="spin"></i> Membuat PDF...';
    if (window.lucide) lucide.createIcons({ nodes: [btn] });
  }

  try {
    const report = loadReport();
    const workshop = loadWorkshopInfo();
    const pdfContent = buildPDFContent(report, workshop);

    // Create temporary container
    const tempDiv = document.createElement('div');
    tempDiv.id = 'pdf-render-container';
    tempDiv.innerHTML = pdfContent;
    document.body.appendChild(tempDiv);

    // Configure html2pdf
    const options = {
      margin: [10, 10, 15, 10],
      filename: generateFilename(report),
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    await html2pdf().set(options).from(tempDiv).save();

    // Cleanup
    tempDiv.remove();
    showToast('PDF berhasil didownload!', 'good');
  } catch (err) {
    console.error('[PDF] Generation failed:', err);
    showToast('Gagal membuat PDF. Coba lagi.', 'danger');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="download"></i> Download PDF';
      if (window.lucide) lucide.createIcons({ nodes: [btn] });
    }
  }
}

// ─── Build PDF HTML Content ──────────────────────────────────────────

function buildPDFContent(report, workshop) {
  return `
    <div class="pdf-document">
      ${buildPDFHeader(workshop)}
      ${buildPDFCustomerInfo(report)}
      ${buildPDFInspections(report)}
      ${buildPDFSummary(report)}
      ${buildPDFFooter(report, workshop)}
    </div>
  `;
}

// ─── PDF Header ──────────────────────────────────────────────────────

function buildPDFHeader(workshop) {
  return `
    <div class="pdf-header">
      <div class="pdf-header-text">
        <h1 class="pdf-workshop-name">${workshop.name}</h1>
        <p class="pdf-workshop-detail">${workshop.address}</p>
        <p class="pdf-workshop-detail"><i>Telp/Whatsapp. ${workshop.whatsapp} &nbsp;&nbsp;&nbsp; E-Mail : ${workshop.email}</i></p>
      </div>
      <div class="pdf-header-logo">
        <img src="${workshop.logo}" alt="Logo ${workshop.name}" class="pdf-logo" crossorigin="anonymous">
      </div>
    </div>
    <div class="pdf-title-bar">
      <h2>LAPORAN INSPEKSI KENDARAAN</h2>
    </div>
  `;
}

// ─── PDF Customer Info ───────────────────────────────────────────────

function buildPDFCustomerInfo(report) {
  const c = report.customer || {};
  const fields = [
    ['Nama Customer', c.customerName],
    ['No. Telepon', c.customerPhone],
    ['Merek & Model', c.vehicleBrand],
    ['Tahun', c.vehicleYear],
    ['Nomor Polisi', c.vehiclePlate],
    ['Odometer', c.vehicleOdometer ? `${Number(c.vehicleOdometer).toLocaleString('id-ID')} KM` : ''],
    ['Tanggal Inspeksi', c.inspectionDate ? formatDate(c.inspectionDate) : ''],
    ['Mekanik', c.mechanicName]
  ];

  return `
    <div class="pdf-section">
      <h3 class="pdf-section-title">Data Customer & Kendaraan</h3>
      <table class="pdf-table pdf-customer-table">
        <tbody>
          ${fields.map(([label, val]) => `
            <tr>
              <td class="pdf-td-label">${label}</td>
              <td class="pdf-td-value">${val || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ─── PDF Inspections ─────────────────────────────────────────────────

function buildPDFInspections(report) {
  return INSPECTION_CATEGORIES.map(cat => {
    const items = cat.items.map(item => {
      const data = report.inspections?.[cat.id]?.[item.id] || {};
      const status = data.status || 'unchecked';
      const statusInfo = STATUS_OPTIONS.find(s => s.value === status);
      const photos = (data.photos || []).filter(Boolean);

      return `
        <tr class="pdf-item-row pdf-status-${status}">
          <td class="pdf-td-code">${item.id}</td>
          <td class="pdf-td-item">${item.label}</td>
          <td class="pdf-td-status">
            <span class="pdf-status-badge pdf-badge-${status}">
              ${statusInfo ? statusInfo.label : 'N/A'}
            </span>
          </td>
          <td class="pdf-td-note">${data.note || '-'}</td>
        </tr>
        ${photos.length > 0 ? `
          <tr class="pdf-photo-row">
            <td colspan="4">
              <div class="pdf-photos">
                ${photos.map((p, i) => `
                  <img src="${p}" alt="Foto ${item.id}-${i + 1}" class="pdf-photo">
                `).join('')}
              </div>
            </td>
          </tr>
        ` : ''}
      `;
    }).join('');

    return `
      <div class="pdf-section pdf-category-section" style="page-break-inside: avoid;">
        <h3 class="pdf-section-title">${cat.id}. ${cat.name}</h3>
        <table class="pdf-table pdf-inspection-table">
          <thead>
            <tr>
              <th class="pdf-th-code">#</th>
              <th class="pdf-th-item">Item Pengecekan</th>
              <th class="pdf-th-status">Status</th>
              <th class="pdf-th-note">Catatan</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
        </table>
      </div>
    `;
  }).join('');
}

// ─── PDF Summary ─────────────────────────────────────────────────────

function buildPDFSummary(report) {
  const s = report.summary || {};
  const stats = getInspectionStats();

  return `
    <div class="pdf-section" style="page-break-inside: avoid;">
      <h3 class="pdf-section-title">Ringkasan Inspeksi</h3>
      
      <div class="pdf-stats-bar">
        <span class="pdf-stat pdf-stat-good">Baik: ${stats.good}</span>
        <span class="pdf-stat pdf-stat-warning">Perlu Perhatian: ${stats.warning}</span>
        <span class="pdf-stat pdf-stat-danger">Rusak: ${stats.danger}</span>
        <span class="pdf-stat pdf-stat-unchecked">Tidak Diperiksa: ${stats.unchecked}</span>
      </div>

      ${s.summaryCondition ? `
        <div class="pdf-summary-block">
          <strong>Kondisi Umum Kendaraan:</strong>
          <p>${s.summaryCondition}</p>
        </div>
      ` : ''}
      
      ${s.summaryRecommend ? `
        <div class="pdf-summary-block">
          <strong>Rekomendasi Perbaikan:</strong>
          <p>${s.summaryRecommend}</p>
        </div>
      ` : ''}
      
      ${s.summaryNotes ? `
        <div class="pdf-summary-block">
          <strong>Catatan Tambahan:</strong>
          <p>${s.summaryNotes}</p>
        </div>
      ` : ''}
    </div>
  `;
}

// ─── PDF Footer ──────────────────────────────────────────────────────

function buildPDFFooter(report, workshop) {
  const date = report.customer?.inspectionDate 
    ? formatDate(report.customer.inspectionDate) 
    : formatDate(new Date().toISOString().split('T')[0]);
  const mechanic = report.customer?.mechanicName || '_______________';

  return `
    <div class="pdf-footer" style="page-break-inside: avoid;">
      <div class="pdf-signature-area">
        <div class="pdf-signature-block">
          <p>Mengetahui,</p>
          <div class="pdf-signature-line"></div>
          <p class="pdf-signature-name">Customer</p>
        </div>
        <div class="pdf-signature-block">
          <p>Diperiksa oleh,</p>
          <div class="pdf-signature-line"></div>
          <p class="pdf-signature-name">${mechanic}</p>
          <p class="pdf-signature-role">Mekanik</p>
        </div>
      </div>
      <div class="pdf-footer-info">
        <p>${workshop.name} — ${date}</p>
        <p class="pdf-disclaimer">Dokumen ini digenerate secara digital dan berlaku tanpa tanda tangan basah.</p>
      </div>
    </div>
  `;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function generateFilename(report) {
  const customer = report.customer?.customerName || 'Customer';
  const plate = report.customer?.vehiclePlate || 'NoPol';
  const date = report.customer?.inspectionDate || new Date().toISOString().split('T')[0];

  const clean = (str) => str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
  return `Inspeksi_${clean(customer)}_${clean(plate)}_${date}.pdf`;
}

function formatDate(dateStr) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

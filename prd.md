# 📋 Product Requirements Document (PRD)
# Web Car Inspection Report — Sistem Laporan Pengecekan Mobil

---

## 1. Ringkasan Produk

**Nama Produk:** Web Car Inspection Report  
**Tipe:** Single-Page Application (SPA) — Web Browser Based  
**Tech Stack:** HTML, CSS (Vanilla), JavaScript (Vanilla)  
**Target User:** Mekanik / Admin Bengkel  
**Tujuan:** Mempermudah pembuatan laporan pengecekan kondisi mobil secara digital, lengkap dengan form isian, checklist kondisi, upload foto di setiap titik inspeksi, dan ekspor ke PDF.

---

## 2. Latar Belakang & Masalah

Bengkel melakukan pengecekan menyeluruh pada setiap mobil customer yang masuk — mulai dari **mesin, kelistrikan, hingga kaki-kaki**. Saat ini, proses dokumentasi masih manual dan tidak terstruktur, sehingga:

- Laporan tidak konsisten antar mekanik
- Sulit menyertakan bukti foto secara rapi
- Tidak ada format baku yang bisa langsung diberikan ke customer
- Proses pembuatan laporan memakan waktu

**Solusi:** Aplikasi web dengan form inspeksi terstruktur yang bisa langsung diisi, dilengkapi foto bukti, dan di-download sebagai PDF profesional.

---

## 3. Fitur Utama

### 3.1 🏢 Header — Informasi Bengkel
| Field | Tipe | Keterangan |
|-------|------|------------|
| Logo Bengkel | Upload Gambar | Opsional, ditampilkan di header report |
| Nama Bengkel | Text Input | Nama resmi bengkel |
| Alamat Bengkel | Textarea | Alamat lengkap |
| No. Telepon | Text Input | Nomor kontak bengkel |
| Email | Text Input | Email bengkel (opsional) |

> [!NOTE]
> Data header bengkel akan disimpan di **localStorage** agar tidak perlu diisi ulang setiap kali membuat report baru.

---

### 3.2 👤 Data Customer & Kendaraan
| Field | Tipe | Keterangan |
|-------|------|------------|
| Nama Customer | Text Input | Nama pemilik kendaraan |
| No. Telepon Customer | Text Input | Kontak customer |
| Merek & Model Mobil | Text Input | Contoh: Toyota Avanza 1.3 G |
| Tahun Kendaraan | Number Input | Tahun pembuatan |
| Nomor Polisi | Text Input | Plat nomor kendaraan 
| Odometer (KM) | Number Input | Kilometer saat pengecekan |
| Tanggal Inspeksi | Date Input | Auto-fill hari ini, bisa diubah |
| Nama Mekanik | Text Input | Siapa yang melakukan pengecekan |

---

### 3.3 🔧 Form Inspeksi — Kategori Pengecekan

Setiap kategori inspeksi memiliki **checklist item** dengan status kondisi dan **slot upload foto** untuk dokumentasi bukti visual.

#### Status Kondisi (berlaku untuk semua item):
| Status | Warna | Keterangan |
|--------|-------|------------|
| ✅ Baik | Hijau | Kondisi normal, tidak ada masalah |
| ⚠️ Perlu Perhatian | Kuning | Masih bisa digunakan tapi perlu perawatan segera |
| ❌ Rusak / Harus Diganti | Merah | Perlu penggantian / perbaikan segera |
| ⬜ Tidak Diperiksa | Abu-abu | Item tidak relevan atau tidak diperiksa |

#### Setiap Item Inspeksi Memiliki:
- **Checkbox status** (pilihan 4 status di atas)
- **Kolom catatan/keterangan** (text input, opsional)
- **Slot upload foto** (1-3 foto per item, opsional)

---

#### 📦 Kategori A: Mesin (Engine)
| # | Item Pengecekan |
|---|----------------|
| A1 | Kondisi Oli Mesin (warna, level, kekentalan) |
| A2 | Kondisi Filter Udara |
| A3 | Kondisi Radiator & Coolant |
| A4 | Kondisi Fan Belt / V-Belt |
| A5 | Mounting Mesin |
| A6 | Kebocoran Oli / Cairan |
| A7 | Suara Mesin Abnormal |
| A8| Idle RPM / Stabilitas Mesin |
| A9| Cek Kondisi Filter AC |
| A10 | Oli Transmisi (matic/manual) — level & kondisi |

---

#### ⚡ Kategori B: Kelistrikan (Electrical)
| # | Item Pengecekan |
|---|----------------|
| B1 | Kondisi Aki / Baterai (voltase, terminal) |
| B2 | Alternator / Pengisian |
| B4 | Lampu Utama (dekat & jauh) |
| B5 | Lampu Sein / Hazard |
| B6 | Lampu Rem |
| B7 | Lampu Mundur |
| B8 | Lampu Dashboard / Indikator |
| B9 | Wiper & Washer |

---

#### 🦿 Kategori C: Kaki-Kaki (Suspension & Steering)
| # | Item Pengecekan |
|---|----------------|
| C1 | Shock Absorber Depan |
| C2 | Shock Absorber Belakang |
| C3 | Ball Joint |
| C4 | Tie Rod & Tie Rod End |
| C5 | Rack Steer / Steering Rack |
| C6 | Long Tie Rod / Drag Link |
| C7 | Bushing-bushing Arm |
| C8 | Stabilizer Link & Bushing |
| C9 | CV Joint / Boot Karet |
| C10 | Bearing Roda |
| C11 | Per / Spring (depan & belakang) |

---

#### 🛞 Kategori D: Rem (Brake System)
| # | Item Pengecekan |
|---|----------------|
| D1 | Kampas Rem Depan |
| D2 | Kampas Rem Belakang |
| D3 | Disc / Piringan Rem Depan |
| D4 | Disc / Drum Rem Belakang |
| D5 | Selang Rem |
| D6 | Master Rem |
| D7 | Minyak Rem (level & kondisi) |

---

#### 🛞 Kategori E: Ban & Velg (Tires & Wheels)
| # | Item Pengecekan |
|---|----------------|
| E1 | Ban Depan Kiri (Tahun Produksi, Kondisi,) |
| E2 | Ban Depan Kanan |
| E3 | Ban Belakang Kiri |
| E4 | Ban Belakang Kanan |
| E5 | Kondisi Velg (retak, peyang, aus) |
| E6 | Tekanan Angin Ban |


### 3.4 📝 Ringkasan & Rekomendasi
| Field | Tipe | Keterangan |
|-------|------|------------|
| Ringkasan Kondisi Umum | Textarea | Ringkasan keseluruhan kondisi mobil |
| Rekomendasi Perbaikan | Textarea | List perbaikan yang disarankan |
| Estimasi Biaya (opsional) | Number Input | Perkiraan biaya perbaikan total |
| Catatan Tambahan | Textarea | Catatan apapun dari mekanik |

---


### 3.6 📥 Ekspor PDF
- Tombol **"Download PDF"** yang menghasilkan file PDF berisi seluruh report
- Layout PDF profesional dengan:
  - Header bengkel (logo + info) di atas
  - Data customer & kendaraan
  - Semua hasil inspeksi dengan status warna
  - Foto-foto yang di-embed langsung di PDF
  - Ringkasan & rekomendasi
  - Footer dengan tanggal dan tanda tangan digital (slot kosong)
- Menggunakan library **html2pdf.js** atau **jsPDF** untuk generate PDF di sisi client (tanpa backend)

---

## 4. User Flow

```
┌─────────────────────────────────────────────────┐
│              BUKA WEB APPLICATION                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│     ISI / EDIT HEADER INFO BENGKEL               │
│     (auto-load dari localStorage jika ada)       │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│     ISI DATA CUSTOMER & KENDARAAN                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│     UPLOAD FOTO OVERVIEW KENDARAAN               │
│     (tampak depan, belakang, samping, dll)        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│     ISI FORM INSPEKSI PER KATEGORI               │
│     ┌─ A: Mesin                                  │
│     ├─ B: Kelistrikan                            │
│     ├─ C: Kaki-Kaki                              │
│     ├─ D: Rem                                    │
│     ├─ E: Ban & Velg                             │
│     ├─ F: Transmisi                              │
│     ├─ G: Body & Interior                        │
│     └─ H: Dokumen & Kelengkapan                  │
│                                                   │
│     Setiap item: pilih status → isi catatan →     │
│                  upload foto (opsional)            │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│     ISI RINGKASAN & REKOMENDASI                  │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│     PREVIEW REPORT                               │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│     DOWNLOAD PDF                                 │
└─────────────────────────────────────────────────┘
```

---

## 5. Desain & UX Guidelines

### 5.1 Layout
- **Single-page scroll** dengan navigasi tab/accordion per kategori inspeksi
- **Sticky header** menampilkan nama bengkel
- **Progress bar** di atas menunjukkan berapa persen form yang sudah terisi
- **Sidebar navigation** (desktop) / **bottom tab** (mobile) untuk jump ke kategori
- **Responsive design** — optimal di tablet & desktop, usable di mobile

### 5.2 Tema Visual
- **Dark mode** sebagai default (cocok untuk lingkungan bengkel)
- Warna utama: **Biru tua / Navy** dengan aksen **Orange** (industrial automotive feel)
- Status warna: Hijau (baik), Kuning (perhatian), Merah (rusak), Abu-abu (tidak diperiksa)
- Font: **Inter** atau **Outfit** dari Google Fonts
- Glassmorphism pada card section

### 5.3 Interaksi
- **Auto-save** ke localStorage setiap perubahan (jaga data tidak hilang)
- **Tombol Reset** untuk memulai report baru (dengan konfirmasi)
- **Animasi smooth** saat expand/collapse kategori
- **Drag & drop** foto atau klik untuk upload
- **Preview foto** dengan lightbox setelah upload
- **Toast notification** saat auto-save berhasil

---

## 6. Arsitektur Teknis

### 6.1 Tech Stack
| Layer | Teknologi |
|-------|-----------|
| Structure | HTML5 Semantic |
| Styling | Vanilla CSS (Custom Properties, Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES6+ Modules) |
| PDF Export | html2pdf.js (CDN) atau jsPDF + html2canvas |
| Storage | localStorage (browser) |
| Font | Google Fonts (Inter / Outfit) |
| Icons | Lucide Icons (CDN) atau inline SVG |

### 6.2 Struktur File
```
web-car-inspection-report/
├── index.html              # Halaman utama SPA
├── css/
│   ├── style.css           # Styling utama + design system
│   ├── form.css            # Styling khusus form inspeksi
│   └── pdf.css             # Styling khusus untuk output PDF
├── js/
│   ├── app.js              # Entry point & orchestrator
│   ├── form-data.js        # Data struktur form (kategori & item)
│   ├── form-renderer.js    # Render form inspeksi dari data
│   ├── photo-handler.js    # Logic upload & preview foto
│   ├── storage.js          # localStorage CRUD operations
│   ├── pdf-export.js       # Generate & download PDF
│   └── ui.js               # UI interactions (tabs, accordion, toast)
├── assets/
│   └── icons/              # Icon SVG jika tidak pakai CDN
└── prd.md                  # Dokumen ini
```

### 6.3 Data Storage (localStorage)
```json
{
  "workshopInfo": {
    "logo": "./assets/logo.png",
    "name": "Super Shop&Drive Ampera",
    "address": "Jl. Ampera Raya No. 138 Ragunan, Pasar Minggu",
    "phone": "(021)-7823844",
    "whatsapp": "+62217823844",
    "email": "[jkt.ssdampera@shopanddrive.com]"
  },
  "currentReport": {
    "customer": { ... },
    "vehicle": { ... },
    "overviewPhotos": { ... },
    "inspections": {
      "A": { "A1": { "status": "good", "note": "...", "photos": ["base64..."] }, ... },
      "B": { ... },
      ...
    },
    "summary": { ... },
    "createdAt": "2026-07-31T14:00:00",
    "updatedAt": "2026-07-31T14:30:00"
  }
}
```

---

## 7. Prioritas Pengembangan

### Phase 1 — MVP Core ✅
1. Header info bengkel (dengan localStorage save)
2. Form data customer & kendaraan
3. Form inspeksi semua kategori (A-H) dengan status + catatan
4. Upload foto per item inspeksi
5. Foto overview kendaraan
6. Ringkasan & rekomendasi
7. Ekspor PDF

### Phase 2 — Enhancement 🔜
1. Auto-save ke localStorage
2. Dark mode toggle
3. Progress bar
4. Preview report sebelum download
5. Tombol reset report
6. Print-friendly layout

### Phase 3 — Future (Opsional) 🔮
1. Riwayat report (list report tersimpan)
2. Template inspeksi yang bisa dikustomisasi
3. Export ke format lain (Excel, gambar)
4. QR Code pada report untuk verifikasi
5. Backend + database untuk multi-user

---

## 8. Batasan & Asumsi

| Item | Detail |
|------|--------|
| **No Backend** | Semua berjalan di client-side, data di localStorage |
| **Ukuran Foto** | Foto akan di-compress sebelum disimpan (max ~500KB per foto) untuk menjaga performa localStorage |
| **Browser Support** | Chrome, Edge, Firefox (modern browsers) |
| **Offline Capable** | Ya, setelah halaman pertama kali di-load |
| **Multi-user** | Tidak — ini single-user tool per browser |
| **Bahasa** | UI dalam Bahasa Indonesia |

---

## 9. Kriteria Sukses

- ✅ Mekanik bisa mengisi report lengkap dalam **< 15 menit**
- ✅ PDF yang dihasilkan terlihat **profesional dan rapi**
- ✅ Foto ter-embed dengan baik di PDF
- ✅ Data tidak hilang saat browser tidak sengaja tertutup (auto-save)
- ✅ Bisa diakses dari **tablet di bengkel** (responsive)

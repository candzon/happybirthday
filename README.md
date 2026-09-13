# Lorem Kado

Website kejutan ulang tahun. Satu halaman, tanpa backend, tanpa database,
paling nyaman dibuka di HP. Penerima mengisi namanya, menekan kado, lalu
semua isi halaman terbuka: surat, galeri foto, balon harapan, dan kue
virtual yang bisa "ditiup".

Kalau tanggal kejutan belum lewat, halaman otomatis menampilkan hitung
mundur sampai jam yang ditentukan — cocok dikirim sebelum jam 12 malam.

## Fitur

| # | Fitur | Detail |
|---|-------|--------|
| 1 | Hitung mundur | Aktif selama tanggal target belum lewat (`src/app/page.tsx`) |
| 2 | Layar pembuka | Input nama + kartu kado animasi |
| 3 | Tab Surat | Pesan panjang + tombol "hujan konfeti" |
| 4 | Tab Memori | Galeri polaroid geser kiri/kanan, mendukung foto & video |
| 5 | Tab Harapan | 5 balon, di-pop satu-satu untuk membuka doa |
| 6 | Tab Lilin | Kue virtual: klik apinya → suara tiup + konfeti + kartu permohonan |
| 7 | Musik | Melodi "ulang tahun" disintesis via Web Audio API, lirik mengikuti not |

Tangkapan layar semua halaman ada di `docs/01-welcome.png` s.d. `05-kue.png`.

## Tech Stack

| Layer      | Teknologi       | Versi (dari lockfile) |
| ---------- | --------------- | --------------------- |
| Framework  | Next.js         | 16.3.5                |
| UI         | React           | 19.2.8                |
| Styling    | Tailwind CSS    | 4.x (`@tailwindcss/postcss`) |
| Bahasa     | TypeScript      | 5.9.3                 |
| Efek visual| canvas-confetti | 1.9.4                 |

## Prasyarat

- Node.js 20+ dan npm
- Browser modern (Chrome/Firefox/Safari) — Web Audio & Web Speech tidak wajib

## Menjalankan

```bash
git clone https://github.com/candzon/happybirthday.git
cd happybirthday
npm install
npm run dev      # buka http://localhost:3000
```

Perintah lain yang tersedia di `package.json`:

| Perintah        | Fungsi                         |
| --------------- | ------------------------------ |
| `npm run dev`   | Server development (hot reload)|
| `npm run build` | Build produksi                 |
| `npm run start` | Jalankan hasil build produksi  |
| `npm run lint`  | ESLint                         |

## Environment

Tidak ada environment variable yang dibutuhkan. Tidak ada file `.env`,
tidak ada API key — seluruh logika berjalan di sisi browser.

## Struktur Proyek

```
├── src/
│   ├── app/
│   │   ├── page.tsx            # Halaman utama: countdown, layar pembuka, 4 tab
│   │   ├── layout.tsx          # Font (Plus Jakarta Sans, Great Vibes) + metadata
│   │   └── globals.css         # Tema warna & animasi kustom Tailwind
│   └── components/
│       ├── AudioSynth.ts       # Pemain melodi Web Audio + suara tiup lilin
│       ├── Confetti.ts         # 3 preset konfeti (buka kado, hujan cinta, pop balon)
│       ├── PolaroidGallery.tsx # Galeri slide kartu polaroid
│       ├── WishBalloons.tsx    # Balon harapan (pop → doa muncul)
│       └── VirtualCake.tsx     # Kue dengan api yang bisa diklik/ditiup
├── public/assets/              # Foto & video pribadi (sengaja di-gitignore)
├── docs/                       # Screenshot tiap halaman + panduan personalisasi
└── package.json
```

## Bagaimana Aplikasi Bekerja

```
Pengguna membuka laman
        ↓
   tanggal target sudah lewat?  ──tidak──> Kartu hitung mundur (interval 1 detik)
        ↓ ya
Layar pembuka: isi nama → klik kado
        ↓
React memunculkan 4 tab (state `activeTab`)
        ↓
Tab aktif merender komponen terkait, semuanya client-side
```

Poin-poin implementasi penting:

- **Satu state aplikasi berada di `page.tsx`**: `isOpen` (kado dibuka/di-tutup),
  `activeTab`, `name`, `timeLeft`, `isPlaying`. Komponen tab menerima data lewat props.
- **Countdown** memakai `setInterval` 1 detik menghitung selisih
  `now - target`. Target ditulis langsung di `page.tsx`
  (`new Date("2026-08-26T00:00:00+07:00")`) — ubah di situ.
- **Musik** (`AudioSynth.ts`) menjadwalkan oscillator Web Audio per not
  (`birthdaySong`), lalu memicu callback untuk mengganti lirik di layar.
  Bukan file audio, jadi tidak ada aset lagu di repo.
- **Susunan dekorasi melayang** (sparkle/balon) dihasilkan `Math.random()`
  di sisi klien; atributnya diberi `suppressHydrationWarning` agar React
  tidak protes beda nilai server/klien.
- **Tidak ada fetch, tidak ada API route** — keamanan berpikir simpel:
  semua state hidup selama tab terbuka.

## Personalisasi (untuk pemakai non-programmer)

Seluruh teks website memakai placeholder **lorem ipsum**. Panduan lengkap
(ganti teks, ganti foto, atur lagu, atur tanggal, deploy) ada di
[docs/personalisasi.md](docs/personalisasi.md).

Ringkasannya: buka file yang ditunjuk, cari kata `Lorem`, ketik penggantinya,
simpan — halaman otomatis ter-refresh saat `npm run dev` berjalan.

## Deployment

Belum ada konfigurasi deployment dalam repo (tanpa Dockerfile/vercel.json).
Cara paling langsung untuk situs Next.js seperti ini:

```bash
npx vercel
```

Atau Vercel/Netlify: hubungkan repo GitHub, build command `npm run build`,
start command `npm run start`. Variabel environment tidak diperlukan.

**Catatan privasi:** karena `public/assets/` tidak ikut ter-commit, aset
pribadi harus diunggah secara terpisah (atau commit sementara secara lokal)
sebelum deploy — foto tidak akan muncul di situs publik kalau folder itu
kosong di mesin deploy.

## Testing

Tidak ada test otomatis dalam proyek ini. Yang bisa dipakai:

```bash
npm run lint        # ESLint
npx tsc --noEmit    # type-check TypeScript
```

## Troubleshooting

**Foto galeri tidak muncul / 404**
Berkas di `public/assets/` memang tidak ter-commit (proteksi privasi).
Salin folder aset ke mesin yang menjalankan/deploy aplikasi.

**Halaman menampilkan hitung mundur padahal ingin kado**
Ubah tanggal target di `src/app/page.tsx` menjadi tanggal yang sudah lewat
atau tanggal kejutan Anda.

**Tidak ada suara**
Browser menuntut interaksi pengguna sebelum audio boleh diputar —
pastikan musik dimulai lewat klik (tombol kado), lalu cek tombol 🔇.

**Badge "1 Issue" merah pojok bawah (mode dev)**
Hanya muncul saat `npm run dev`, tidak ada di produksi. Kalau mengganggu
screen recording, jalankan `npm run build && npm run start`.

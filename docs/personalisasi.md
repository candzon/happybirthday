# Panduan Personalisasi

Semua teks di situs ini pakai placeholder **lorem ipsum** supaya template
aman dipakai siapa pun. Panduan ini menjelaskan file mana yang diganti,
apa yang diganti, dan contohnya tanpa perlu paham kode.

## Daftar Penggantian

| Yang diganti | File | Cara |
|---|---|---|
| Judul tab browser & deskripsi | `src/app/layout.tsx` | Cari `metadata`, ganti `title` & `description` |
| Judul pembuka, label input, tombol, tab | `src/app/page.tsx` | Cari semua `Lorem` |
| Teks surat (4 paragraf) | `src/app/page.tsx` | Blok paragraf di bawah `Untuk …` |
| Tanggal/jam kado terbuka otomatis | `src/app/page.tsx` | Baris `new Date("2026-08-26T00:00:00+07:00")` |
| Lirik lagu | `src/components/AudioSynth.ts` | Array `birthdaySong`, kolom `lyric` |
| Judul & caption 4 memori | `src/components/PolaroidGallery.tsx` | Array `memories` |
| 5 doa & label balon | `src/components/WishBalloons.tsx` | Array `initialBalloons` |
| Teks kue & permohonan | `src/components/VirtualCake.tsx` | Cari `Lorem` |

Trik umum: jalankan `npm run dev`, tekan `Ctrl+Shift+F` (Search di VS Code),
ketik "Lorem" — semua titik yang harus diganti akan muncul.

## Ganti Nama Utama

Ada dua tempat tulisan nama yang mengikuti nama yang diisi pengguna di
layar pembuka (fidusia: `name.toLowerCase()` otomatis mengikuti input).
If Anda ingin nama tampil default tanpa input, edit `${name || "Lorem"}`.

## Ganti Foto & Video

1. Letakkan berkas ke folder `public/assets/`.
2. Edit array `memories` di `src/components/PolaroidGallery.tsx`:
   `type` ganti `"image"` atau `"video"`, `src` sesuaikan seperti `/assets/nama-file.jpg`.
3. Judul & caption di properti `title` & `description` diobjek yang sama.

Folder `public/assets/` **tidak ikut** ter-commit ke git (proteksi privasi):
commit berkas lokal tetap jalan, tapi saat push/clone aset itu tidak akan
berpindah mesin. Deploy harus mengunggah aset secara terpisah.

## Ubah Tanggal Kejutan

Kalau ingin kado "wajib" dibuka lewat hitung mundur, isi tanggal masa depan.
Kalau ingin langsung tampil tanpa hitung mundur, isikan tanggal lampau:

```ts
const target = new Date("2026-08-26T00:00:00+07:00").getTime();
```

Format `+07:00` = zona WIB. Ubah sesuai zona target.

## Lanjutan (opsional)

Hanya kalau memang mau, tidak wajib:

- Menambah tab: selipkan tombol ke-kelima ikuti pola `activeTab` di `page.tsx`.
- Menambah memori: cukup tambah objek baru di array `memories`.
- Skema warna: variabel warna rose-gold `#b76e79` di-tailwind class di semua komponen.

## Deploy (Vercel)

```bash
npx vercel
```

Vercel normalnya mendeteksi Next.js otomatis. Pastikan aset foto sudah
ada di mesin deploy, karena `public/assets/` tidak ikut dari git.

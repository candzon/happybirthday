# Lorem Kado — Template Web Kejutan Ulang Tahun

Template website kejutan ulang tahun (Next.js + Tailwind). Seluruh teks memakai
placeholder **lorem ipsum** — tinggal diganti dengan isi pribadi.

## Tampilan

| Halaman                          | Screenshot                          |
| -------------------------------- | ----------------------------------- |
| Layar pembuka (kado tertutup)    | `docs/01-welcome.png`               |
| Tab Surat (pesan)                | `docs/02-surat.png`                 |
| Tab Memori (galeri polaroid)     | `docs/03-galeri.png` (foto disensor)| 
| Tab Harapan (pop balon)          | `docs/04-balon.png`                 |
| Tab Lilin (kue virtual)          | `docs/05-kue.png`                   |

## Menjalankan

```bash
npm install
npm run dev     # buka http://localhost:3000
```

## Panduan Personalisasi (untuk pengguna)

Ganti teks placeholder di file-file berikut menggunakan editor biasa
(VS Code / Notepad). Cari kata `Lorem` lalu ketik penggantinya.

| Yang mau diganti                          | File                            | Baris kira-kira |
| ----------------------------------------- | ------------------------------- | --------------- |
| Judul tab browser & deskripsi (SEO)       | `src/app/layout.tsx`            | `metadata`      |
| Teks layar pembuka, tombol, kado          | `src/app/page.tsx`              | cari "Lorem"    |
| Waktu kado dibuka otomatis (countdown)    | `src/app/page.tsx`              | `new Date("...")` |
| Kapten/judul lagu (lirik)                 | `src/components/AudioSynth.ts`  | `birthdaySong`  |
| Judul & deskripsi galeri + daftar foto    | `src/components/PolaroidGallery.tsx` | `memories` |
| Doa di balon harapan                      | `src/components/WishBalloons.tsx`    | `initialBalloons` |
| Teks kue & permohonan                     | `src/components/VirtualCake.tsx`     | cari "Lorem" |

### Mengganti foto/video

Simpan file ke `public/assets/` lalu samakan nama di
`PolaroidGallery.tsx`. Folder `public/assets/` **tidak ikut** ter-commit ke
git (proteksi privasi) — deploy dengan repositori publik akan memakai aset
yang diunggah secara terpisah.

## Struktur

```
src/app/            halaman & layout
src/components/     kado, galeri, balon, kue, audio, confetti
public/assets/      foto/video pribadi (ignored)
docs/               screenshot tiap halaman
```

## Deploy

Deploy seperti Next.js biasa (mis. `npx vercel`). Pastikan aset pribadi
diunggah/di-setel sebelum deploy publik.

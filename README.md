# Website Desa Sepadu – Pink Pastel

Website statis Desa Sepadu dengan halaman Beranda, Profil, Berita, Galeri, Kontak & Aduan, serta Admin.

## Fitur Aduan
- Formulir aduan tersimpan ke Google Sheets.
- Setiap aduan mendapatkan token `SPD-YYYYMMDD-XXXXXX`.
- Masyarakat dapat mengecek status menggunakan token.
- Admin dapat login dan melihat semua aduan dari Google Sheets.
- Admin dapat mengubah status menjadi Menunggu / Diproses / Selesai / Ditolak.
- Admin dapat menulis tanggapan yang langsung disimpan ke Google Sheets.

## Upload ke GitHub Pages
1. Ekstrak ZIP.
2. Upload semua file di folder `desa` ke repository GitHub Pages.
3. Pastikan `index.html`, `style.css`, `script.js`, `config.js`, `favicon.svg`, dan semua foto berada pada folder yang sama.
4. Jika GitHub masih menampilkan desain lama, lakukan hard refresh: `Ctrl + F5`.

## Koneksi Google Sheets
Spreadsheet yang digunakan:
`1p2vKGIh6yXu_UC7jzpCz5IV_Sd9HR101b8A3n6gmcll`

Tab:
`aduan`

Kode Apps Script lengkap ada di `Code.gs`.
Ikuti langkah di `GOOGLE-SHEET.md` untuk memasang/deploy Web App.

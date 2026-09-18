# Website Desa Sepadu - Pink Pastel

Website statis Desa Sepadu dengan halaman Beranda, Profil Desa, Berita, Galeri, Kontak & Aduan, serta Admin Aduan.

## Foto
Foto baru sudah diberi nama sederhana agar mudah dipanggil dari HTML:
- `balai-desa-baru.jpg`
- `lingkungan-desa.jpg`
- `gerbang-desa-sepadu.jpg`
- `sawah-baru.jpg`
- `gotong-royong-sungai.jpg`
- `masjid-al-falah.jpg`

Foto lama juga tetap disertakan dan di-HD-kan.

## Aduan + Google Sheet
Form aduan memakai field: Nama, No. WhatsApp/Telepon, Email, Kategori, Lokasi, Isi Aduan. Sistem menghasilkan token untuk pelacakan. Struktur kolom Google Sheet tersedia di `GOOGLE-SHEET.md`. Backend Apps Script tersedia di `Code.gs`.

## Cara mengaktifkan database
1. Buat Google Sheet.
2. Buka Extensions > Apps Script.
3. Salin `Code.gs`.
4. Ubah `ADMIN_KEY`.
5. Deploy sebagai Web app.
6. Tempel URL `/exec` ke `config.js` pada `APPS_SCRIPT_URL`.
7. Upload semua file ke GitHub Pages.

Jika `APPS_SCRIPT_URL` masih kosong, website otomatis menggunakan mode demo/localStorage.

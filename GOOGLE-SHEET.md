# Koneksi Google Sheets + Apps Script Desa Sepadu

## Google Spreadsheet
ID spreadsheet:

`1p2vKGIh6yXu_UC7jzpCz5IV_Sd9HR101b8A3n6gmcll`

Nama tab yang digunakan:

`aduan`

Header baris pertama:

`Token | Timestamp | Nama | Kontak | Email | Kategori | Lokasi | Isi Aduan | Status | Tanggapan | Waktu Tanggapan`

## Apps Script
File `Code.gs` pada paket ini berisi kode Apps Script lengkap.

1. Buka Google Sheet **Database Desa Sepadu**.
2. Klik **Ekstensi → Apps Script**.
3. Hapus kode lama di editor Apps Script.
4. Salin seluruh isi `Code.gs` dari paket ini ke Apps Script.
5. Klik **Simpan**.
6. Klik **Deploy → New deployment**.
7. Pilih **Web app**.
8. **Execute as:** Me.
9. **Who has access:** Anyone.
10. Klik **Deploy**.
11. Gunakan URL yang berakhiran `/exec` di `config.js`.

URL Web App yang sudah dipasang di website:

`https://script.google.com/macros/s/AKfycbx0xx_Iwm7CY58NNZnU0whcOzjzFUV9cq3iUpmPK1LZjnPEmtl08m8iE-rPYHE8dM6djw/exec`

Jika kamu mengubah kode Apps Script setelah deployment, lakukan **Deploy → Manage deployments → Edit → New version → Deploy** agar versi Web App ikut diperbarui.

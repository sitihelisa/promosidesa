# Struktur Google Sheet Aduan Desa Sepadu

Buat satu sheet bernama **Aduan**. Jika memakai `Code.gs` yang disertakan, header akan dibuat otomatis.

## Kolom yang dipakai

| Kolom | Isi |
|---|---|
| Token | ID unik aduan, contoh `SPD-20260918-ABC123` |
| Timestamp | Waktu aduan masuk |
| Nama | Nama pelapor |
| Kontak | Nomor WhatsApp/telepon |
| Email | Email pelapor (opsional) |
| Kategori | Jenis aduan |
| Lokasi | Lokasi masalah |
| Isi Aduan | Uraian masalah |
| Status | Menunggu / Diproses / Selesai / Ditolak |
| Tanggapan | Jawaban admin |
| Waktu Tanggapan | Waktu admin memberi jawaban |

## Contoh isi aduan

- **Infrastruktur:** Jalan berlubang di sekitar jalan dusun dan mengganggu kendaraan.
- **Kebersihan:** Sampah menumpuk di sekitar sungai dan perlu dibersihkan.
- **Pelayanan:** Meminta informasi mengenai persyaratan surat pengantar.
- **Pendidikan:** Melaporkan kondisi fasilitas sekolah yang perlu diperhatikan.
- **Kesehatan:** Meminta informasi atau tindak lanjut kegiatan pelayanan kesehatan desa.
- **Keamanan:** Melaporkan lampu jalan atau kondisi lingkungan yang membutuhkan perhatian.

## Alur

1. Warga mengisi formulir.
2. Sistem membuat token.
3. Data masuk ke Google Sheet.
4. Warga menyimpan token.
5. Warga memasukkan token pada menu **Cek Status Aduan**.
6. Admin mengubah status dan mengisi tanggapan.
7. Warga dapat melihat status dan tanggapan menggunakan token.

Google Apps Script dapat dipublikasikan sebagai web app melalui menu **Deploy > New deployment > Web app** dan dapat menangani request `doGet`/`doPost`. Lihat dokumentasi resmi Google Apps Script.

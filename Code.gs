// =====================================================
// BACKEND ADUAN DESA SEPADU - GOOGLE APPS SCRIPT
// =====================================================
// 1. Buat Google Sheet baru.
// 2. Extensions > Apps Script.
// 3. Tempel kode ini ke Code.gs.
// 4. Ubah ADMIN_KEY.
// 5. Deploy > New deployment > Web app.
//    Execute as: Me
//    Who has access: Anyone (atau sesuai kebutuhan).
// 6. Salin URL /exec ke config.js -> APPS_SCRIPT_URL.
//
// Kolom sheet otomatis dibuat:
// Token | Timestamp | Nama | Kontak | Email | Kategori | Lokasi | Isi Aduan | Status | Tanggapan | Waktu Tanggapan

const SHEET_NAME = 'Aduan';
const ADMIN_KEY = 'GANTI_DENGAN_KUNCI_ADMIN_YANG_KAMU_MAU';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Token','Timestamp','Nama','Kontak','Email','Kategori','Lokasi','Isi Aduan','Status','Tanggapan','Waktu Tanggapan']);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function makeToken_() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  const d = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd');
  return 'SPD-' + d + '-' + code;
}

function doGet(e) {
  const p = e.parameter || {};
  const action = p.action || 'ping';
  try {
    const sh = getSheet_();
    if (action === 'ping') return json_({ok:true, message:'API Aduan Desa Sepadu aktif'});

    if (action === 'submit') {
      if (!p.nama || !p.kontak || !p.kategori || !p.lokasi || !p.aduan) return json_({ok:false,message:'Data wajib belum lengkap'});
      const token = makeToken_();
      sh.appendRow([token,new Date(),p.nama,p.kontak,p.email||'',p.kategori,p.lokasi,p.aduan,'Menunggu','', '']);
      return json_({ok:true,token:token,status:'Menunggu',message:'Aduan berhasil dikirim'});
    }

    if (action === 'check') {
      const token = String(p.token || '').trim().toUpperCase();
      const values = sh.getDataRange().getValues();
      for (let i=1;i<values.length;i++) {
        if (String(values[i][0]).toUpperCase() === token) {
          return json_({ok:true,data:{token:values[i][0],timestamp:values[i][1],nama:values[i][2],kategori:values[i][5],lokasi:values[i][6],aduan:values[i][7],status:values[i][8],tanggapan:values[i][9],waktuTanggapan:values[i][10]}});
        }
      }
      return json_({ok:false,message:'Token tidak ditemukan'});
    }

    if (action === 'list') {
      if (p.adminKey !== ADMIN_KEY) return json_({ok:false,message:'Kunci admin salah'});
      const values = sh.getDataRange().getValues();
      const rows = values.slice(1).map(r => ({token:r[0],timestamp:r[1],nama:r[2],kontak:r[3],email:r[4],kategori:r[5],lokasi:r[6],aduan:r[7],status:r[8],tanggapan:r[9],waktuTanggapan:r[10]}));
      return json_({ok:true,data:rows});
    }

    if (action === 'respond') {
      if (p.adminKey !== ADMIN_KEY) return json_({ok:false,message:'Kunci admin salah'});
      const token = String(p.token || '').trim().toUpperCase();
      const values = sh.getDataRange().getValues();
      for (let i=1;i<values.length;i++) {
        if (String(values[i][0]).toUpperCase() === token) {
          sh.getRange(i+1,9).setValue(p.status || 'Diproses');
          sh.getRange(i+1,10).setValue(p.tanggapan || '');
          sh.getRange(i+1,11).setValue(new Date());
          return json_({ok:true,message:'Tanggapan berhasil disimpan'});
        }
      }
      return json_({ok:false,message:'Token tidak ditemukan'});
    }

    return json_({ok:false,message:'Aksi tidak dikenali'});
  } catch(err) {
    return json_({ok:false,message:String(err)});
  }
}

function doPost(e) {
  // Mendukung POST sederhana jika nanti kamu ingin menggunakannya.
  return doGet(e);
}

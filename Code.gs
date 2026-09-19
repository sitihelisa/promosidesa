/* =====================================================
   DESA SEPADU - GOOGLE APPS SCRIPT
   Database Aduan -> Google Sheets
   ===================================================== */

const SPREADSHEET_ID = '1p2vKGIh6yXu_UC7jzpCz5IV_Sd9HR101b8A3n6gmcll';
const SHEET_NAME = 'aduan';
const ADMIN_KEY = 'sepadu2026';

const HEADERS = [
  'Token',
  'Timestamp',
  'Nama',
  'Kontak',
  'Email',
  'Kategori',
  'Lokasi',
  'Isi Aduan',
  'Status',
  'Tanggapan',
  'Waktu Tanggapan'
];

function json(data){
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet(){
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Jika tab di spreadsheet ternyata bernama "Aduan", tetap bisa digunakan.
  if(!sheet) sheet = ss.getSheetByName('Aduan');
  if(!sheet) throw new Error('Tab Google Sheet "aduan" tidak ditemukan. Buat/rename tab menjadi aduan.');

  ensureHeaders(sheet);
  return sheet;
}

function ensureHeaders(sheet){
  const range = sheet.getRange(1,1,1,HEADERS.length);
  const current = range.getDisplayValues()[0];
  const same = HEADERS.every((h,i)=>String(current[i]||'').trim()===h);

  if(!same) range.setValues([HEADERS]);
}

function doGet(e){
  try{
    const p = e && e.parameter ? e.parameter : {};
    const action = String(p.action || '').toLowerCase();

    if(action === 'check'){
      return checkAduan(String(p.token || '').trim().toUpperCase());
    }

    if(action === 'admin'){
      if(String(p.key || '') !== ADMIN_KEY) return json({ok:false,message:'Password admin salah.'});
      return getAllAduan();
    }

    return json({
      ok:true,
      service:'Desa Sepadu Aduan API',
      message:'Apps Script aktif dan terhubung ke Google Sheets.'
    });
  }catch(err){
    return json({ok:false,message:String(err.message || err)});
  }
}

function doPost(e){
  try{
    if(!e || !e.postData || !e.postData.contents){
      throw new Error('Data POST kosong.');
    }

    const data = JSON.parse(e.postData.contents);
    const action = String(data.action || '').toLowerCase();

    if(action === 'create') return createAduan(data);
    if(action === 'update') return updateAduan(data);

    throw new Error('Action tidak dikenali. Gunakan create atau update.');
  }catch(err){
    return json({ok:false,message:String(err.message || err)});
  }
}

function createAduan(data){
  const required = ['token','nama','kontak','kategori','lokasi','isiAduan'];
  required.forEach(key=>{
    if(!String(data[key] || '').trim()) throw new Error('Field wajib kosong: ' + key);
  });

  const sheet = getSheet();
  const token = String(data.token).trim().toUpperCase();

  // Cegah token ganda.
  if(findRowByToken(sheet, token) !== -1){
    throw new Error('Token sudah ada. Silakan kirim ulang aduan.');
  }

  sheet.appendRow([
    token,
    data.timestamp ? new Date(data.timestamp) : new Date(),
    String(data.nama || '').trim(),
    String(data.kontak || '').trim(),
    String(data.email || '').trim(),
    String(data.kategori || '').trim(),
    String(data.lokasi || '').trim(),
    String(data.isiAduan || '').trim(),
    'Menunggu',
    '',
    ''
  ]);

  return json({ok:true,message:'Aduan berhasil disimpan.',token:token});
}

function checkAduan(token){
  if(!token) return json({ok:false,message:'Token belum diisi.'});

  const sheet = getSheet();
  const row = findRowByToken(sheet, token);
  if(row === -1) return json({ok:true,data:null});

  return json({ok:true,data:rowToObject(sheet,row)});
}

function getAllAduan(){
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if(lastRow < 2) return json({ok:true,data:[]});

  const values = sheet.getRange(2,1,lastRow-1,HEADERS.length).getDisplayValues();
  const data = values.map(row=>{
    const obj={};
    HEADERS.forEach((h,i)=>{
      obj[keyFromHeader(h)] = row[i] || '';
    });
    return obj;
  }).filter(x=>x.token);

  return json({ok:true,data:data});
}

function updateAduan(data){
  if(String(data.key || '') !== ADMIN_KEY){
    return json({ok:false,message:'Password admin salah.'});
  }

  const token = String(data.token || '').trim().toUpperCase();
  if(!token) throw new Error('Token aduan belum diisi.');

  const sheet = getSheet();
  const row = findRowByToken(sheet, token);
  if(row === -1) throw new Error('Token aduan tidak ditemukan.');

  const status = String(data.status || 'Menunggu').trim();
  const allowed = ['Menunggu','Diproses','Selesai','Ditolak'];
  if(allowed.indexOf(status) === -1) throw new Error('Status tidak valid.');

  const tanggapan = String(data.tanggapan || '').trim();
  sheet.getRange(row,9,1,3).setValues([[status,tanggapan,new Date()]]);

  return json({ok:true,message:'Tanggapan berhasil disimpan.'});
}

function findRowByToken(sheet, token){
  const lastRow = sheet.getLastRow();
  if(lastRow < 2) return -1;

  const tokens = sheet.getRange(2,1,lastRow-1,1).getDisplayValues();
  for(let i=0;i<tokens.length;i++){
    if(String(tokens[i][0]).trim().toUpperCase() === token) return i+2;
  }
  return -1;
}

function rowToObject(sheet,row){
  const values = sheet.getRange(row,1,1,HEADERS.length).getDisplayValues()[0];
  const obj={};
  HEADERS.forEach((h,i)=>{
    obj[keyFromHeader(h)] = values[i] || '';
  });
  return obj;
}

function keyFromHeader(header){
  const map={
    'Token':'token',
    'Timestamp':'timestamp',
    'Nama':'nama',
    'Kontak':'kontak',
    'Email':'email',
    'Kategori':'kategori',
    'Lokasi':'lokasi',
    'Isi Aduan':'isiAduan',
    'Status':'status',
    'Tanggapan':'tanggapan',
    'Waktu Tanggapan':'waktuTanggapan'
  };
  return map[header] || header;
}

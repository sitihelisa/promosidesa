function toggleMenu(){document.querySelector('.nav-menu')?.classList.toggle('open')}
document.addEventListener('DOMContentLoaded',()=>{const path=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.nav-menu a').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('active')});});
function openImage(src){const m=document.getElementById('imageModal');const i=document.getElementById('modalImage');if(m&&i){i.src=src;m.classList.add('open')}}
function closeImage(){document.getElementById('imageModal')?.classList.remove('open')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeImage()});
function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500)}
function makeToken(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let r='';for(let i=0;i<6;i++)r+=chars[Math.floor(Math.random()*chars.length)];const d=new Date();const ds=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');return `SPD-${ds}-${r}`}
function getLocalAduan(){try{return JSON.parse(localStorage.getItem('sepadu_aduan')||'[]')}catch{return[]}}
function saveLocalAduan(x){localStorage.setItem('sepadu_aduan',JSON.stringify(x))}
async function postToSheet(data){
 const url=window.APP_SCRIPT_URL;
 if(!url) throw new Error('URL Apps Script belum diisi di config.js.');
 // Send as text/plain to avoid an application/json CORS preflight.
 const response=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data),redirect:'follow'});
 const text=await response.text();
 let result;
 try{result=JSON.parse(text)}catch{throw new Error('Respons Apps Script bukan JSON. Periksa deployment Web app.');}
 if(!response.ok||!result.ok)throw new Error(result.message||'Apps Script menolak data.');
 return result;
}
async function submitAduan(e){
 e.preventDefault();
 const form=e.currentTarget;
 const box=document.getElementById('hasilAduan');
 const byId=id=>document.getElementById(id);
 const data={action:'create',token:makeToken(),timestamp:new Date().toISOString(),nama:byId('aduanNama').value.trim(),kontak:byId('aduanKontak').value.trim(),email:byId('aduanEmail').value.trim(),kategori:byId('aduanKategori').value,lokasi:byId('aduanLokasi').value.trim(),isiAduan:byId('aduanIsi').value.trim(),status:'Menunggu',tanggapan:'',waktuTanggapan:''};
 const button=form.querySelector('button[type="submit"]');
 if(button){button.disabled=true;button.textContent='Mengirim...';}
 if(box)box.textContent='Mengirim aduan ke Google Sheets...';
 try{
   const result=await postToSheet(data);
   const arr=getLocalAduan();arr.push(data);saveLocalAduan(arr);
   if(box)box.innerHTML=`<div class="token-box"><div><strong>Aduan berhasil dikirim.</strong></div><div class="helper">Simpan token ini untuk mengecek jawaban:</div><div class="token">${data.token}</div></div>`;
   form.reset();
 }catch(err){
   if(box)box.innerHTML=`<div class="status-card"><strong>Aduan belum berhasil dikirim.</strong><p>${String(err.message||err)}</p><p>Periksa URL Apps Script, izin deployment, dan log eksekusi Apps Script. Jangan tutup halaman sebelum mencoba lagi.</p></div>`;
   console.error('Gagal mengirim aduan:',err);
 }finally{if(button){button.disabled=false;button.textContent='Kirim Aduan';}}
}
async function cekAduan(){
 const token=(document.getElementById('trackingToken')?.value||'').trim().toUpperCase();
 const box=document.getElementById('hasilTracking');
 if(!token){box.innerHTML='<div class="status-card">Masukkan token terlebih dahulu.</div>';return}
 let data=null;
 try{const r=await fetch(window.APP_SCRIPT_URL+'?action=check&token='+encodeURIComponent(token));const j=await r.json();if(j.ok)data=j.data;}catch(err){console.warn(err)}
 if(!data)data=getLocalAduan().find(x=>String(x.token).toUpperCase()===token);
 box.innerHTML=data?`<div class="status-card"><strong>${data.kategori||'Aduan'}</strong><p>${data.isiAduan||data.isi||''}</p><span class="badge">${data.status||'Menunggu'}</span><p><strong>Tanggapan admin:</strong><br>${data.tanggapan||'Belum ada tanggapan. Silakan cek kembali nanti.'}</p></div>`:'<div class="status-card">Token tidak ditemukan atau server belum dapat dihubungi. Periksa token dan coba lagi.</div>';
}
function kirimPesan(e){e.preventDefault();toast('Pesan umum belum terhubung ke layanan email.');}
function adminLogin(e){e.preventDefault();const key=document.getElementById('adminKey').value;if(key!==window.ADMIN_KEY){document.getElementById('loginMsg').textContent='Password admin salah.';return}sessionStorage.setItem('sepadu_admin','1');showAdmin()}
function showAdmin(){document.getElementById('adminLogin')?.remove();const app=document.getElementById('adminApp');if(!app)return;app.style.display='block';renderAdmin()}
function logoutAdmin(){sessionStorage.removeItem('sepadu_admin');location.reload()}
async function renderAdmin(){
 const list=document.getElementById('adminList');if(!list)return;
 list.innerHTML='<div class="empty">Memuat aduan...</div>';
 let data=[];
 try{const r=await fetch(window.APP_SCRIPT_URL+'?action=admin&key='+encodeURIComponent(window.ADMIN_KEY));const j=await r.json();if(j.ok&&Array.isArray(j.data))data=j.data;else throw new Error(j.message||'Gagal memuat aduan');}
 catch(err){list.innerHTML=`<div class="status-card">Tidak dapat memuat aduan dari Google Sheets. ${String(err.message||err)}</div>`;return;}
 if(!data.length){list.innerHTML='<div class="empty">Belum ada aduan di Google Sheets.</div>';return;}
 list.innerHTML='';
 data.forEach((x,i)=>{
   const item=document.createElement('div');item.className='admin-item';
   const heading=document.createElement('h3');heading.textContent=(x.token||'')+' · '+(x.status||'Menunggu');item.appendChild(heading);
   const info=document.createElement('p');info.textContent=[x.nama,x.kontak,x.kategori].filter(Boolean).join(' · ');item.appendChild(info);
   const loc=document.createElement('p');loc.textContent='Lokasi: '+(x.lokasi||'');item.appendChild(loc);
   const complaint=document.createElement('p');complaint.textContent='Aduan: '+(x.isiAduan||'');item.appendChild(complaint);
   const label=document.createElement('label');label.className='field';label.textContent='Tanggapan admin';
   const textarea=document.createElement('textarea');textarea.id='resp-'+i;textarea.value=x.tanggapan||'';label.appendChild(textarea);item.appendChild(label);
   const select=document.createElement('select');select.id='stat-'+i;['Menunggu','Diproses','Selesai','Ditolak'].forEach(status=>{const opt=document.createElement('option');opt.value=status;opt.textContent=status;opt.selected=(x.status||'Menunggu')===status;select.appendChild(opt)});item.appendChild(select);
   const btn=document.createElement('button');btn.type='button';btn.textContent='Simpan Tanggapan';btn.addEventListener('click',()=>saveResponseRemote(x,i));item.appendChild(btn);
   list.appendChild(item);
 });
}
async function saveResponseRemote(x,i){
 const status=document.getElementById('stat-'+i).value;
 const tanggapan=document.getElementById('resp-'+i).value.trim();
 const payload={action:'update',key:window.ADMIN_KEY,token:x.token,status,tanggapan};
 try{await postToSheet(payload);toast('Tanggapan berhasil disimpan ke Google Sheets.');await renderAdmin();}
 catch(e){toast('Gagal menyimpan: '+String(e.message||e));console.error(e);}
}
window.APP_SCRIPT_URL=typeof APP_SCRIPT_URL==='string'?APP_SCRIPT_URL:'';
window.ADMIN_KEY=typeof ADMIN_KEY==='string'?ADMIN_KEY:'';
if(document.getElementById('adminApp')&&sessionStorage.getItem('sepadu_admin')==='1')showAdmin();

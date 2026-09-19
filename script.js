
function toggleMenu(){document.querySelector('.nav-menu')?.classList.toggle('open')}
document.addEventListener('DOMContentLoaded',()=>{const path=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.nav-menu a').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('active')});});
function openImage(src){const m=document.getElementById('imageModal');const i=document.getElementById('modalImage');if(m&&i){i.src=src;m.classList.add('open')}}
function closeImage(){document.getElementById('imageModal')?.classList.remove('open')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeImage()});
function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3200)}
function makeToken(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let r='';for(let i=0;i<6;i++)r+=chars[Math.floor(Math.random()*chars.length)];const d=new Date();const ds=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');return `SPD-${ds}-${r}`}
function getLocalAduan(){try{return JSON.parse(localStorage.getItem('sepadu_aduan')||'[]')}catch{return[]}}
function saveLocalAduan(x){localStorage.setItem('sepadu_aduan',JSON.stringify(x))}
async function postToSheet(data){if(!window.APP_SCRIPT_URL)return {ok:true,local:true};const r=await fetch(window.APP_SCRIPT_URL,{method:'POST',body:JSON.stringify(data)});return await r.json().catch(()=>({ok:r.ok}))}
async function submitAduan(e){e.preventDefault();const form=e.target;const data={action:'create',token:makeToken(),timestamp:new Date().toISOString(),nama:aduanNama.value.trim(),kontak:aduanKontak.value.trim(),email:aduanEmail.value.trim(),kategori:aduanKategori.value,lokasi:aduanLokasi.value.trim(),isiAduan:aduanIsi.value.trim(),status:'Menunggu',tanggapan:'',waktuTanggapan:''};try{const arr=getLocalAduan();arr.push(data);saveLocalAduan(arr);const result=await postToSheet(data);const box=document.getElementById('hasilAduan');box.innerHTML=`<div class="token-box"><div>✅ Aduan berhasil dikirim.</div><div class="helper">Simpan token ini untuk mengecek jawaban:</div><div class="token">${data.token}</div>${result.local?'<div class="helper">Mode demo: data tersimpan di browser ini. Isi URL Apps Script agar masuk ke Google Sheet.</div>':''}</div>`;form.reset();}catch(err){toast('Aduan disimpan lokal, tetapi koneksi Google Sheet gagal.')}}
async function cekAduan(){const token=(document.getElementById('trackingToken')?.value||'').trim().toUpperCase();const box=document.getElementById('hasilTracking');if(!token){box.innerHTML='<div class="status-card">Masukkan token terlebih dahulu.</div>';return}let data=null;if(window.APP_SCRIPT_URL){try{const r=await fetch(window.APP_SCRIPT_URL+'?action=check&token='+encodeURIComponent(token));const j=await r.json();data=j.data||j;}catch{}}if(!data){data=getLocalAduan().find(x=>x.token===token)}box.innerHTML=data?`<div class="status-card"><strong>${data.kategori||'Aduan'}</strong><p>${data.isiAduan||data.isi||''}</p><span class="badge">${data.status||'Menunggu'}</span><p><strong>Tanggapan admin:</strong><br>${data.tanggapan||'Belum ada tanggapan. Silakan cek kembali nanti.'}</p></div>`:'<div class="status-card">Token tidak ditemukan. Periksa kembali token yang dimasukkan.</div>'}
function kirimPesan(e){e.preventDefault();toast('Pesan umum siap dikirim. Hubungkan endpoint email jika diperlukan.');e.target.reset()}
function adminLogin(e){e.preventDefault();const key=document.getElementById('adminKey').value;if(key!==window.ADMIN_KEY){document.getElementById('loginMsg').textContent='Password admin salah.';return}sessionStorage.setItem('sepadu_admin','1');showAdmin()}
function showAdmin(){document.getElementById('adminLogin')?.remove();const app=document.getElementById('adminApp');if(!app)return;app.style.display='block';renderAdmin()}
function logoutAdmin(){sessionStorage.removeItem('sepadu_admin');location.reload()}
async function renderAdmin(){
 const list=document.getElementById('adminList');
 if(!list)return;
 list.innerHTML='<div class="empty">Memuat aduan...</div>';
 let data=[];
 if(window.APP_SCRIPT_URL){
  try{
   const r=await fetch(window.APP_SCRIPT_URL+'?action=admin&key='+encodeURIComponent(window.ADMIN_KEY));
   const j=await r.json();
   if(j.ok && Array.isArray(j.data)) data=j.data;
  }catch(e){}
 }
 if(!data.length) data=getLocalAduan();
 if(!data.length){list.innerHTML='<div class="empty">Belum ada aduan.</div>';return;}
 list.innerHTML=data.map((x,i)=>`<div class="admin-item"><h3>${x.token||''} <span class="badge">${x.status||'Menunggu'}</span></h3><p><strong>${x.nama||''}</strong> · ${x.kontak||''} · ${x.kategori||''}</p><p><strong>Lokasi:</strong> ${x.lokasi||''}</p><p><strong>Aduan:</strong> ${x.isiAduan||''}</p><label class="field"><span><strong>Tanggapan admin</strong></span><textarea id="resp-${i}">${x.tanggapan||''}</textarea></label><div class="admin-actions" style="margin-top:10px"><select id="stat-${i}"><option ${x.status==='Menunggu'?'selected':''}>Menunggu</option><option ${x.status==='Diproses'?'selected':''}>Diproses</option><option ${x.status==='Selesai'?'selected':''}>Selesai</option><option ${x.status==='Ditolak'?'selected':''}>Ditolak</option></select><button onclick='saveResponseRemote(${JSON.stringify(x) .replace(/'/g,"&#39;")},${i})'>Simpan Tanggapan</button></div></div>`).join('');
}
async function saveResponseRemote(x,i){
 const status=document.getElementById('stat-'+i).value;
 const tanggapan=document.getElementById('resp-'+i).value.trim();
 const payload={action:'update',key:window.ADMIN_KEY,token:x.token,status,tanggapan,waktuTanggapan:new Date().toISOString()};
 try{
  const result=await postToSheet(payload);
  if(!result.ok) throw new Error(result.message||'Gagal');
  toast('Tanggapan berhasil disimpan ke Google Sheet.');
  renderAdmin();
 }catch(e){toast('Gagal menyimpan tanggapan ke Google Sheet.');}
}
window.APP_SCRIPT_URL){try{await postToSheet({action:'update',...x})}catch{}}renderAdmin();toast('Tanggapan disimpan.')}
window.APP_SCRIPT_URL=typeof APP_SCRIPT_URL==='string'?APP_SCRIPT_URL:'';
window.ADMIN_KEY=typeof ADMIN_KEY==='string'?ADMIN_KEY:'sepadu2026';

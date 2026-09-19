/* =====================================================
   DESA SEPADU - JAVASCRIPT INTERACTIVE
   Terhubung ke Google Sheets melalui Google Apps Script
===================================================== */


/* ================= KONFIGURASI ================= */

// URL Apps Script Web App Desa Sepadu
const APP_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzES78HYbTwCbA_CbqUUZqs5GZB2uRH-6Y4Qo6y4Q832G81j2SdYOET6mDl6QP6QReh/exec";

// Password admin
const ADMIN_KEY = "sepadu2026";


/* ================= NAVBAR ================= */

function toggleMenu(){
    document.querySelector('.nav-menu')?.classList.toggle('open');
}


document.addEventListener('DOMContentLoaded', () => {

    const path =
        location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-menu a').forEach(a => {

        if(a.getAttribute('href') === path){
            a.classList.add('active');
        }

    });

});


/* ================= GALERI ================= */

function openImage(src){

    const modal =
        document.getElementById('imageModal');

    const image =
        document.getElementById('modalImage');

    if(modal && image){

        image.src = src;

        modal.classList.add('open');

    }

}


function closeImage(){

    document
        .getElementById('imageModal')
        ?.classList.remove('open');

}


document.addEventListener('keydown', e => {

    if(e.key === 'Escape'){

        closeImage();

    }

});


/* ================= NOTIFIKASI ================= */

function toast(msg){

    const t =
        document.getElementById('toast');

    if(!t) return;

    t.textContent = msg;

    t.classList.add('show');

    setTimeout(() => {

        t.classList.remove('show');

    }, 3500);

}


/* ================= ADUAN ================= */

function makeToken(){

    const chars =
        'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let r = '';

    for(let i = 0; i < 6; i++){

        r += chars[
            Math.floor(
                Math.random() * chars.length
            )
        ];

    }

    const d = new Date();

    const ds =
        d.getFullYear() +
        String(d.getMonth() + 1).padStart(2,'0') +
        String(d.getDate()).padStart(2,'0');

    return `SPD-${ds}-${r}`;

}


/* ================= DATA LOKAL ================= */

function getLocalAduan(){

    try{

        return JSON.parse(
            localStorage.getItem('sepadu_aduan') || '[]'
        );

    }catch{

        return [];

    }

}


function saveLocalAduan(data){

    localStorage.setItem(
        'sepadu_aduan',
        JSON.stringify(data)
    );

}


/* ================= URL APPS SCRIPT ================= */

function getAppScriptUrl(){

    return APP_SCRIPT_URL;

}


/* ================= RESPONSE JSON ================= */

async function readJsonResponse(response){

    const text =
        await response.text();

    let result;

    try{

        result = JSON.parse(text);

    }catch{

        throw new Error(
            'Respons Apps Script bukan JSON. ' +
            'Pastikan Web App sudah di-deploy sebagai Anyone.'
        );

    }

    if(!response.ok){

        throw new Error(
            result.message ||
            `HTTP ${response.status}`
        );

    }

    if(result.ok === false){

        throw new Error(
            result.message ||
            'Apps Script menolak permintaan.'
        );

    }

    return result;

}


/* ================= POST KE GOOGLE SHEETS ================= */

async function postToSheet(data){

    const url =
        getAppScriptUrl();

    const response =
        await fetch(url, {

            method: 'POST',

            headers: {
                'Content-Type':
                    'text/plain;charset=utf-8'
            },

            body: JSON.stringify(data),

            redirect: 'follow',

            cache: 'no-store'

        });

    return readJsonResponse(response);

}


/* ================= GET DARI GOOGLE SHEETS ================= */

async function getFromSheet(params){

    const url =
        getAppScriptUrl() +
        '?' +
        new URLSearchParams(params).toString();

    const response =
        await fetch(url, {

            method: 'GET',

            cache: 'no-store',

            redirect: 'follow'

        });

    return readJsonResponse(response);

}


/* ================= KIRIM ADUAN ================= */

async function submitAduan(e){

    e.preventDefault();

    const form =
        e.currentTarget;

    const box =
        document.getElementById('hasilAduan');

    const byId =
        id => document.getElementById(id);


    const data = {

        action: 'create',

        token: makeToken(),

        timestamp:
            new Date().toISOString(),

        nama:
            byId('aduanNama')?.value.trim() || '',

        kontak:
            byId('aduanKontak')?.value.trim() || '',

        email:
            byId('aduanEmail')?.value.trim() || '',

        kategori:
            byId('aduanKategori')?.value || '',

        lokasi:
            byId('aduanLokasi')?.value.trim() || '',

        isiAduan:
            byId('aduanIsi')?.value.trim() || '',

        status: 'Menunggu',

        tanggapan: '',

        waktuTanggapan: ''

    };


    if(!data.nama){

        if(box){

            box.innerHTML =
                '<div class="status-card">' +
                'Nama belum diisi.' +
                '</div>';

        }

        return;

    }


    if(!data.kategori){

        if(box){

            box.innerHTML =
                '<div class="status-card">' +
                'Kategori belum dipilih.' +
                '</div>';

        }

        return;

    }


    if(!data.lokasi){

        if(box){

            box.innerHTML =
                '<div class="status-card">' +
                'Lokasi belum diisi.' +
                '</div>';

        }

        return;

    }


    if(!data.isiAduan){

        if(box){

            box.innerHTML =
                '<div class="status-card">' +
                'Isi aduan belum diisi.' +
                '</div>';

        }

        return;

    }


    const button =
        form.querySelector(
            'button[type="submit"]'
        );


    if(button){

        button.disabled = true;

        button.textContent =
            'Mengirim...';

    }


    if(box){

        box.innerHTML =
            '<div class="status-card">' +
            'Mengirim aduan ke Google Sheets...' +
            '</div>';

    }


    try{

        const result =
            await postToSheet(data);


        /* Simpan cadangan lokal */

        const arr =
            getLocalAduan();

        arr.push(data);

        saveLocalAduan(arr);


        if(box){

            box.innerHTML = `

                <div class="token-box">

                    <div>
                        <strong>
                            ✅ Aduan berhasil dikirim.
                        </strong>
                    </div>

                    <div class="helper">
                        Simpan token ini untuk
                        mengecek jawaban:
                    </div>

                    <div class="token">
                        ${escapeHtml(
                            result.token || data.token
                        )}
                    </div>

                </div>

            `;

        }


        form.reset();


    }catch(err){

        if(box){

            box.innerHTML = `

                <div class="status-card">

                    <strong>
                        ❌ Aduan belum berhasil dikirim.
                    </strong>

                    <p>
                        ${escapeHtml(
                            String(
                                err.message || err
                            )
                        )}
                    </p>

                </div>

            `;

        }


        console.error(
            'Gagal mengirim aduan:',
            err
        );

    }finally{

        if(button){

            button.disabled = false;

            button.textContent =
                'Kirim Aduan';

        }

    }

}


/* ================= CEK STATUS ADUAN ================= */

async function cekAduan(){

    const input =
        document.getElementById(
            'trackingToken'
        );

    const box =
        document.getElementById(
            'hasilTracking'
        );


    const token =
        (input?.value || '')
        .trim()
        .toUpperCase();


    if(!box) return;


    if(!token){

        box.innerHTML =
            '<div class="status-card">' +
            'Masukkan token terlebih dahulu.' +
            '</div>';

        return;

    }


    box.innerHTML =
        '<div class="status-card">' +
        'Memeriksa Google Sheets...' +
        '</div>';


    try{

        const result =
            await getFromSheet({

                action: 'check',

                token: token

            });


        const data =
            result.data;


        if(data){

            box.innerHTML = `

                <div class="status-card">

                    <strong>
                        ${escapeHtml(
                            data.kategori ||
                            'Aduan'
                        )}
                    </strong>

                    <p>
                        ${escapeHtml(
                            data.isiAduan || ''
                        )}
                    </p>

                    <span class="badge">
                        ${escapeHtml(
                            data.status ||
                            'Menunggu'
                        )}
                    </span>

                    <p>
                        <strong>
                            Tanggapan admin:
                        </strong>
                        <br>

                        ${escapeHtml(
                            data.tanggapan ||
                            'Belum ada tanggapan. Silakan cek kembali nanti.'
                        )}

                    </p>

                </div>

            `;

        }else{

            box.innerHTML =
                '<div class="status-card">' +
                'Token tidak ditemukan.' +
                '</div>';

        }


    }catch(err){

        console.error(
            'Gagal mengecek aduan:',
            err
        );


        const local =
            getLocalAduan()
            .find(
                x =>
                    String(x.token)
                    .toUpperCase() === token
            );


        if(local){

            box.innerHTML = `

                <div class="status-card">

                    <strong>
                        ${escapeHtml(
                            local.kategori ||
                            'Aduan'
                        )}
                    </strong>

                    <p>
                        ${escapeHtml(
                            local.isiAduan || ''
                        )}
                    </p>

                    <span class="badge">
                        ${escapeHtml(
                            local.status ||
                            'Menunggu'
                        )}
                    </span>

                    <p>

                        <strong>
                            Tanggapan admin:
                        </strong>

                        <br>

                        ${escapeHtml(
                            local.tanggapan ||
                            'Belum ada tanggapan.'
                        )}

                    </p>

                </div>

            `;

        }else{

            box.innerHTML = `

                <div class="status-card">

                    ❌ Tidak dapat menghubungi
                    server.

                    <p>
                        ${escapeHtml(
                            String(
                                err.message ||
                                err
                            )
                        )}
                    </p>

                </div>

            `;

        }

    }

}


/* ================= PESAN UMUM ================= */

function kirimPesan(e){

    e.preventDefault();

    toast(
        'Pesan umum belum terhubung ke layanan email. ' +
        'Gunakan formulir Aduan untuk laporan desa.'
    );

}


/* ================= ADMIN ================= */

function adminLogin(e){

    e.preventDefault();


    const key =
        document.getElementById(
            'adminKey'
        )?.value || '';


    if(key !== ADMIN_KEY){

        const msg =
            document.getElementById(
                'loginMsg'
            );

        if(msg){

            msg.textContent =
                'Password admin salah.';

        }

        return;

    }


    sessionStorage.setItem(
        'sepadu_admin',
        '1'
    );


    showAdmin();

}


/* ================= TAMPIL ADMIN ================= */

function showAdmin(){

    document
        .getElementById('adminLogin')
        ?.remove();


    const app =
        document.getElementById(
            'adminApp'
        );


    if(!app) return;


    app.style.display =
        'block';


    renderAdmin();

}


/* ================= LOGOUT ADMIN ================= */

function logoutAdmin(){

    sessionStorage.removeItem(
        'sepadu_admin'
    );

    location.reload();

}


/* ================= DATA ADMIN ================= */

async function renderAdmin(){

    const list =
        document.getElementById(
            'adminList'
        );


    if(!list) return;


    list.innerHTML =
        '<div class="empty">' +
        'Memuat aduan dari Google Sheets...' +
        '</div>';


    let data = [];


    try{

        const result =
            await getFromSheet({

                action: 'admin',

                key: ADMIN_KEY

            });


        data =
            Array.isArray(result.data)
                ? result.data
                : [];


    }catch(err){

        list.innerHTML = `

            <div class="status-card">

                ❌ Tidak dapat memuat
                aduan dari Google Sheets.

                <p>
                    ${escapeHtml(
                        String(
                            err.message ||
                            err
                        )
                    )}
                </p>

            </div>

        `;

        return;

    }


    if(!data.length){

        list.innerHTML =
            '<div class="empty">' +
            'Belum ada aduan di Google Sheets.' +
            '</div>';

        return;

    }


    list.innerHTML = '';


    data.forEach((x, i) => {

        const item =
            document.createElement(
                'div'
            );

        item.className =
            'admin-item';


        const heading =
            document.createElement(
                'h3'
            );

        heading.textContent =
            (x.token || '') +
            ' · ' +
            (x.status || 'Menunggu');


        item.appendChild(
            heading
        );


        const info =
            document.createElement(
                'p'
            );

        info.textContent =
            [
                x.nama,
                x.kontak,
                x.email,
                x.kategori
            ]
            .filter(Boolean)
            .join(' · ');


        item.appendChild(
            info
        );


        const loc =
            document.createElement(
                'p'
            );

        loc.textContent =
            'Lokasi: ' +
            (x.lokasi || '');


        item.appendChild(
            loc
        );


        const complaint =
            document.createElement(
                'p'
            );

        complaint.textContent =
            'Aduan: ' +
            (x.isiAduan || '');


        item.appendChild(
            complaint
        );


        const label =
            document.createElement(
                'label'
            );

        label.className =
            'field';

        label.textContent =
            'Tanggapan admin';


        const textarea =
            document.createElement(
                'textarea'
            );

        textarea.id =
            'resp-' + i;

        textarea.value =
            x.tanggapan || '';


        label.appendChild(
            textarea
        );


        item.appendChild(
            label
        );


        const select =
            document.createElement(
                'select'
            );

        select.id =
            'stat-' + i;


        [
            'Menunggu',
            'Diproses',
            'Selesai',
            'Ditolak'
        ]
        .forEach(status => {

            const opt =
                document.createElement(
                    'option'
                );

            opt.value =
                status;

            opt.textContent =
                status;

            opt.selected =
                (
                    x.status ||
                    'Menunggu'
                ) === status;


            select.appendChild(
                opt
            );

        });


        item.appendChild(
            select
        );


        const btn =
            document.createElement(
                'button'
            );

        btn.type =
            'button';

        btn.textContent =
            'Simpan Tanggapan';


        btn.addEventListener(
            'click',
            () =>
                saveResponseRemote(
                    x,
                    i
                )
        );


        item.appendChild(
            btn
        );


        list.appendChild(
            item
        );

    });

}


/* ================= SIMPAN TANGGAPAN ================= */

async function saveResponseRemote(
    x,
    i
){

    const status =
        document.getElementById(
            'stat-' + i
        )?.value || 'Menunggu';


    const tanggapan =
        document.getElementById(
            'resp-' + i
        )?.value.trim() || '';


    const payload = {

        action: 'update',

        key: ADMIN_KEY,

        token: x.token,

        status: status,

        tanggapan: tanggapan

    };


    try{

        await postToSheet(
            payload
        );


        toast(
            '✅ Tanggapan berhasil disimpan ke Google Sheets.'
        );


        await renderAdmin();


    }catch(e){

        toast(
            '❌ Gagal menyimpan: ' +
            String(
                e.message || e
            )
        );


        console.error(e);

    }

}


/* ================= UTILITAS ================= */

function escapeHtml(value){

    return String(
        value ?? ''
    )

    .replaceAll(
        '&',
        '&amp;'
    )

    .replaceAll(
        '<',
        '&lt;'
    )

    .replaceAll(
        '>',
        '&gt;'
    )

    .replaceAll(
        '"',
        '&quot;'
    )

    .replaceAll(
        "'",
        '&#039;'
    );

}


/* ================= AUTO ADMIN ================= */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        if(
            document.getElementById(
                'adminApp'
            ) &&
            sessionStorage.getItem(
                'sepadu_admin'
            ) === '1'
        ){

            showAdmin();

        }

    }
);

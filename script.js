// ===============================
// MENU MOBILE
// ===============================

function toggleMenu() {

    const navMenu =
        document.querySelector(".nav-menu");

    navMenu.classList.toggle("active");

}


// Tutup menu setelah memilih halaman

const navLinks =
    document.querySelectorAll(".nav-menu a");

navLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        const navMenu =
            document.querySelector(".nav-menu");

        navMenu.classList.remove("active");

    });

});


// ===============================
// GALERI
// ===============================

function openImage(imageSource) {

    const modal =
        document.getElementById("imageModal");

    const modalImage =
        document.getElementById("modalImage");

    if (modal && modalImage) {

        modalImage.src = imageSource;

        modal.style.display = "flex";

    }

}


function closeImage() {

    const modal =
        document.getElementById("imageModal");

    if (modal) {

        modal.style.display = "none";

    }

}


// Tutup modal jika klik area luar foto

const imageModal =
    document.getElementById("imageModal");

if (imageModal) {

    imageModal.addEventListener(
        "click",
        function(event) {

            if (event.target === imageModal) {

                closeImage();

            }

        }
    );

}


// ===============================
// FORM KONTAK
// ===============================

function kirimPesan(event) {

    event.preventDefault();


    const nama =
        document.getElementById("nama").value;

    const email =
        document.getElementById("email").value;

    const pesan =
        document.getElementById("pesan").value;


    if (
        nama.trim() === "" ||
        email.trim() === "" ||
        pesan.trim() === ""
    ) {

        alert(
            "Silakan lengkapi semua data terlebih dahulu."
        );

        return;

    }


    alert(
        "Terima kasih, " +
        nama +
        "! Pesan Anda berhasil dikirim."
    );


    document.getElementById("nama").value = "";

    document.getElementById("email").value = "";

    document.getElementById("pesan").value = "";

}


// ===============================
// TOMBOL ESC
// ===============================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeImage();

        }

    }
);
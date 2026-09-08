/* =========================================================
   BANTU ANAK KRAKATAU 2026
   FINAL JAVASCRIPT
   ========================================================= */


/* ================= DONATION MODAL ================= */

const donationModal = document.getElementById("donationModal");
const selectedAmount = document.getElementById("selectedAmount");

let currentAmount = 0;


function openDonation() {

  donationModal.classList.add("active");

  document.body.style.overflow = "hidden";

}


function closeDonation() {

  donationModal.classList.remove("active");

  document.body.style.overflow = "";

}


function selectAmount(amount) {

  currentAmount = amount;

  if (selectedAmount) {

    selectedAmount.textContent =
      "Rp" + amount.toLocaleString("id-ID");

  }

  const buttons =
    document.querySelectorAll(".amount-grid button");

  buttons.forEach(function(button) {

    button.classList.remove("selected");

  });


  buttons.forEach(function(button) {

    /*
     * Membaca nominal langsung dari tombol.
     * Contoh:
     * Rp5.000  → 5000
     * Rp10.000 → 10000
     * Rp25.000 → 25000
     */

    const number =
      parseInt(
        button.textContent.replace(/\D/g, ""),
        10
      );

    if (number === amount) {

      button.classList.add("selected");

    }

  });

}


/* ================= PAYMENT ================= */

function showPaymentMessage() {

  if (currentAmount === 0) {

    showToast(
      "Pilih nominal donasi terlebih dahulu ❤️"
    );

    return;

  }

  showToast(
    "QRIS sedang dipersiapkan. Nominal Rp" +
    currentAmount.toLocaleString("id-ID") +
    " sudah dipilih."
  );

}


/* ================= TOAST ================= */

let toastTimer;


function showToast(message) {

  const toast =
    document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(function() {

    toast.classList.remove("show");

  }, 3200);

}


/* ================= COPY LINK ================= */

function copyLink() {

  const url =
    window.location.href;


  if (navigator.clipboard) {

    navigator.clipboard.writeText(url)

      .then(function() {

        showToast(
          "Link berhasil disalin ❤️"
        );

      })

      .catch(function() {

        showToast(
          "Silakan salin alamat halaman ini."
        );

      });

  } else {

    showToast(
      "Silakan salin alamat halaman ini."
    );

  }

}


/* ================= WHATSAPP ================= */

function shareWhatsApp() {

  const text =
    "Mari ikut peduli terhadap Gunung Anak Krakatau dan masyarakat yang terdampak aktivitas erupsi 2026 ❤️\n\n" +
    "Bantu Anak Krakatau — Peduli dan Bersama\n" +
    window.location.href;


  const whatsapp =
    "https://wa.me/?text=" +
    encodeURIComponent(text);


  window.open(
    whatsapp,
    "_blank",
    "noopener"
  );

}


/* ================= ESC KEY ================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {

      closeDonation();

    }

  }
);


/* ================= IMAGE ERROR HANDLING ================= */

document.querySelectorAll("img").forEach(function(img) {

  img.addEventListener(
    "error",
    function() {

      /*
       * Jika gambar eksternal/Wikimedia
       * tidak dapat dimuat, layout tetap aman.
       */

      this.style.opacity = "0";

      if (this.parentElement) {

        this.parentElement.style.background =
          "linear-gradient(135deg,#25372f,#111916)";

      }

    }
  );

});


/* ================= ACTIVE NAV ================= */

const navLinks =
  document.querySelectorAll(".desktop-nav a");

const sections =
  document.querySelectorAll("section[id]");


window.addEventListener(
  "scroll",
  function() {

    let current = "";


    sections.forEach(function(section) {

      const top =
        section.offsetTop - 160;


      if (window.scrollY >= top) {

        current =
          section.getAttribute("id");

      }

    });


    navLinks.forEach(function(link) {

      link.style.opacity = ".75";


      if (
        link.getAttribute("href") ===
        "#" + current
      ) {

        link.style.opacity = "1";

      }

    });

  },
  { passive: true }
);


/* ================= CLOSE MODAL BY BACKDROP ================= */

if (donationModal) {

  donationModal.addEventListener(
    "click",
    function(event) {

      if (
        event.target.classList.contains(
          "modal-backdrop"
        )
      ) {

        closeDonation();

      }

    }
  );

}
/* =========================================================
   BANTU ANAK KRAKATAU 2026
   FINAL JAVASCRIPT
   ========================================================= */


/* =========================================================
   DONATION STATE
   ========================================================= */

const donationModal = document.getElementById("donationModal");
const selectedAmount = document.getElementById("selectedAmount");
const qrisPage = document.getElementById("qrisPage");

let currentAmount = 0;
let toastTimer;


/* =========================================================
   DONATION MODAL
   ========================================================= */

function openDonation() {

  if (!donationModal) return;

  donationModal.classList.add("active");

  document.body.style.overflow = "hidden";

}


function closeDonation() {

  if (!donationModal) return;

  donationModal.classList.remove("active");

  /*
   * Jangan langsung mengubah overflow jika
   * halaman QRIS masih terbuka.
   */

  if (!qrisPage || !qrisPage.classList.contains("active")) {

    document.body.style.overflow = "";

  }

}


/* =========================================================
   SELECT DONATION AMOUNT
   ========================================================= */

function selectAmount(amount) {

  currentAmount = Number(amount) || 0;


  if (selectedAmount) {

    selectedAmount.textContent =
      "Rp" + currentAmount.toLocaleString("id-ID");

  }


  const buttons =
    document.querySelectorAll(".amount-grid button");


  buttons.forEach(function(button) {

    button.classList.remove("selected");

  });


  buttons.forEach(function(button) {

    const number =
      parseInt(
        button.textContent.replace(/\D/g, ""),
        10
      );


    if (number === currentAmount) {

      button.classList.add("selected");

    }

  });

}


/* =========================================================
   PAYMENT / QRIS
   ========================================================= */

function showPaymentMessage() {

  if (currentAmount <= 0) {

    showToast(
      "Pilih nominal donasi terlebih dahulu ❤️"
    );

    return;

  }


  openQRPage();

}


/* =========================================================
   OPEN QRIS PAGE
   ========================================================= */

function openQRPage() {

  if (!qrisPage) {

    showToast(
      "Halaman QRIS belum tersedia."
    );

    return;

  }


  /*
   * Tampilkan nominal yang dipilih
   * jika elemen tersedia.
   */

  const qrisAmount =
    qrisPage.querySelector(".qris-amount");


  if (qrisAmount && currentAmount > 0) {

    qrisAmount.textContent =
      "Rp" + currentAmount.toLocaleString("id-ID");

  }


  /*
   * Tutup modal donasi sebelum
   * membuka halaman QRIS.
   */

  if (donationModal) {

    donationModal.classList.remove("active");

  }


  qrisPage.classList.add("active");

  document.body.style.overflow = "hidden";

}


/* =========================================================
   CLOSE QRIS PAGE
   ========================================================= */

function closeQRPage() {

  if (!qrisPage) return;

  qrisPage.classList.remove("active");

  document.body.style.overflow = "";

}


/* =========================================================
   TOAST
   ========================================================= */

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


/* =========================================================
   COPY LINK
   ========================================================= */

function copyLink() {

  const url =
    window.location.href;


  /*
   * Clipboard API
   */

  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {

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

    return;

  }


  /*
   * Fallback untuk browser tertentu.
   */

  try {

    const textarea =
      document.createElement("textarea");

    textarea.value = url;

    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    document.execCommand("copy");

    document.body.removeChild(textarea);

    showToast(
      "Link berhasil disalin ❤️"
    );

  } catch (error) {

    showToast(
      "Silakan salin alamat halaman ini."
    );

  }

}


/* =========================================================
   WHATSAPP SHARE
   ========================================================= */

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
    "noopener,noreferrer"
  );

}


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key !== "Escape") return;


    if (
      qrisPage &&
      qrisPage.classList.contains("active")
    ) {

      closeQRPage();

      return;

    }


    if (
      donationModal &&
      donationModal.classList.contains("active")
    ) {

      closeDonation();

    }

  }
);


/* =========================================================
   CLOSE MODAL BY BACKDROP
   ========================================================= */

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


/* =========================================================
   IMAGE ERROR HANDLING
   ========================================================= */

document
  .querySelectorAll("img")
  .forEach(function(img) {

    img.addEventListener(
      "error",
      function() {

        /*
         * Jangan merusak ukuran/layout gambar.
         * Cukup beri fallback background pada parent.
         */

        this.style.opacity = "0";


        if (this.parentElement) {

          this.parentElement.style.background =
            "linear-gradient(135deg,#25372f,#111916)";

        }

      }
    );

  });


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const navLinks =
  document.querySelectorAll(".desktop-nav a");

const sections =
  document.querySelectorAll("section[id]");


function updateActiveNav() {

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

}


window.addEventListener(
  "scroll",
  updateActiveNav,
  { passive: true }
);


updateActiveNav();


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
  document.querySelectorAll(
    ".testimonial-card"
  );


if (
  "IntersectionObserver" in window &&
  revealElements.length
) {

  const revealObserver =
    new IntersectionObserver(
      function(entries, observer) {

        entries.forEach(function(entry) {

          if (!entry.isIntersecting) return;


          entry.target.classList.add(
            "is-visible"
          );


          observer.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );


  revealElements.forEach(function(element) {

    revealObserver.observe(element);

  });

} else {

  revealElements.forEach(function(element) {

    element.classList.add("is-visible");

  });

}


/* =========================================================
   PAGE LOAD
   ========================================================= */

window.addEventListener(
  "load",
  function() {

    updateActiveNav();

  }
);
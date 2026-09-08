/* =========================================================
   BANTU ANAK KRAKATAU 2026
   FINAL JAVASCRIPT
   ========================================================= */


/* ================= ELEMENT ================= */

const donationModal =
  document.getElementById("donationModal");

const selectedAmount =
  document.getElementById("selectedAmount");

const modalSelectedAmount =
  document.getElementById("modalSelectedAmount");

const qrisPage =
  document.getElementById("qrisPage");

const qrisAmount =
  document.getElementById("qrisAmount");

const toast =
  document.getElementById("toast");


/* ================= STATE ================= */

let currentAmount = 10000;

let toastTimer;


/* ================= FORMAT RUPIAH ================= */

function formatRupiah(amount) {

  return "Rp" +
    Number(amount).toLocaleString("id-ID");

}


/* ================= UPDATE NOMINAL ================= */

function updateDonationAmount() {

  const formatted =
    formatRupiah(currentAmount);


  if (selectedAmount) {

    selectedAmount.textContent =
      formatted;

  }


  if (modalSelectedAmount) {

    modalSelectedAmount.textContent =
      formatted;

  }


  if (qrisAmount) {

    qrisAmount.textContent =
      formatted;

  }

}


/* ================= DONATION MODAL ================= */

function openDonation() {

  if (!donationModal) return;


  donationModal.classList.add("active");

  donationModal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";


  updateDonationAmount();

}


function closeDonation() {

  if (!donationModal) return;


  donationModal.classList.remove("active");

  donationModal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";

}


/* ================= SELECT AMOUNT ================= */

function selectAmount(button, amount) {

  currentAmount =
    Number(amount) || 10000;


  updateDonationAmount();


  const buttons =
    document.querySelectorAll(
      ".amount-grid button"
    );


  buttons.forEach(function(item) {

    item.classList.remove(
      "selected"
    );

  });


  if (button) {

    button.classList.add(
      "selected"
    );

  }

}


/* ================= QRIS PAGE ================= */

function openQRPage() {

  if (currentAmount <= 0) {

    currentAmount = 10000;

  }


  updateDonationAmount();


  if (donationModal) {

    donationModal.classList.remove(
      "active"
    );

    donationModal.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  if (qrisPage) {

    qrisPage.classList.add(
      "active"
    );

    qrisPage.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  document.body.style.overflow =
    "hidden";

}


function closeQRPage() {

  if (!qrisPage) return;


  qrisPage.classList.remove(
    "active"
  );

  qrisPage.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";

}


/* ================= TOAST ================= */

function showToast(message) {

  const toastElement =
    document.getElementById("toast");


  if (!toastElement) return;


  toastElement.textContent =
    message;


  toastElement.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(function() {

      toastElement.classList.remove(
        "show"
      );

    }, 3200);

}


/* ================= COPY LINK ================= */

function copyLink() {

  const url =
    window.location.href;


  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {

    navigator.clipboard
      .writeText(url)
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


  showToast(
    "Silakan salin alamat halaman ini."
  );

}


/* ================= WHATSAPP ================= */

function shareWhatsApp() {

  const text =
    "Mari ikut peduli terhadap Gunung Anak Krakatau dan masyarakat yang membutuhkan dukungan pada 2026 ❤️\n\n" +
    "Bantu Krakatau 2026 — Peduli Selat Sunda\n\n" +
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


/* ================= ESC KEY ================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key !== "Escape") {
      return;
    }


    if (
      qrisPage &&
      qrisPage.classList.contains(
        "active"
      )
    ) {

      closeQRPage();

      return;

    }


    if (
      donationModal &&
      donationModal.classList.contains(
        "active"
      )
    ) {

      closeDonation();

    }

  }
);


/* ================= BACKDROP ================= */

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


/* ================= IMAGE ERROR ================= */

document
  .querySelectorAll("img")
  .forEach(function(img) {

    img.addEventListener(
      "error",
      function() {

        this.style.opacity =
          "0";


        if (this.parentElement) {

          this.parentElement.style.background =
            "linear-gradient(135deg,#25372f,#111916)";

        }

      }
    );

  });


/* ================= ACTIVE NAV ================= */

const navLinks =
  document.querySelectorAll(
    ".desktop-nav a"
  );

const sections =
  document.querySelectorAll(
    "section[id]"
  );


function updateActiveNav() {

  let current = "";


  sections.forEach(function(section) {

    if (
      section.id === "qrisPage"
    ) {
      return;
    }


    const top =
      section.offsetTop - 180;


    if (
      window.scrollY >= top
    ) {

      current =
        section.getAttribute(
          "id"
        );

    }

  });


  navLinks.forEach(function(link) {

    link.style.opacity =
      ".75";


    if (
      link.getAttribute(
        "href"
      ) === "#" + current
    ) {

      link.style.opacity =
        "1";

    }

  });

}


window.addEventListener(
  "scroll",
  updateActiveNav,
  {
    passive: true
  }
);


/* ================= INITIAL STATE ================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    currentAmount =
      10000;


    updateDonationAmount();


    updateActiveNav();

  }
);
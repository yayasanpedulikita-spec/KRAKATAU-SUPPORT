(() => {
  "use strict";

  const MIN = 10000;
  let selectedAmount = 10000;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  function rupiah(n) {
    return "Rp" + Number(n).toLocaleString("id-ID");
  }

  function track(name, params = {}) {
    // Siap untuk Meta Pixel. Jika fbq sudah dipasang, event akan dikirim.
    try {
      if (typeof window.fbq === "function") window.fbq("trackCustom", name, params);
    } catch (_) {}
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event: name, ...params});
  }

  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(m) {
    const modal = typeof m === "string" ? document.getElementById(m) : m;
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".modal.open")) document.body.style.overflow = "";
  }

  function chooseAmount(amount, buttons) {
    selectedAmount = Number(amount);
    buttons.forEach(b => b.classList.toggle("active", Number(b.dataset.amount) === selectedAmount));
  }

  const allAmountButtons = $$("[data-amount]");
  allAmountButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      chooseAmount(btn.dataset.amount, allAmountButtons);
      const modalInput = $("#modalAmount");
      const mainInput = $("#customAmount");
      if (modalInput) modalInput.value = "";
      if (mainInput) mainInput.value = "";
      track("DonateAmountSelected", {amount: selectedAmount});
    });
  });

  $$("[data-open-donate]").forEach(btn => {
    btn.addEventListener("click", () => {
      openModal("donationModal");
      track("DonateInitiated");
    });
  });

  function readAmount(inputId) {
    const raw = Number($(inputId)?.value || 0);
    if (raw >= MIN) return raw;
    return selectedAmount >= MIN ? selectedAmount : 0;
  }

  function goToQRIS(amount) {
    if (amount < MIN) {
      toast("Minimal donasi Rp10.000");
      return;
    }
    selectedAmount = amount;
    $("#qrisAmount").textContent = rupiah(amount);
    closeModal("donationModal");
    openModal("qrisModal");
    track("QRISViewed", {amount});
  }

  const mainContinue = $("[data-continue]");
  if (mainContinue) mainContinue.addEventListener("click", () => goToQRIS(readAmount("#customAmount")));

  const modalContinue = $("[data-modal-continue]");
  if (modalContinue) modalContinue.addEventListener("click", () => goToQRIS(readAmount("#modalAmount")));

  $$("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
  });

  $$(".modal").forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      const open = $(".modal.open");
      if (open) closeModal(open);
    }
  });

  const paid = $("[data-paid]");
  if (paid) paid.addEventListener("click", () => {
    track("DonationCompleted", {amount: selectedAmount, method: "QRIS", recipient: "SAKU PEDULI SESAMA"});
    closeModal("qrisModal");
    openModal("thanksModal");
  });

  // PageView: siap dipasangkan dengan Meta Pixel tanpa mengunci ID pixel di source.
  track("LandingPageView");

  // Jika ada gambar eksternal yang gagal, jangan biarkan area menjadi ikon gambar rusak.
  // CSS background tetap menyisakan tampilan visual; tidak ada <img> eksternal untuk foto.
  window.addEventListener("error", e => {
    if (e.target && e.target.tagName === "IMG" && e.target.classList.contains("qris")) {
      toast("QRIS gagal dimuat. Periksa file assets/qris.jpeg.");
    }
  }, true);
})();
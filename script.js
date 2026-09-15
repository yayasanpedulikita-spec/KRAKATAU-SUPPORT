(() => {
  "use strict";
  const MIN = 10000;
  let selectedAmount = 10000;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  function rupiah(n){ return "Rp" + Number(n).toLocaleString("id-ID"); }

  function track(name, params={}){
    try{
      if(typeof window.fbq === "function") window.fbq("trackCustom", name, params);
    }catch(_){}
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:name, ...params});
  }

  function toast(message){
    const el=$("#toast"); if(!el)return;
    el.textContent=message; el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>el.classList.remove("show"),2800);
  }

  function openModal(id){
    const m=document.getElementById(id); if(!m)return;
    m.classList.add("open"); m.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
  }

  function closeModal(m){
    const modal=typeof m==="string"?document.getElementById(m):m;
    if(!modal)return;
    modal.classList.remove("open"); modal.setAttribute("aria-hidden","true");
    if(!$(".modal.open"))document.body.style.overflow="";
  }

  function chooseAmount(amount){
    selectedAmount=Number(amount);
    $$("[data-amount]").forEach(b=>{
      b.classList.toggle("active", Number(b.dataset.amount)===selectedAmount);
    });
    const modalInput=$("#modalAmount"), mainInput=$("#customAmount");
    if(modalInput)modalInput.value="";
    if(mainInput)mainInput.value="";
    track("DonateAmountSelected",{amount:selectedAmount});
  }

  $$("[data-amount]").forEach(btn=>{
    btn.addEventListener("click",()=>chooseAmount(btn.dataset.amount));
  });

  $$("[data-open-donate]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      openModal("donationModal");
      track("DonateInitiated");
    });
  });

  function readAmount(id){
    const raw=Number($(id)?.value||0);
    if(raw>=MIN)return raw;
    return selectedAmount>=MIN?selectedAmount:0;
  }

  function goToQRIS(amount){
    if(amount<MIN){toast("Minimal donasi Rp10.000");return;}
    selectedAmount=amount;
    $("#qrisAmount").textContent=rupiah(amount);
    closeModal("donationModal");
    openModal("qrisModal");
    track("QRISViewed",{amount});
  }

  $("[data-continue]")?.addEventListener("click",()=>goToQRIS(readAmount("#customAmount")));
  $("[data-modal-continue]")?.addEventListener("click",()=>goToQRIS(readAmount("#modalAmount")));

  $$("[data-close]").forEach(btn=>btn.addEventListener("click",()=>closeModal(btn.closest(".modal"))));
  $$(".modal").forEach(modal=>modal.addEventListener("click",e=>{if(e.target===modal)closeModal(modal)}));

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){
      const open=$(".modal.open");
      if(open)closeModal(open);
    }
  });

  $("[data-paid]")?.addEventListener("click",()=>{
    track("DonationCompleted",{amount:selectedAmount,method:"QRIS",recipient:"SAKU PEDULI SESAMA"});
    closeModal("qrisModal");
    openModal("thanksModal");
  });

  track("LandingPageView");

  window.addEventListener("error",e=>{
    if(e.target?.tagName==="IMG" && e.target.classList.contains("qris")){
      toast("QRIS gagal dimuat. Periksa file IMG_5690.jpeg.");
    }
  },true);
})();
/**
 * Common layout loader + mobile navigation
 * - Injects header/footer from /partials
 * - Highlights current nav link
 * - Adds mobile drawer toggle
 */

async function loadPartial(targetId, url){
  const el = document.getElementById(targetId);
  if(!el) return;
  const res = await fetch(url, { cache: "no-cache" });
  if(!res.ok){
    el.innerHTML = `<div class="container" style="padding:12px 0;color:rgba(255,255,255,.7);font-size:12px;">
      Failed to load ${url} (${res.status})
    </div>`;
    return;
  }
  el.innerHTML = await res.text();
}

function markCurrentNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll('a[data-nav]');
  links.forEach(a => {
    const href = a.getAttribute("href");
    if(!href) return;
    if(href === path){
      a.setAttribute("aria-current", "page");
    }else{
      a.removeAttribute("aria-current");
    }
  });
}

function setupMobileNav(){
  const panel = document.getElementById("mobile-panel");
  const openBtn = document.getElementById("mobile-open");
  const closeBtn = document.getElementById("mobile-close");

  if(!panel || !openBtn || !closeBtn) return;

  function open(){
    panel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    openBtn.setAttribute("aria-expanded", "true");
  }
  function close(){
    panel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    openBtn.setAttribute("aria-expanded", "false");
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  // click outside drawer closes
  panel.addEventListener("click", (e) => {
    if(e.target === panel) close();
  });

  // Esc closes
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && panel.getAttribute("aria-hidden") === "false") close();
  });

  // clicking a nav link closes
  panel.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => close());
  });
}

function setYear(){
  const y = document.getElementById("year");
  if(y) y.textContent = String(new Date().getFullYear());
}

(async function init(){
  // Load header/footer first
  await Promise.all([
    loadPartial("site-header", "partials/header.html"),
    loadPartial("site-footer", "partials/footer.html"),
  ]);

  // After injection, wire up behavior
  markCurrentNav();
  setupMobileNav();
  setYear();
})();

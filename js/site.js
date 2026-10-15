(() => {
  "use strict";

  /* Product rail arrows */
  const rail = document.querySelector(".products__rail");
  const prevBtn = document.querySelector(".rail-arrow--prev");
  const nextBtn = document.querySelector(".rail-arrow--next");

  if (rail && prevBtn && nextBtn) {
    const step = () => Math.min(rail.clientWidth * 0.75, 320);
    prevBtn.addEventListener("click", () => {
      rail.scrollBy({ left: -step(), behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      rail.scrollBy({ left: step(), behavior: "smooth" });
    });
  }

  /* Mobile nav: tap to expand dropdowns (hover doesn't work on touch) */
  const mq = window.matchMedia("(max-width: 820px)");
  const ddLinks = document.querySelectorAll(".has-dd > a");

  const bindMobileNav = () => {
    ddLinks.forEach((link) => {
      link.onclick = mq.matches
        ? (e) => {
            e.preventDefault();
            const li = link.parentElement;
            const opening = !li.classList.contains("is-open");
            document.querySelectorAll(".has-dd.is-open").forEach((el) => {
              if (el !== li) el.classList.remove("is-open");
            });
            li.classList.toggle("is-open", opening);
          }
        : null;
    });
    if (!mq.matches) {
      document.querySelectorAll(".has-dd.is-open").forEach((el) => {
        el.classList.remove("is-open");
      });
    }
  };

  bindMobileNav();
  mq.addEventListener("change", bindMobileNav);

  /* Close mobile menu on outside tap */
  document.addEventListener(
    "click",
    (e) => {
      if (!mq.matches) return;
      if (!e.target.closest(".has-dd")) {
        document.querySelectorAll(".has-dd.is-open").forEach((el) => {
          el.classList.remove("is-open");
        });
      }
    },
    { passive: true }
  );
})();

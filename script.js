const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const contactForm = document.querySelector(".contact-form");
const revealItems = document.querySelectorAll(".reveal");
const hero = document.querySelector(".hero");
const intro = document.querySelector(".brand-intro");
const lodhaPanels = document.querySelectorAll(".lodha-panel");

const syncHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 12);
};

const syncHeroProgress = () => {
  if (!hero) return;
  const progress = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
  hero.style.setProperty("--hero-progress", progress.toFixed(3));
};

const syncIntroProgress = () => {
  if (!hero || !intro) return;
  const heroHeight = hero.offsetHeight || window.innerHeight;
  const start = heroHeight * 0.42;
  const end = heroHeight * 0.98;
  const progress = Math.min(Math.max((window.scrollY - start) / (end - start), 0), 1);
  document.body.style.setProperty("--intro-progress", progress.toFixed(3));
};

syncHeader();
syncHeroProgress();
syncIntroProgress();
window.addEventListener("scroll", syncHeader, { passive: true });
window.addEventListener("scroll", syncHeroProgress, { passive: true });
window.addEventListener("scroll", syncIntroProgress, { passive: true });
window.addEventListener("resize", syncIntroProgress);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  { threshold: 0.24 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const panelObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-active", entry.isIntersecting);
    });
  },
  { threshold: 0.2, rootMargin: "-4% 0px -14% 0px" }
);

lodhaPanels.forEach((panel) => panelObserver.observe(panel));

const syncLodhaPanels = () => {
  const viewport = window.innerHeight || 1;
  lodhaPanels.forEach((panel) => {
    const rect = panel.getBoundingClientRect();
    const raw = 1 - Math.max(Math.min(rect.top / (viewport * 0.72), 1), -0.25);
    const progress = Math.max(Math.min(raw, 1), 0);
    const eased = 1 - Math.pow(1 - progress, 3);
    panel.style.setProperty("--panel-opacity", eased.toFixed(3));
    panel.style.setProperty("--panel-y", `${Math.round((1 - eased) * 72)}px`);
    panel.style.setProperty("--panel-scale", (1 + (1 - eased) * 0.08).toFixed(3));
    panel.style.setProperty("--panel-veil", `${Math.round((1 - eased) * 100)}%`);
    panel.style.setProperty("--panel-curtain", `${Math.round(eased * -100)}%`);
  });
};

syncLodhaPanels();
window.addEventListener("scroll", syncLodhaPanels, { passive: true });
window.addEventListener("resize", syncLodhaPanels);

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".faq details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq details").forEach((other) => {
      if (other !== item) other.removeAttribute("open");
    });
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");
  button.textContent = "Request Received";
  setTimeout(() => {
    button.textContent = "Contact Now";
  }, 2600);
});

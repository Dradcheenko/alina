const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector(".lightbox__img");
const lightboxCaption = lightbox.querySelector(".lightbox__caption");
const closeBtn = lightbox.querySelector(".lightbox__close");
const loader = document.getElementById("loader");
const statsOpen = document.getElementById("stats-open");
const statsModal = document.getElementById("stats-modal");
const statsClose = document.getElementById("stats-close");
const themeToggle = document.getElementById("theme-toggle");
const statsUrl = "https://tg-love.vercel.app";

document.documentElement.classList.remove("no-js");

const THEME_KEY = "alina-theme";
const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent =
      theme === "light" ? "Темная тема" : "Светлая тема";
  }
};

const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
};

const setStoredTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore storage errors on mobile/private mode
  }
};

const storedTheme = getStoredTheme();
if (storedTheme) {
  applyTheme(storedTheme);
} else {
  const media = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: light)")
    : null;
  applyTheme(media && media.matches ? "light" : "dark");
}

const openLightbox = (img, caption) => {
  lightboxImg.src = img;
  lightboxCaption.textContent = caption || "";
  lightbox.classList.add("active");
};

const closeLightbox = () => {
  lightbox.classList.remove("active");
  lightboxImg.src = "";
};

document.querySelectorAll("[data-lightbox]").forEach((figure) => {
  const image = figure.querySelector("img");
  const caption = figure.querySelector("figcaption")?.textContent || "";

  figure.addEventListener("click", () => {
    openLightbox(image.src, caption);
  });
});

closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("active")) {
    closeLightbox();
  }
});

const openStats = () => {
  const isMobile =
    (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) ||
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = statsUrl;
    return;
  }
  statsModal?.classList.add("active");
  statsModal?.setAttribute("aria-hidden", "false");
};

const closeStats = () => {
  statsModal?.classList.remove("active");
  statsModal?.setAttribute("aria-hidden", "true");
};

let lastTouch = 0;
const bindTap = (el, handler) => {
  if (!el) return;
  el.addEventListener("touchend", (event) => {
    lastTouch = Date.now();
    event.preventDefault();
    handler();
  });
  el.addEventListener("click", () => {
    if (Date.now() - lastTouch < 600) return;
    handler();
  });
};

bindTap(statsOpen, openStats);
bindTap(statsClose, closeStats);

statsModal?.addEventListener("click", (event) => {
  if (event.target === statsModal) {
    closeStats();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && statsModal?.classList.contains("active")) {
    closeStats();
  }
});

bindTap(themeToggle, () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  setStoredTheme(next);
  applyTheme(next);
});

const revealItems = document.querySelectorAll(".reveal");

revealItems.forEach((el, index) => {
  el.style.setProperty("--stagger", `${index * 70}ms`);
});

const applyRevealAnimation = () => {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    revealItems.forEach((el) => observer.observe(el));
  } else {
    // Fallback: сразу включаем анимацию
    revealItems.forEach((el) => el.classList.add("in-view"));
  }
};

window.addEventListener("load", () => {
  setTimeout(() => {
    loader?.classList.add("hide");
    setTimeout(() => loader?.remove(), 700);
  }, 2500);

  // Стартуем появление блоков при прокрутке
  applyRevealAnimation();
});

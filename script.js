const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector(".lightbox__img");
const lightboxCaption = lightbox.querySelector(".lightbox__caption");
const closeBtn = lightbox.querySelector(".lightbox__close");
const loader = document.getElementById("loader");

document.documentElement.classList.remove("no-js");

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

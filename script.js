const navLinks = document.querySelectorAll("header nav a");
const sections = document.querySelectorAll("section");
const resumeBtns = document.querySelectorAll(".resume-btn");
const menuIcon = document.querySelector("#menu-icon");
const navBar = document.querySelector("header nav");

if (menuIcon && navBar) {
  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("bx-x");
    navBar.classList.toggle("active");
  });
}

let sectionTimeout = null;
let headerTimeout = null;
let barsTimeout = null;

const pauseAllReviewVideos = () => {
  document.querySelectorAll(".reviews video").forEach((vid) => {
    vid.pause();
  });
};

const activePage = () => {
  const header = document.querySelector("header");
  const barsBox = document.querySelector(".bars-box");

  if (sectionTimeout) clearTimeout(sectionTimeout);
  if (headerTimeout) clearTimeout(headerTimeout);
  if (barsTimeout) clearTimeout(barsTimeout);

  pauseAllReviewVideos();

  if (header) header.classList.remove("active");
  if (menuIcon) menuIcon.classList.remove("bx-x");
  if (navBar) navBar.classList.remove("active");

  headerTimeout = setTimeout(() => {
    if (header) header.classList.add("active");
  }, 1100);

  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  if (barsBox) {
    barsBox.classList.remove("active");
    barsTimeout = setTimeout(() => {
      barsBox.classList.add("active");
    }, 1100);
  }

  sections.forEach((section) => {
    section.classList.remove("active");
  });
};

const getSectionIndexFromHash = (hash) => {
  if (!hash || hash === "#") return 0;
  const cleanHash = hash.toLowerCase();
  for (let i = 0; i < navLinks.length; i++) {
    if (navLinks[i].getAttribute("href")?.toLowerCase() === cleanHash) {
      return i;
    }
  }
  return 0;
};

const navigateToSection = (idx, updateHistory = true, immediate = false) => {
  if (idx < 0 || idx >= sections.length || !navLinks[idx]) return;

  const targetHash = navLinks[idx].getAttribute("href") || "#home";
  if (updateHistory && window.location.hash !== targetHash) {
    history.pushState(null, "", targetHash);
  }

  if (immediate) {
    navLinks.forEach((link) => link.classList.remove("active"));
    sections.forEach((section) => section.classList.remove("active"));
    navLinks[idx].classList.add("active");
    sections[idx].classList.add("active");
    if (
      sections[idx].classList.contains("reviews") &&
      typeof updateReviewSlider === "function"
    ) {
      updateReviewSlider();
    }
    return;
  }

  if (!navLinks[idx].classList.contains("active")) {
    activePage();
    navLinks[idx].classList.add("active");
    sectionTimeout = setTimeout(() => {
      if (sections[idx]) {
        sections[idx].classList.add("active");
        if (
          sections[idx].classList.contains("reviews") &&
          typeof updateReviewSlider === "function"
        ) {
          updateReviewSlider();
        }
      }
    }, 1100);
  }
};

navLinks.forEach((link, idx) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navigateToSection(idx, true, false);
  });
});

const logo = document.querySelector("header .logo");
if (logo && navLinks.length > 0) {
  logo.addEventListener("click", (e) => {
    e.preventDefault();
    navigateToSection(0, true, false);
  });
}

// Sync section with URL hash on initial load and browser back/forward
window.addEventListener("DOMContentLoaded", () => {
  const initialHash = window.location.hash;
  if (initialHash && initialHash !== "#") {
    const idx = getSectionIndexFromHash(initialHash);
    navigateToSection(idx, false, true);
  } else if (
    navLinks.length > 0 &&
    (window.location.pathname.endsWith("index.html") ||
      window.location.pathname === "/")
  ) {
    history.replaceState(null, "", "#home");
  }
});

const syncSectionFromUrl = () => {
  const idx = getSectionIndexFromHash(window.location.hash);
  navigateToSection(idx, false, false);
};

window.addEventListener("hashchange", syncSectionFromUrl);
window.addEventListener("popstate", syncSectionFromUrl);

resumeBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const resumeSections = document.querySelectorAll(".resume-details");
    resumeBtns.forEach((btn) => {
      btn.classList.remove("active");
    });
    btn.classList.add("active");

    resumeSections.forEach((section) => {
      section.classList.remove("active");
    });
    resumeSections[idx].classList.add("active");
  });
});

const arrowright = document.querySelector(
  ".portofolio-box .navigation .arrow-right"
);
const arrowleft = document.querySelector(
  ".portofolio-box .navigation .arrow-left"
);

let index = 0;

const activePortfolio = () => {
  const imgSlide = document.querySelector(".img-slide");
  const portfolioDetails = document.querySelectorAll(".portofolio-details");
  const slides = document.querySelectorAll(".portofolio-carousel .img-item");

  imgSlide.style.transform = `translateX(calc(${index * -100}% - ${
    index * 2
  }rem))`;

  portfolioDetails.forEach((detail) => {
    detail.classList.remove("active");
  });
  if (portfolioDetails[index]) {
    portfolioDetails[index].classList.add("active");
  }

  // Update arrow disabled classes cleanly
  if (index === 0) {
    arrowleft.classList.add("disabled");
  } else {
    arrowleft.classList.remove("disabled");
  }

  if (index === slides.length - 1) {
    arrowright.classList.add("disabled");
  } else {
    arrowright.classList.remove("disabled");
  }
};

if (arrowright) {
  arrowright.addEventListener("click", () => {
    const slides = document.querySelectorAll(".portofolio-carousel .img-item");
    if (index < slides.length - 1) {
      index++;
      activePortfolio();
    }
  });
}

if (arrowleft) {
  arrowleft.addEventListener("click", () => {
    if (index > 0) {
      index--;
      activePortfolio();
    }
  });
}

// Reviews Slider Logic (Simple & Direct)
let reviewIndex = 0;
const reviewTrack = document.querySelector(".reviews-slide-track");
const reviewSlides = document.querySelectorAll(".review-slide-item");
const reviewArrowLeft = document.querySelector(".reviews-arrow-left");
const reviewArrowRight = document.querySelector(".reviews-arrow-right");
const currentSlideEl = document.getElementById("current-slide");
const totalSlidesEl = document.getElementById("total-slides");

if (totalSlidesEl && reviewSlides.length > 0) {
  totalSlidesEl.textContent = reviewSlides.length;
}

const updateReviewSlider = () => {
  if (!reviewTrack || reviewSlides.length === 0) return;

  // Pause all videos first
  reviewSlides.forEach((slide) => {
    const vid = slide.querySelector("video");
    if (vid) {
      vid.pause();
    }
  });

  reviewTrack.style.transform = `translateX(${reviewIndex * -100}%)`;

  // Only autoplay video if reviews section is actually visible (or on standalone reviews.html)
  const reviewsSection = document.querySelector("section.reviews");
  const isReviewsVisible =
    !reviewsSection || reviewsSection.classList.contains("active");

  if (isReviewsVisible) {
    const currentVideo = reviewSlides[reviewIndex].querySelector("video");
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.muted = false;
      currentVideo.volume = 1;
      const playPromise = currentVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback for strict browser autoplay restriction before any user interaction
          currentVideo.muted = true;
          currentVideo.play().catch(() => {});
        });
      }
    }
  }

  if (currentSlideEl) {
    currentSlideEl.textContent = reviewIndex + 1;
  }

  if (reviewArrowLeft) {
    if (reviewIndex === 0) {
      reviewArrowLeft.classList.add("disabled");
    } else {
      reviewArrowLeft.classList.remove("disabled");
    }
  }

  if (reviewArrowRight) {
    if (reviewIndex === reviewSlides.length - 1) {
      reviewArrowRight.classList.add("disabled");
    } else {
      reviewArrowRight.classList.remove("disabled");
    }
  }
};

if (reviewArrowRight) {
  reviewArrowRight.addEventListener("click", () => {
    if (reviewIndex < reviewSlides.length - 1) {
      reviewIndex++;
      updateReviewSlider();
    }
  });
}

if (reviewArrowLeft) {
  reviewArrowLeft.addEventListener("click", () => {
    if (reviewIndex > 0) {
      reviewIndex--;
      updateReviewSlider();
    }
  });
}

// Mobile Touch Swipe for Reviews Carousel
const reviewCarouselEl = document.querySelector(".reviews-carousel");
if (reviewCarouselEl) {
  let touchStartX = 0;
  let touchEndX = 0;

  reviewCarouselEl.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  reviewCarouselEl.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0 && reviewIndex < reviewSlides.length - 1) {
          // Swipe Left -> Next
          reviewIndex++;
          updateReviewSlider();
        } else if (diff < 0 && reviewIndex > 0) {
          // Swipe Right -> Prev
          reviewIndex--;
          updateReviewSlider();
        }
      }
    },
    { passive: true }
  );
}

// Ensure audio is unmuted on user interaction only when reviews section is visible
document.addEventListener("click", () => {
  const reviewsSection = document.querySelector("section.reviews");
  const isReviewsVisible =
    !reviewsSection || reviewsSection.classList.contains("active");
  if (!isReviewsVisible) return;

  const activeVideo = reviewSlides[reviewIndex]?.querySelector("video");
  if (activeVideo && activeVideo.muted && !activeVideo.paused) {
    activeVideo.muted = false;
  }
});

// Image Zoom Lightbox Logic
const imageLightbox = document.getElementById("image-lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const reviewImgs = document.querySelectorAll(".review-slide-item .media-wrapper img");

if (imageLightbox && lightboxImg) {
  reviewImgs.forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "Review Proof";
      imageLightbox.classList.add("active");
      imageLightbox.setAttribute("aria-hidden", "false");
    });
  });

  const closeLightbox = () => {
    imageLightbox.classList.remove("active");
    imageLightbox.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      if (!imageLightbox.classList.contains("active")) {
        lightboxImg.src = "";
      }
    }, 300);
  };

  if (lightboxClose) {
    lightboxClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Click on the backdrop (outside the image) to close
  imageLightbox.addEventListener("click", (e) => {
    if (e.target !== lightboxImg) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && imageLightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

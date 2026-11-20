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

const activePage = () => {
  const header = document.querySelector("header");
  const barsBox = document.querySelector(".bars-box");
  header.classList.remove("active");

  menuIcon.classList.remove("bx-x");
  navBar.classList.remove("active");

  setTimeout(() => {
    header.classList.add("active");
  }, 1100);
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  barsBox.classList.remove("active");

  setTimeout(() => {
    barsBox.classList.add("active");
  }, 1100);

  sections.forEach((section) => {
    section.classList.remove("active");
  });
};

navLinks.forEach((link, idx) => {
  link.addEventListener("click", () => {
    if (!link.classList.contains("active")) {
      activePage();
      link.classList.add("active");
      setTimeout(() => {
        if (sections[idx]) {
          sections[idx].classList.add("active");
          if (sections[idx].classList.contains("reviews") && typeof updateReviewSlider === "function") {
            updateReviewSlider();
          }
        }
      }, 1100);
    }
  });
});

const logo = document.querySelector("header .logo");
if (logo && navLinks.length > 0) {
  logo.addEventListener("click", () => {
    if (!navLinks[0].classList.contains("active")) {
      activePage();
      navLinks[0].classList.add("active");

      setTimeout(() => {
        if (sections[0]) sections[0].classList.add("active");
      }, 1100);
    }
  });
}

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

  // Autoplay video with sound if current slide has one
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

// Ensure audio is unmuted on user interaction
document.addEventListener("click", () => {
  const activeVideo = reviewSlides[reviewIndex]?.querySelector("video");
  if (activeVideo && activeVideo.muted) {
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

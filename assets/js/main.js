document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
  const sections = document.querySelectorAll("section[id]");
  const yearTarget = document.getElementById("currentYear");

  const setNavbarState = () => {
    if (!navbar) return;
    if (window.scrollY > 64) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  };

  setNavbarState();
  window.addEventListener("scroll", setNavbarState, { passive: true });

  // Smooth scrolling for internal links
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth" });

      // Collapse navbar on small screens after selection
      const navbarCollapse = document.getElementById("navbarNav");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
        bsCollapse.hide();
      }
    });
  });

  // Highlight active navigation link based on scroll position
  const observerOptions = {
    root: null,
    threshold: 0.35,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove("active"));
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  // Intersection animations
  const animatedElements = document.querySelectorAll("[data-anim]");
  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          animationObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  animatedElements.forEach((element) => {
    animationObserver.observe(element);
  });

  // Form validation (Bootstrap)
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });

  // Dynamic year in footer
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }
});

// Improve keyboard navigation for carousel controls
const testimonialCarousel = document.getElementById("testimonialCarousel");
if (testimonialCarousel) {
  testimonialCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      bootstrap.Carousel.getOrCreateInstance(testimonialCarousel).prev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      bootstrap.Carousel.getOrCreateInstance(testimonialCarousel).next();
    }
  });
}

/* --------------------------------------------------
  Media Sphere Solutions – Clean JS Implementation
  Updated: 2025-06-03 by swhelan123
  -------------------------------------------------- */

(function () {
  "use strict";

  // Helper functions
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Global variables
  let vantaEffect = null;

  // Wait for everything to load
  document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Initializing Media Sphere Solutions...");

    // Initialize Vanta Globe with fade-in
    initVantaGlobe();

    // Initialize navigation
    initNavigation();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize process animations
    initProcessAnimations();

    // Initialize form handling
    initFormHandling();

    // Set copyright year
    setCopyrightYear();

    console.log("✅ Media Sphere Solutions initialized successfully!");
  });

  // Vanta Globe Initialization with smooth fade-in
  function initVantaGlobe() {
    console.log("🌍 Initializing Vanta Globe...");

    // Check if libraries are loaded
    if (typeof THREE === "undefined") {
      console.error("❌ THREE.js not loaded");
      return;
    }

    if (typeof VANTA === "undefined" || !VANTA.GLOBE) {
      console.error("❌ Vanta.js Globe not loaded");
      return;
    }

    const vantaElement = $("#vanta-background");
    if (!vantaElement) {
      console.error("❌ #vanta-background element not found");
      return;
    }

    // Set initial opacity to 0 for fade-in effect
    vantaElement.style.opacity = "0";
    vantaElement.style.transition = "opacity 2s ease-in-out";

    try {
      // Clean up any existing effect
      if (vantaEffect) {
        vantaEffect.destroy();
      }

      // Create the Vanta effect
      vantaEffect = VANTA.GLOBE({
        el: vantaElement,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xd4af37,
        color2: 0xb8860b,
        size: 1.0,
        backgroundColor: 0x121212,
      });

      console.log("✅ Vanta Globe initialized successfully!", vantaEffect);

      // Fade in the globe after a short delay
      setTimeout(function () {
        vantaElement.style.opacity = "1";
        console.log("🌍 Vanta Globe faded in smoothly");
      }, 500); // Start fade-in after 500ms

      // Handle window resize
      window.addEventListener("resize", function () {
        if (vantaEffect && vantaEffect.resize) {
          vantaEffect.resize();
        }
      });
    } catch (error) {
      console.error("❌ Error initializing Vanta Globe:", error);
      // If Vanta fails, at least fade in a fallback background
      vantaElement.style.background = "linear-gradient(135deg, #1a1a1a 0%, #121212 100%)";
      setTimeout(function () {
        vantaElement.style.opacity = "1";
      }, 500);
    }
  }

  // Navigation functionality
  function initNavigation() {
    const header = $("header");
    const hamburger = $(".hamburger");
    const navLinks = $(".nav-links");
    const navAnchors = $$(".nav-links a");

    if (!header || !hamburger || !navLinks) return;

    // Scroll header effect
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 50);
      updateActiveNavLink();
    });

    // Mobile menu toggle
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    // Close mobile menu when link clicked
    navAnchors.forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });
  }

  // Update active navigation link based on scroll position
  function updateActiveNavLink() {
    const sections = $$("section[id]");
    const navAnchors = $$(".nav-links a");
    const header = $("header");
    const scrollPos = window.scrollY + (header ? header.offsetHeight : 0) + 10;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");
      const link = $(`.nav-links a[href="#${id}"]`);

      if (scrollPos >= top && scrollPos < bottom) {
        navAnchors.forEach(function (a) {
          a.classList.remove("active");
        });
        if (link) {
          link.classList.add("active");
        }
      }
    });
  }

  // Smooth scrolling for anchor links
  function initSmoothScroll() {
    const anchorLinks = $$('a[href^="#"]');
    const header = $("header");

    anchorLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = $(link.getAttribute("href"));
        if (!target) return;

        const offset = header ? header.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPos,
          behavior: "smooth",
        });
      });
    });
  }

  // Process item animations
  function initProcessAnimations() {
    const processItems = $$(".process-item");

    function revealItems() {
      processItems.forEach(function (item) {
        if (item.dataset.revealed) return;

        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          item.dataset.revealed = "true";
          item.classList.add("visible");
        }
      });
    }

    window.addEventListener("scroll", revealItems);
    revealItems(); // Check initial state
  }

  // Form handling
  function initFormHandling() {
    const form = $("#contact-form");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("📧 Form submitted");

      const button = form.querySelector(".cta-btn") || form.querySelector("button[type='submit']");
      if (button) button.disabled = true;

      try {
        // Add your form submission logic here
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        form.reset();
        alert("Thanks! We'll be in touch within 24 hours.");
      } catch (error) {
        console.error("Form submission error:", error);
        alert("Sorry, something went wrong. Please try again or email us directly.");
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  // Set copyright year
  function setCopyrightYear() {
    const copyrightElement = $("footer .copyright p");
    if (copyrightElement) {
      const year = new Date().getFullYear();
      copyrightElement.innerHTML = `&copy; ${year} Media Sphere Solutions. All rights reserved.`;
    }
  }

  // Cleanup on page unload
  window.addEventListener("beforeunload", function () {
    if (vantaEffect) {
      vantaEffect.destroy();
      vantaEffect = null;
    }
  });
})();

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
  /* Process item animations */
  .process-item {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
  }

  .process-item.visible {
    opacity: 1;
    transform: none;
  }

  /* Vanta background fade-in setup */
  #vanta-background {
    opacity: 0;
    transition: opacity 2s ease-in-out;
  }

  /* Ensure hero content animations work well with Vanta fade-in */
  .hero-content h1 {
    animation: fadeInUp 1s ease-out 0.8s both;
  }

  .hero-content p {
    animation: fadeInUp 1s ease-out 1.1s both;
  }

  .hero-content .cta-btn {
    animation: fadeInUp 1s ease-out 1.4s both;
  }

  /* Fade in animation for hero content */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

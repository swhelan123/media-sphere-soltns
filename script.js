/* --------------------------------------------------
  Media Sphere Solutions – Enhanced Professional JS
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

    // Initialize all components
    initVantaGlobe();
    initNavigation();
    initSmoothScroll();
    initAOS();
    initFormHandling();
    initScrollEffects();
    initAnimationTriggers();
    initCustomScrollbar();
    setCopyrightYear();

    console.log("✅ Media Sphere Solutions initialized successfully!");
    console.log("🤓 Hello nerds!");
  });

  // Vanta Globe Initialization (keeping your working version)
  function initVantaGlobe() {
    console.log("🌍 Initializing Vanta Globe...");

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
      if (vantaEffect) {
        vantaEffect.destroy();
      }

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
        backgroundColor: 0x0f0f0f,
      });

      console.log("✅ Vanta Globe initialized successfully!");

      // Fade in the globe after a short delay
      setTimeout(function () {
        vantaElement.style.opacity = "1";
        console.log("🌍 Vanta Globe faded in smoothly");
      }, 500);

      // Handle window resize
      window.addEventListener("resize", function () {
        if (vantaEffect && vantaEffect.resize) {
          vantaEffect.resize();
        }
      });
    } catch (error) {
      console.error("❌ Error initializing Vanta Globe:", error);
      vantaElement.style.background = "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)";
      setTimeout(function () {
        vantaElement.style.opacity = "1";
      }, 500);
    }
  }

  // Enhanced Navigation with slide-in animation
  function initNavigation() {
    const navbar = $("#navbar");
    const navToggle = $("#nav-toggle");
    const navMenu = $("#nav-menu");
    const navLinks = $$(".nav-link");
    const navContainer = $(".nav-container");
    const scrollThreshold = 10; // Set how many pixels of scrolling are needed to show the navbar

    if (!navbar || !navToggle || !navMenu) return;

    // Hide navbar initially
    navbar.classList.add("navbar-hidden");

    // Add padding and slide-in animations
    setTimeout(() => {
      navbar.classList.add("nav-loaded");
    }, 100);

    // Scroll effect for navbar
    window.addEventListener("scroll", function () {
      // Show navbar as soon as user starts scrolling beyond threshold
      if (window.scrollY > scrollThreshold) {
        navbar.classList.remove("navbar-hidden");
      } else {
        navbar.classList.add("navbar-hidden");
      }
      
      if (window.scrollY > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }

      updateActiveNavLink();
      updateCustomScrollbar();
    });

    // Mobile menu toggle
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    // Close mobile menu when link clicked
    navLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  }

  // Update active navigation link
  function updateActiveNavLink() {
    const sections = $$("section[id]");
    const navLinks = $$(".nav-link[data-section]");
    const scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove("active");
        });

        const activeLink = $(`.nav-link[data-section="${id}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }

  // Custom scroll progress bar
  function initCustomScrollbar() {
    // Create scroll progress bar
    const scrollProgress = document.createElement("div");
    scrollProgress.className = "scroll-progress";
    scrollProgress.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(scrollProgress);

    // Create section indicators
    const sections = $$("section[id]");
    const scrollIndicators = document.createElement("div");
    scrollIndicators.className = "scroll-indicators";

    sections.forEach((section, index) => {
      const indicator = document.createElement("div");
      indicator.className = "scroll-indicator-dot";
      indicator.dataset.section = section.id;
      indicator.title = section.querySelector("h2")?.textContent || section.id;

      indicator.addEventListener("click", () => {
        section.scrollIntoView({ behavior: "smooth" });
      });

      scrollIndicators.appendChild(indicator);
    });

    document.body.appendChild(scrollIndicators);
  }

  // Update custom scrollbar
  function updateCustomScrollbar() {
    const scrollProgress = $(".scroll-progress-bar");
    const indicators = $$(".scroll-indicator-dot");

    if (scrollProgress) {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      scrollProgress.style.height = Math.min(scrollPercent, 100) + "%";
    }

    // Update section indicators
    const sections = $$("section[id]");
    const scrollPos = window.scrollY + window.innerHeight / 2;

    sections.forEach((section, index) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const indicator = indicators[index];

      if (indicator) {
        if (scrollPos >= top && scrollPos < bottom) {
          indicator.classList.add("active");
        } else {
          indicator.classList.remove("active");
        }
      }
    });
  }

  // Smooth scrolling for anchor links
  function initSmoothScroll() {
    const anchorLinks = $$('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const target = $(targetId);

        if (!target) return;

        const navbar = $("#navbar");
        const offset = navbar ? navbar.offsetHeight + 20 : 20;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPos,
          behavior: "smooth",
        });
      });
    });
  }

  // Initialize AOS (Animate On Scroll)
  function initAOS() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: "ease-out-cubic",
      });
    }
  }

  // Enhanced form handling with Formspree
  function initFormHandling() {
    const form = $("#contact-form");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("📧 Form submitted to Formspree");

      const submitBtn = form.querySelector("button[type='submit']");
      const originalText = submitBtn.textContent;

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      submitBtn.classList.add("loading");

      try {
        // Submit to Formspree
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          // Success state
          submitBtn.textContent = "Message Sent!";
          submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";

          // Reset form
          form.reset();

          // Show success message
          showNotification("Thank you! We'll be in touch within 24 hours.", "success");

          // Reset button after delay
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.background = "";
            submitBtn.classList.remove("loading");
          }, 3000);
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        console.error("Form submission error:", error);

        // Error state
        submitBtn.textContent = "Error - Try Again";
        submitBtn.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";

        showNotification("Sorry, something went wrong. Please try again or email us directly.", "error");

        // Reset button after delay
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
          submitBtn.classList.remove("loading");
        }, 3000);
      }
    });
  }

  // Scroll effects and animations
  function initScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener("scroll", function () {
      const scrolled = window.pageYOffset;
      const hero = $(".hero");

      if (hero && scrolled < window.innerHeight) {
        const speed = 0.3;
        hero.style.transform = `translateY(${scrolled * speed}px)`;
      }

      updateCustomScrollbar();
    });

    // Counter animation for values
    function animateCounters() {
      const counters = $$(".value-title");

      counters.forEach(function (counter) {
        if (counter.dataset.animated) return;

        const rect = counter.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          counter.dataset.animated = "true";
          counter.style.transform = "scale(1.05)";
          setTimeout(() => {
            counter.style.transform = "scale(1)";
          }, 200);
        }
      });
    }

    window.addEventListener("scroll", animateCounters);
    animateCounters(); // Check initial state
  }

  // Animation triggers for elements
  function initAnimationTriggers() {
    // Intersection Observer for custom animations
    if ("IntersectionObserver" in window) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      };

      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observe elements that need custom animations
      const animatedElements = $$(".service-card, .approach-card, .team-member, .timeline-item");
      animatedElements.forEach(function (el) {
        observer.observe(el);
      });
    }
  }

  // Notification system
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existing = $(".notification");
    if (existing) {
      existing.remove();
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 10000;
      background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#6366f1"};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
  }

  // Set copyright year
  function setCopyrightYear() {
    const copyrightElement = $(".footer-bottom p");
    if (copyrightElement) {
      const year = new Date().getFullYear();
      copyrightElement.innerHTML = `&copy; ${year} Media Sphere Solutions. All rights reserved.`;
    }
  }

  // Performance optimization: Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimize scroll events
  const optimizedScrollHandler = debounce(function () {
    updateActiveNavLink();
    updateCustomScrollbar();
  }, 10);

  window.addEventListener("scroll", optimizedScrollHandler);

  // Cleanup on page unload
  window.addEventListener("beforeunload", function () {
    if (vantaEffect) {
      console.log("🧹 Cleaning up Vanta effect...");
      vantaEffect.destroy();
      vantaEffect = null;
    }
  });

  // Add resize handler for responsive adjustments
  window.addEventListener(
    "resize",
    debounce(function () {
      if (vantaEffect && vantaEffect.resize) {
        vantaEffect.resize();
      }
      updateCustomScrollbar();
    }, 250),
  );

  // Expose useful functions to global scope for debugging
  window.MediaSphere = {
    vantaEffect: () => vantaEffect,
    showNotification: showNotification,
    version: "2.0.0",
  };
})();

// Additional CSS for animations, notifications, and custom scrollbar
const additionalStyles = document.createElement("style");
additionalStyles.textContent = `
  /* Navigation slide-in animations and padding */
  .navbar {
    padding: 0 2rem; /* Add padding to header */
  }

  .nav-container {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .navbar:not(.nav-loaded) .nav-brand {
    transform: translateX(-100px);
    opacity: 0;
  }

  .navbar:not(.nav-loaded) .nav-menu {
    transform: translateX(100px);
    opacity: 0;
  }

  .navbar.nav-loaded .nav-brand,
  .navbar.nav-loaded .nav-menu {
    transform: translateX(0);
    opacity: 1;
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .navbar.nav-loaded .nav-brand {
    transition-delay: 0.2s;
  }

  .navbar.nav-loaded .nav-menu {
    transition-delay: 0.4s;
  }

  /* Custom Scroll Progress Bar */
  .scroll-progress {
    position: fixed;
    top: 0;
    right: 8px;
    width: 4px;
    height: 100vh;
    background: rgba(255, 255, 255, 0.1);
    z-index: 999;
    border-radius: 2px;
  }

  .scroll-progress-bar {
    width: 100%;
    height: 0%;
    background: linear-gradient(to bottom, var(--primary), var(--primary-light));
    border-radius: 2px;
    transition: height 0.1s ease-out;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  }

  /* Section Scroll Indicators */
  .scroll-indicators {
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 998;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .scroll-indicator-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .scroll-indicator-dot:hover {
    background: rgba(212, 175, 55, 0.7);
    transform: scale(1.2);
  }

  .scroll-indicator-dot.active {
    background: var(--primary);
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
    transform: scale(1.3);
  }

  .scroll-indicator-dot::before {
    content: attr(title);
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem 0.8rem;
    border-radius: 6px;
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .scroll-indicator-dot:hover::before {
    opacity: 1;
  }

  /* Animation classes */
  .animate-in {
    animation: slideInUp 0.8s ease-out forwards;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Notification styles */
  .notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .notification-close {
    background: none;
    border: none;
    color: currentColor;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }

  .notification-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  /* Enhanced button hover effects */
  .btn {
    position: relative;
    overflow: hidden;
  }

  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  .btn:hover::before {
    left: 100%;
  }

  /* Mobile menu enhancements */
  .nav-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .nav-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .nav-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }

  /* Scroll indicator enhancement */
  .scroll-indicator {
    animation: fadeInUp 2s ease-out 1s both;
  }

  /* Loading states */
  .loading {
    pointer-events: none;
    opacity: 0.7;
  }

  .loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Value animations */
  .value-title {
    transition: all 0.3s ease;
  }

  /* Responsive adjustments for custom scrollbar */
  @media (max-width: 768px) {
    .scroll-indicators {
      right: 12px;
      gap: 0.8rem;
    }

    .scroll-indicator-dot {
      width: 10px;
      height: 10px;
    }

    .scroll-indicator-dot::before {
      display: none;
    }

    .scroll-progress {
      right: 4px;
      width: 3px;
    }

    .navbar {
      padding: 0 1rem;
    }
  }

  @media (max-width: 480px) {
    .scroll-indicators {
      display: none;
    }

    .scroll-progress {
      right: 2px;
      width: 2px;
    }

    .navbar {
      padding: 0 0.5rem;
    }
  }
`;

document.head.appendChild(additionalStyles);

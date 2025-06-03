/* --------------------------------------------------
  Media Sphere Solutions – global JS
  Completed by ChatGPT (17 Apr 2025)
  -------------------------------------------------- */

// Wrap everything so we don't pollute the global scope
(() => {
  "use strict";

  // ————————————————————————————————————————
  // Helper: element selectors
  // ————————————————————————————————————————
  const $ = (s, o = document) => o.querySelector(s);
  const $$ = (s, o = document) => [...o.querySelectorAll(s)];

  // Wait for DOM
  document.addEventListener("DOMContentLoaded", () => {
    /* --------------------------------------------------
           1.  Navigation / header behaviour
           -------------------------------------------------- */
    const header = $("header");
    const hamburger = $(".hamburger");
    const navLinks = $(".nav-links");
    const navAnchors = $$(".nav-links a");
    const sections = $$("section[id]");

    // Shadow‑on‑scroll + active‑link highlighting
    const onScroll = () => {
      // header shadow
      header.classList.toggle("scrolled", window.scrollY > 50);

      // highlight nav link
      const scrollPos = window.scrollY + header.offsetHeight + 10;
      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        const id = sec.getAttribute("id");
        const link = $(`.nav-links a[href="#${id}"]`);
        if (scrollPos >= top && scrollPos < bottom) {
          navAnchors.forEach((a) => a.classList.remove("active"));
          link?.classList.add("active");
        }
      });

      // trigger reveal animations
      revealProcessItems();
    };
    window.addEventListener("scroll", onScroll);

    // Hamburger toggle
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    // Close mobile nav when a link is clicked
    navAnchors.forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      }),
    );

    /* --------------------------------------------------
           2. Smooth‑scroll for internal anchor links
           -------------------------------------------------- */
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = $(anchor.getAttribute("href"));
        if (!target) return;

        const offset = header.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      });
    });

    /* --------------------------------------------------
           3. Reveal animations for .process-item
           -------------------------------------------------- */
    const processItems = $$(".process-item");
    // Add basic opacity transform class via CSS once visible
    function revealProcessItems() {
      processItems.forEach((item) => {
        if (item.dataset.revealed) return; // already revealed
        const { top } = item.getBoundingClientRect();
        if (top < window.innerHeight * 0.85) {
          item.dataset.revealed = "true";
          item.classList.add("visible");
        }
      });
    }
    // Call once in case some items are already in view
    revealProcessItems();

    /* --------------------------------------------------
           4. Initialize Vanta.js Globe Background
           -------------------------------------------------- */
    let vantaEffect = null;

    function initVanta() {
      if (typeof VANTA !== "undefined" && VANTA.GLOBE) {
        const vantaElement = $("#vanta-background");
        if (vantaElement && !vantaEffect) {
          vantaEffect = VANTA.GLOBE({
            el: vantaElement,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xd4af37, // Gold color to match your theme
            color2: 0xb8860b, // Darker gold
            size: 0.8,
            backgroundColor: 0x121212, // Dark background
            spacing: 15.0,
            points: 10.0,
          });
        }
      } else {
        // Retry after a short delay if VANTA is not loaded yet
        setTimeout(initVanta, 100);
      }
    }

    // Initialize Vanta after a brief delay to ensure libraries are loaded
    setTimeout(initVanta, 100);

    // Clean up Vanta effect when page is unloaded
    window.addEventListener("beforeunload", () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    });

    /* --------------------------------------------------
           5. Contact‑form handling (static‑site friendly)
           -------------------------------------------------- */
    const form = $("#contact-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = $("button[type=submit]", form) || form.querySelector(".cta-btn");
        if (btn) btn.disabled = true;

        const data = Object.fromEntries(new FormData(form).entries());

        try {
          // 👉 replace URL with your endpoint / Formspree ID etc
          const res = await fetch("https://formspree.io/f/yourFormID", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (res.ok) {
            form.reset();
            alert("Thanks – we\'ll be in touch within 24 hrs!");
          } else {
            throw new Error("Network response was not ok");
          }
        } catch (err) {
          console.error(err);
          alert("Sorry, something went wrong. Please try again later or email us directly.");
        } finally {
          if (btn) btn.disabled = false;
        }
      });
    }

    /* --------------------------------------------------
           6. Dynamic copyright year
           -------------------------------------------------- */
    const yearSpan = $("footer .copyright p");
    if (yearSpan) {
      const year = new Date().getFullYear();
      yearSpan.innerHTML = `&copy; ${year} Media Sphere Solutions. All rights reserved.`;
    }
  });
})();

/* --------------------------------------------------
   Minimal styles injected for .visible (only if not
   using AOS for performance reasons on mobile)
   -------------------------------------------------- */
const style = document.createElement("style");
style.textContent = `.process-item{opacity:0;transform:translateY(30px);transition:all .6s ease-out}.process-item.visible{opacity:1;transform:none}`;
document.head.appendChild(style);

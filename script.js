/* =====================================================================
   90 Barber Shop – script.js
   Handles: mobile menu, team data + rendering, team carousel,
   contact form validation, footer year.
   ===================================================================== */
(() => {
  "use strict";

  /* ---------- SETTINGS: edit these ---------- */
  const CONFIG = {
    // Paste a form-handling URL here (Formspree, Netlify, your own API).
    // Leave empty to open the visitor's email app instead.
    formEndpoint: "",
    fallbackEmail: "hello@yourbarbershop.com",

    // PASTE YOUR BOOKING LINK HERE. Every "Book Now" / "Book now" / "Book a chair"
    // button on all four pages uses it (e.g. "https://booksy.com/your-shop").
    // Full https:// links open in a new tab. Until you add one, the buttons do nothing.
    bookingUrl: "https://www.fresha.com/a/barbershop90-willemstad-churchill-plaza-winston-churchillweg-112-mabsjhud/all-offer?menu=true",
  };

  // One place to edit the team. Used on the home page carousel and the Team page.
  // photo: path to an image (e.g. "images/marcus.jpg"). Leave "" to show initials.
  // Set a social link to "" to hide that icon.
  const TEAM = [
    { name: "Marcus Bell",     role: "Master Barber",       photo: "", instagram: "#", facebook: "#", x: "#" },
    { name: "Diego Alvarez",   role: "Senior Barber",       photo: "", instagram: "#", facebook: "#", x: "#" },
    { name: "Tariq Hassan",    role: "Barber",              photo: "", instagram: "#", facebook: "#", x: "#" },
    { name: "Jonah Whitfield", role: "Beard Specialist",    photo: "", instagram: "#", facebook: "#", x: "#" },
    { name: "Kenji Mori",      role: "Barber",              photo: "", instagram: "#", facebook: "#", x: "#" },
    { name: "Andre Lewis",     role: "Colour & Styling",    photo: "", instagram: "#", facebook: "#", x: "#" },
    { name: "Sam Okafor",      role: "Barber",              photo: "", instagram: "#", facebook: "#", x: "#" },
    { name: "Luca Ferrari",    role: "Apprentice",          photo: "", instagram: "#", facebook: "#", x: "#" },
    { name: "Ravi Patel",      role: "Front Desk & Bookings", photo: "", instagram: "#", facebook: "#", x: "#" },
  ];

  const $  = (sel, root = document) => root.querySelector(sel);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const ICONS = {
    instagram:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8V6.5c0-.7.3-1 1-1h2V2h-3c-3 0-4.5 1.8-4.5 4.4V8H7v3.5h2.5V22H14V11.5h2.8L17.3 8z"/></svg>',
    x:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  };
  const NETWORKS = { instagram: "Instagram", facebook: "Facebook", x: "X" };

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Book Now links: one place to change (CONFIG.bookingUrl) ---------- */
  document.querySelectorAll("[data-book-link]").forEach((a) => {
    if (CONFIG.bookingUrl) {
      a.href = CONFIG.bookingUrl;
      if (/^https?:\/\//i.test(CONFIG.bookingUrl)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
    } else {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        console.warn("Booking link not set. Add it to CONFIG.bookingUrl in script.js.");
      });
    }
  });

  /* ---------- mobile menu ---------- */
  const header = $(".site-header");
  const toggle = $(".nav-toggle");
  if (header && toggle) {
    const setOpen = (open) => {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", () => setOpen(!header.classList.contains("is-open")));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => e.matches && setOpen(false));
  }

  /* ---------- hero video: pause button + reduced motion ---------- */
  const heroVideo = $(".hero-video");
  const heroPause = $(".hero-pause");
  if (heroVideo && heroPause) {
    const sync = () => {
      const paused = heroVideo.paused;
      heroPause.setAttribute("aria-pressed", String(paused));
      heroPause.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
    };
    heroPause.addEventListener("click", () => {
      if (heroVideo.paused) heroVideo.play().catch(() => {});
      else heroVideo.pause();
    });
    heroVideo.addEventListener("play", sync);
    heroVideo.addEventListener("pause", sync);
    // People who ask their device for less motion get the still poster; they can press play.
    if (reduceMotion) heroVideo.pause();
    sync();
  }

  /* ---------- team page grid ---------- */
  const grid = $("#team-grid");
  if (grid) {
    grid.innerHTML = TEAM.map((m) => {
      const pic = m.photo
        ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">`
        : `<span class="initials" aria-hidden="true">${esc(initials(m.name))}</span>`;
      const links = Object.keys(NETWORKS)
        .filter((k) => m[k])
        .map((k) => `<a href="${esc(m[k])}" aria-label="${esc(m.name)} on ${NETWORKS[k]}">${ICONS[k]}</a>`)
        .join("");
      return `
        <article class="member">
          <div class="member-pic">${pic}</div>
          <div class="member-info">
            <h3 class="member-name">${esc(m.name)}</h3>
            <p class="member-role">${esc(m.role)}</p>
            <div class="socials">${links}</div>
          </div>
        </article>`;
    }).join("");
  }

  /* ---------- home page team carousel ---------- */
  const carousel = $("[data-carousel]");
  if (carousel) {
    const track = $(".carousel-track", carousel);
    const prev = $(".prev", carousel);
    const next = $(".next", carousel);

    track.innerHTML = TEAM.slice(0, 6).map((m) => {
      const pic = m.photo
        ? `<img src="${esc(m.photo)}" alt="" loading="lazy">`
        : `<span class="initials" aria-hidden="true">${esc(initials(m.name))}</span>`;
      return `<figure class="slide" style="margin:0">${pic}
        <figcaption><strong>${esc(m.name)}</strong><span>${esc(m.role)}</span></figcaption></figure>`;
    }).join("");

    const step = () => {
      const slide = $(".slide", track);
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return slide.getBoundingClientRect().width + gap;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    const go = (dir) => track.scrollBy({ left: dir * step(), behavior: reduceMotion ? "auto" : "smooth" });

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); go(-1); }
    });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- contact form ---------- */
  const form = $("#contact-form");
  if (form) {
    const status = $("#form-status");
    const fields = ["name", "email", "subject", "message"].map((id) => ({
      el: $("#" + id, form),
      err: $("#" + id + "-error", form),
      label: id,
    }));

    const check = ({ el, label }) => {
      const v = el.value.trim();
      if (!v) return `Enter your ${label}.`;
      if (label === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email address, like name@example.com.";
      if (label === "message" && v.length < 10) return "Write a little more so we know how to help (10 characters or more).";
      return "";
    };
    const show = (f) => {
      const msg = check(f);
      f.err.textContent = msg;
      f.el.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    };
    fields.forEach((f) => {
      f.el.addEventListener("blur", () => f.el.value && show(f));
      f.el.addEventListener("input", () => f.el.getAttribute("aria-invalid") === "true" && show(f));
    });

    const setStatus = (text, kind) => {
      status.textContent = text;
      status.className = "form-status" + (kind ? " is-" + kind : "");
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setStatus("");
      const results = fields.map(show);
      if (results.includes(false)) {
        fields[results.indexOf(false)].el.focus();
        return;
      }
      const data = Object.fromEntries(fields.map((f) => [f.label, f.el.value.trim()]));

      if (CONFIG.formEndpoint) {
        const btn = $("button[type=submit]", form);
        btn.disabled = true;
        setStatus("Sending…");
        try {
          const res = await fetch(CONFIG.formEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(res.statusText);
          form.reset();
          setStatus("Message sent. We'll be in touch soon.", "ok");
        } catch {
          setStatus("Your message didn't send. Check your connection and try again.", "error");
        } finally {
          btn.disabled = false;
        }
      } else {
        const body = `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
        window.location.href =
          `mailto:${CONFIG.fallbackEmail}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
        setStatus("Opening your email app to send this message.", "ok");
      }
    });
  }
})();

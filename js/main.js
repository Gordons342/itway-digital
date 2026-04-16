(function () {
  "use strict";

  const LANG_KEY = "itway-lang";
  const THEME_KEY = "itway-theme";

  const translations = {
    uk: {
      nav_services: "Послуги",
      nav_ai: "AI",
      nav_official: "Офіційно",
      nav_contacts: "Контакти",
      nav_cta: "Залишити контакт",
      hero_badge: "IT-компанія • Київ",
      hero_title_sub: "Сайти та цифрові рішення, які приносять результат",
      hero_lead:
        "Проєктуємо, розробляємо та запускаємо веб-продукти. Автоматизуємо процеси та впроваджуємо AI-інструменти, щоб ваш бізнес ріс швидше.",
      hero_cta_primary: "Отримати консультацію",
      hero_cta_secondary: "Подивитись послуги",
      trust_1: "днів до першої версії",
      trust_2: "база з самого старту",
      trust_3: "готово для міжнародних клієнтів",
      hero_card_title: "Що отримаєте",
      hero_card_1: "Дизайн і верстка під мобільні та ПК",
      hero_card_2: "Швидке завантаження та сучасний стек",
      hero_card_3: "Інтеграції: CRM, заявки, аналітика",
      hero_card_4: "Підтримка після запуску",
      services_title: "Послуги, які продають",
      services_sub:
        "Замість “формальних формулювань” — конкретні рішення: що робимо та який результат ви отримаєте.",
      svc_badge_main: "Основне",
      svc_badge_fast: "Швидкий старт",
      svc_badge_growth: "Зростання",
      svc_badge_reliable: "Надійність",
      svc_badge_support: "Супровід",
      svc_badge_ai: "AI",
      svc_web_title: "Сайти під ключ",
      svc_web_text:
        "Лендінги, корпоративні сайти, каталоги й магазини. Адаптив, чиста верстка, швидкість, базове SEO.",
      svc_ui_title: "Дизайн та UI/UX",
      svc_ui_text: "Прототип, структура, стиль. Робимо так, щоб клієнту було зрозуміло, а вам — вигідно.",
      svc_dev_title: "Програмування та інтеграції",
      svc_dev_text: "Форми, кабінети, CRM-логіка, API, аналітика. Підключимо сервіси та автоматизуємо рутину.",
      svc_infra_title: "Хостинг та інфраструктура",
      svc_infra_text: "Домен, SSL, деплой, моніторинг, резервні копії. Стабільна робота та швидке завантаження.",
      svc_support_title: "Підтримка та розвиток",
      svc_support_text: "Оновлення, нові сторінки, оптимізація швидкості, безпека. Ми на зв’язку після релізу.",
      svc_ai_title: "AI-інструменти для бізнесу",
      svc_ai_text: "Чат-боти, генерація контенту, пошук по базі знань, автоматизація звернень і підтримки.",
      svc_ai_link: "Як це працює →",
      ai_title: "AI як помічник, а не “іграшка”",
      ai_sub:
        "Підбираємо сценарії під вашу сферу: продажі, підтримка, документообіг, контент. Результат — менше ручної роботи та швидші відповіді клієнтам.",
      ai_1: "Автоматична обробка заявок і звернень",
      ai_2: "Шаблони відповідей, тексти, презентації",
      ai_3: "Пошук по внутрішніх документах і базі знань",
      lead_title: "Залиште контакт — ми запропонуємо рішення",
      lead_sub: "Опишіть задачу й залиште контакт. Ми відповімо з уточнюючими питаннями та коротким планом.",
      lead_meta_1k: "Email",
      lead_meta_2k: "Код",
      f_name: "Ім’я",
      f_email: "Email",
      f_phone: "Телефон",
      f_company: "Компанія",
      f_msg: "Повідомлення",
      f_send: "Надіслати",
      rights: "Усі права захищені.",
      official_title: "Офіційно (КВЕД)",
      official_sub: "Перелік видів діяльності (для документів).",
      k_6201: "Комп'ютерне програмування (основний)",
      k_5829: "Видання іншого програмного забезпечення",
      k_6202: "Консультування з питань інформатизації",
      k_6209: "Інша діяльність у сфері інформаційних технологій і комп'ютерних систем",
      k_6311: "Оброблення даних, розміщення інформації на веб-вузлах і пов'язана з ними діяльність",
      k_6312: "Веб-портали",
      k_6399: "Надання інших інформаційних послуг, н.в.і.у.",
      contacts_title: "Контакти",
      contacts_sub: "Реквізити та спосіб зв’язку.",
      c_code: "Ідентифікаційний код",
      c_email: "Електронна пошта",
      c_addr: "Адреса",
      addr: "Україна, 04052, місто Київ, вул. Глибочицька, будинок 13, квартира 108",
      form_ok: "Дякуємо! Ми отримали вашу заявку і скоро відповімо.",
      form_err: "Не вдалося надіслати. Спробуйте ще раз.",
      form_err_file:
        "Сайт відкрито як файл (file://). Запустіть у папці itway команду npm start і відкрийте http://localhost:8788 — інакше форма не зможе звернутися до сервера.",
      form_err_network:
        "Немає зв’язку з сервером. У терміналі: cd у папку itway → npm start → відкрийте http://localhost:8788 (не подвійний клік по index.html).",
      form_err_config:
        "Сервер без Telegram: у папці itway створіть .env з ITWAY_TELEGRAM_BOT_TOKEN та ITWAY_TELEGRAM_CHAT_ID і перезапустіть npm start.",
      form_err_telegram:
        "Telegram не прийняв повідомлення: перевірте токен, chat_id (лише цифри, для групи — від’ємне число) і натисніть Start у чаті з ботом.",
      form_err_chat_id:
        "У .env у ITWAY_TELEGRAM_CHAT_ID має бути число (наприклад 505910784), без літер і зайвих символів.",
      form_err_validation: "Заповніть обов’язкові поля: ім’я та email.",
    },
    en: {
      nav_services: "Services",
      nav_ai: "AI",
      nav_official: "Official",
      nav_contacts: "Contacts",
      nav_cta: "Leave a contact",
      hero_badge: "IT company • Kyiv",
      hero_title_sub: "Websites and digital solutions that deliver results",
      hero_lead:
        "We design, build, and launch web products. We automate workflows and implement AI tools so your business grows faster.",
      hero_cta_primary: "Get a consultation",
      hero_cta_secondary: "Explore services",
      trust_1: "days to first version",
      trust_2: "SEO baseline from day one",
      trust_3: "ready for international clients",
      hero_card_title: "What you get",
      hero_card_1: "Responsive design for mobile & desktop",
      hero_card_2: "Fast loading and a modern stack",
      hero_card_3: "Integrations: CRM, leads, analytics",
      hero_card_4: "Post‑launch support",
      services_title: "Services that convert",
      services_sub: "Clear offers with outcomes—built to sell, not to look like paperwork.",
      svc_badge_main: "Core",
      svc_badge_fast: "Quick start",
      svc_badge_growth: "Growth",
      svc_badge_reliable: "Reliable",
      svc_badge_support: "Support",
      svc_badge_ai: "AI",
      svc_web_title: "Websites turnkey",
      svc_web_text: "Landing pages, corporate sites, catalogs and stores. Responsive, fast, SEO-ready.",
      svc_ui_title: "Design & UI/UX",
      svc_ui_text: "Structure, prototypes, visuals—so the site looks great and sells.",
      svc_dev_title: "Development & integrations",
      svc_dev_text: "Forms, dashboards, CRM logic, APIs, analytics. We connect tools and automate routine work.",
      svc_infra_title: "Hosting & infrastructure",
      svc_infra_text: "Domain, SSL, deployment, monitoring, backups. Stable performance and fast loading.",
      svc_support_title: "Support & growth",
      svc_support_text: "Updates, new pages, speed and security improvements. We stay with you after launch.",
      svc_ai_title: "AI tools for business",
      svc_ai_text: "Chatbots, content generation, knowledge‑base search, support automation.",
      svc_ai_link: "How it works →",
      ai_title: "AI as a helper—not a toy",
      ai_sub:
        "We select scenarios for your domain: sales, support, documents, content. Less manual work and faster customer responses.",
      ai_1: "Automatic processing of requests and inquiries",
      ai_2: "Reply templates, texts, presentations",
      ai_3: "Search across internal docs and knowledge base",
      lead_title: "Leave a contact — we’ll propose a solution",
      lead_sub: "Describe your needs and leave a contact. We’ll reply with clarifying questions and a short plan.",
      lead_meta_1k: "Email",
      lead_meta_2k: "Code",
      f_name: "Name",
      f_email: "Email",
      f_phone: "Phone",
      f_company: "Company",
      f_msg: "Message",
      f_send: "Send",
      rights: "All rights reserved.",
      official_title: "Official (KVED)",
      official_sub: "Business activity list (for documents).",
      k_6201: "Computer programming (primary)",
      k_5829: "Publishing of other software",
      k_6202: "IT consulting",
      k_6209: "Other IT and computer systems activities",
      k_6311: "Data processing, hosting and related activities",
      k_6312: "Web portals",
      k_6399: "Other information services n.e.c.",
      contacts_title: "Contacts",
      contacts_sub: "Company details and how to reach us.",
      c_code: "Identification code",
      c_email: "Email",
      c_addr: "Address",
      addr: "Ukraine, 04052, Kyiv, Hlybochytska St., building 13, apt 108",
      form_ok: "Thank you! We received your request and will reply soon.",
      form_err: "Failed to send. Please try again.",
      form_err_file:
        "Opened as a local file (file://). Run npm start in the itway folder and open http://localhost:8788 so the form can reach the server.",
      form_err_network:
        "Cannot reach the server. In terminal: cd to itway → npm start → open http://localhost:8788 (do not double‑click index.html).",
      form_err_config:
        "Server has no Telegram config: create itway/.env with ITWAY_TELEGRAM_BOT_TOKEN and ITWAY_TELEGRAM_CHAT_ID, then restart npm start.",
      form_err_telegram:
        "Telegram rejected the message: check the bot token, numeric chat_id (negative for some groups), and press Start in the bot chat.",
      form_err_chat_id:
        "ITWAY_TELEGRAM_CHAT_ID must be a number only (e.g. 505910784), no extra characters.",
      form_err_validation: "Please fill in required fields: name and email.",
    },
  };

  function getStoredLang() {
    try {
      const v = localStorage.getItem(LANG_KEY);
      if (v === "uk" || v === "en") return v;
    } catch (_) {}
    return "uk";
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (_) {}
  }

  function getStoredTheme() {
    try {
      const v = localStorage.getItem(THEME_KEY);
      if (v === "dark" || v === "light") return v;
    } catch (_) {}
    return "dark";
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
  }

  function applyTheme(theme) {
    const t = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    document.querySelectorAll(".theme-switch button[data-theme]").forEach(function (btn) {
      const active = btn.getAttribute("data-theme") === t;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function applyTranslations(lang) {
    const dict = translations[lang] || translations.uk;
    document.documentElement.lang = lang === "en" ? "en" : "uk";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (key && dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll(".lang-switch button[data-lang]").forEach(function (btn) {
      const active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function closeMobileNav() {
    const panel = document.getElementById("nav-panel");
    const toggle = document.getElementById("nav-toggle");
    if (panel) panel.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function initNav() {
    const toggle = document.getElementById("nav-toggle");
    const panel = document.getElementById("nav-panel");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", function () {
      const open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    panel.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 899px)").matches) closeMobileNav();
      });
    });
    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 900px)").matches) closeMobileNav();
    });
  }

  function initLang() {
    let lang = getStoredLang();
    applyTranslations(lang);
    document.querySelectorAll(".lang-switch button[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lang = btn.getAttribute("data-lang");
        if (lang !== "uk" && lang !== "en") return;
        setStoredLang(lang);
        applyTranslations(lang);
        closeMobileNav();
      });
    });
  }

  function initTheme() {
    let theme = getStoredTheme();
    applyTheme(theme);
    document.querySelectorAll(".theme-switch button[data-theme]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        theme = btn.getAttribute("data-theme");
        if (theme !== "dark" && theme !== "light") return;
        setStoredTheme(theme);
        applyTheme(theme);
        closeMobileNav();
      });
    });
  }

  function initHeroCanvas() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0,
      h = 0,
      dpr = 1;
    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.floor(canvas.clientWidth);
      h = Math.floor(canvas.clientHeight);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const dots = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.09,
      vy: (Math.random() - 0.5) * 0.09,
      r: 1.2 + Math.random() * 1.6,
    }));

    let last = performance.now();
    function tick(now) {
      const dt = Math.min(32, now - last) / 1000;
      last = now;
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "rgba(54,246,220,0.10)");
      g.addColorStop(0.55, "rgba(54,246,220,0.05)");
      g.addColorStop(1, "rgba(29,115,255,0.08)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of dots) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dx = (a.x - b.x) * w;
          const dy = (a.y - b.y) * h;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            const alpha = 1 - dist / 150;
            ctx.strokeStyle = `rgba(154,255,246,${0.18 * alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      for (const p of dots) {
        const x = p.x * w;
        const y = p.y * h;
        ctx.fillStyle = "rgba(224,255,251,0.9)";
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(54,246,220,0.10)";
        ctx.beginPath();
        ctx.arc(x, y, p.r * 4.2, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    requestAnimationFrame(tick);
  }

  /**
   * Форма має бити в той самий Node-сервер, де /api/lead (зазвичай порт 8788).
   * Якщо сторінка відкрита з Live Server / іншого порту — шлемо на http://localhost:8788
   * (див. CORS у server.js). Можна задати вручну: window.ITWAY_API_BASE = 'https://ваш-домен'
   */
  function leadApiUrl() {
    var custom =
      typeof window.ITWAY_API_BASE === "string" && window.ITWAY_API_BASE.trim();
    if (custom) {
      return custom.replace(/\/$/, "") + "/api/lead";
    }
    var loc = window.location;
    if (loc.protocol === "file:") {
      return null;
    }
    var port = loc.port;
    if (loc.hostname === "localhost" || loc.hostname === "127.0.0.1") {
      if (port === "8788") {
        return loc.origin + "/api/lead";
      }
      return "http://localhost:8788/api/lead";
    }
    return loc.origin + "/api/lead";
  }

  async function initLeadForm() {
    const form = document.getElementById("lead-form");
    const status = document.getElementById("lead-status");
    if (!form || !status) return;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      status.textContent = "";
      status.className = "form-note";

      const lang = getStoredLang();
      const dict = translations[lang] || translations.uk;

      const fd = new FormData(form);
      const payload = {
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        company: String(fd.get("company") || ""),
        message: String(fd.get("message") || ""),
        lang,
      };

      function setErr(msg) {
        status.textContent = msg;
        status.className = "form-note is-err";
      }

      var leadUrl = leadApiUrl();
      if (!leadUrl) {
        setErr(dict.form_err_file);
        return;
      }

      try {
        console.info("[ITWAY] Запит заявки на:", leadUrl);
        const resp = await fetch(leadUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await resp.json().catch(() => ({}));

        if (resp.ok && data && data.ok) {
          status.textContent = dict.form_ok;
          status.className = "form-note is-ok";
          form.reset();
          return;
        }

        const code = data && data.code;
        const detail = data && data.detail ? String(data.detail) : "";
        if (resp.status === 400 && code === "validation") setErr(dict.form_err_validation);
        else if (resp.status === 400 && code === "bad_body") setErr(detail || dict.form_err_file);
        else if (resp.status === 500 && code === "not_configured") setErr(dict.form_err_config);
        else if (resp.status === 500 && code === "bad_chat_id") setErr(dict.form_err_chat_id);
        else if (resp.status === 500 && code === "server_error")
          setErr(dict.form_err + (detail ? ": " + detail : "") + " (HTTP 500)");
        else if (code === "express_error")
          setErr(dict.form_err + (detail ? ": " + detail : "") + " (HTTP " + resp.status + ")");
        else if (resp.status === 502) setErr(dict.form_err_telegram);
        else setErr(dict.form_err + " (HTTP " + resp.status + ")");
      } catch (_) {
        setErr(dict.form_err_network);
      }
    });
  }

  function boot() {
    initTheme();
    initLang();
    initNav();
    initHeroCanvas();
    initLeadForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();


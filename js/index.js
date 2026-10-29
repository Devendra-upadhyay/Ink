/* =========================================================
   INDEPENDENT INK — SHARED JAVASCRIPT
   Navigation, search, filtering, and active navigation links.
   ========================================================= */

(() => {
  "use strict";

  /* -------------------- HELPER FUNCTIONS -------------------- */

  const normalizePath = (path) => {
    const cleanPath = String(path || "")
      .split(/[?#]/, 1)[0]
      .replace(/\/+$/, "");

    return cleanPath || "/";
  };

  const pageName = (path) => {
    const rawPath = String(path || "").split(/[?#]/, 1)[0];

    // A directory URL loads index.html.
    if (!rawPath || rawPath.endsWith("/")) {
      return "index.html";
    }

    return normalizePath(rawPath)
      .split("/")
      .pop()
      .toLowerCase();
  };

  const cleanText = (value) =>
    String(value || "").trim().toLocaleLowerCase();

  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        callback,
        { once: true }
      );
    } else {
      callback();
    }
  };

  /* -------------------- HAMBURGER MENU -------------------- */

  function initNavigation() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");

    if (!hamburger || !navMenu) return;

    if (!hamburger.hasAttribute("aria-controls")) {
      hamburger.setAttribute("aria-controls", "navMenu");
    }

    if (!hamburger.hasAttribute("aria-expanded")) {
      hamburger.setAttribute("aria-expanded", "false");
    }

    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const isOpen = () =>
      navMenu.classList.contains("active") ||
      navMenu.classList.contains("show");

    function setOpen(open) {
      // Keep both classes synchronized for older pages.
      navMenu.classList.toggle("active", open);
      navMenu.classList.toggle("show", open);

      // Animate the hamburger into an X.
      hamburger.classList.toggle("open", open);

      hamburger.setAttribute(
        "aria-expanded",
        String(open)
      );
    }

    hamburger.addEventListener("click", (event) => {
      event.preventDefault();
      setOpen(!isOpen());
    });

    // Close the menu when a navigation link is selected.
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setOpen(false);
      });
    });

    // Escape key closes the menu.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        hamburger.focus();
      }
    });

    // Clicking outside the menu closes it on mobile.
    document.addEventListener("click", (event) => {
      if (
        isOpen() &&
        mobileQuery.matches &&
        !navMenu.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        setOpen(false);
      }
    });

    // Close the mobile menu when switching to desktop width.
    const handleViewportChange = (event) => {
      if (!event.matches) {
        setOpen(false);
      }
    };

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener(
        "change",
        handleViewportChange
      );
    } else if (typeof mobileQuery.addListener === "function") {
      // Support older Safari versions.
      mobileQuery.addListener(handleViewportChange);
    }
  }

  /* -------------------- ACTIVE NAVIGATION LINK -------------------- */

  function initActiveNavLink() {
    const links = document.querySelectorAll(".nav-right a");

    if (!links.length) return;

    const currentPage = pageName(window.location.pathname);

    // Reader pages belong to their parent navigation sections.
    const parentPage = {
      "poem-reader.html": "poem.html",
      "poem-reading.html": "poem.html",
      "article-reader.html": "article.html",
      "article-reading.html": "article.html"
    };

    const effectivePage = parentPage[currentPage] || currentPage;

    links.forEach((link) => {
      const href = link.getAttribute("href");

      if (!href) return;

      let targetPage;

      try {
        targetPage = pageName(
          new URL(href, window.location.href).pathname
        );
      } catch {
        return;
      }

      const isHome =
        (effectivePage === "" || effectivePage === "index.html") &&
        (targetPage === "" || targetPage === "index.html");

      const active =
        isHome ||
        (targetPage === effectivePage && targetPage !== "");

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  /* -------------------- SEARCH AND FILTER ENGINE -------------------- */

  const listState = {
    poems: {
      query: "",
      category: "all"
    },

    articles: {
      query: "",
      category: "all"
    }
  };

  function cardCategory(card) {
    const dataCategory = cleanText(card.dataset.category);

    if (dataCategory) {
      return dataCategory;
    }

    // Supports existing classes such as "poem-card love".
    const reserved = new Set([
      "poem-card",
      "article-card",
      "active",
      "hidden",
      "is-filtered-out"
    ]);

    const categoryClass = Array.from(card.classList).find(
      (name) => !reserved.has(name)
    );

    return cleanText(categoryClass);
  }

  function renderList(kind) {
    const selector =
      kind === "poems"
        ? ".poem-card"
        : ".article-card";

    const state = listState[kind];

    document.querySelectorAll(selector).forEach((card) => {
      const text = [
        cleanText(card.dataset.title),
        cleanText(card.textContent)
      ].join(" ");

      const matchesQuery = text.includes(state.query);
      const category = cardCategory(card);

      const matchesCategory =
        state.category === "all" ||
        category === state.category ||
        card.classList.contains(state.category);

      const visible = matchesQuery && matchesCategory;

      card.classList.toggle(
        "is-filtered-out",
        !visible
      );

      card.hidden = !visible;
    });
  }

  function setQuery(kind, value) {
    listState[kind].query = cleanText(value);
    renderList(kind);
  }

  function setCategory(kind, category, button) {
    listState[kind].category = cleanText(category) || "all";

    const scope =
      kind === "poems"
        ? (
            document.querySelector(".poem-list")?.parentElement ||
            document
          )
        : (
            document.querySelector(".article-list")?.parentElement ||
            document
          );

    scope.querySelectorAll(".filters button").forEach((item) => {
      const active = item === button;

      item.classList.toggle("active", active);

      if (
        item.hasAttribute("aria-pressed") ||
        item.dataset.category
      ) {
        item.setAttribute(
          "aria-pressed",
          String(active)
        );
      }
    });

    renderList(kind);
  }

  /* -------------------- PUBLIC FUNCTIONS FOR HTML -------------------- */

  // These global names preserve compatibility with inline HTML handlers.

  window.searchPoemsByName = function () {
    const input = document.getElementById("poemSearch");

    if (input) {
      setQuery("poems", input.value);
    }
  };

  window.filterPoems = function (
    category = "all",
    button = null
  ) {
    setCategory("poems", category, button);
  };

  window.searchArticlesByName = function () {
    const input = document.getElementById("articleSearch");

    if (input) {
      setQuery("articles", input.value);
    }
  };

  window.filterArticles = function (
    category = "all",
    button = null
  ) {
    setCategory("articles", category, button);
  };

  /* -------------------- SEARCH INPUTS AND CLEAR BUTTONS -------------------- */

  function initSearchInputs() {
    const poemSearch = document.getElementById("poemSearch");

    if (poemSearch) {
      poemSearch.addEventListener("input", () => {
        setQuery("poems", poemSearch.value);
      });
    }

    const articleSearch = document.getElementById("articleSearch");

    if (articleSearch) {
      articleSearch.addEventListener("input", () => {
        setQuery("articles", articleSearch.value);
      });
    }

    const clearArticle = document.getElementById(
      "clearArticleSearch"
    );

    if (clearArticle && articleSearch) {
      clearArticle.addEventListener("click", () => {
        articleSearch.value = "";
        setQuery("articles", "");
        articleSearch.focus();
      });
    }

    const clearPoems = document.getElementById(
      "clearPoemSearch"
    );

    if (clearPoems && poemSearch) {
      clearPoems.addEventListener("click", () => {
        poemSearch.value = "";
        setQuery("poems", "");
        poemSearch.focus();
      });
    }
  }

  /* -------------------- INITIALIZE SHARED FEATURES -------------------- */

  onReady(() => {
    initNavigation();
    initActiveNavLink();
    initSearchInputs();

    const poemSearch = document.getElementById("poemSearch");

    if (poemSearch?.value) {
      setQuery("poems", poemSearch.value);
    }

    const articleSearch = document.getElementById("articleSearch");

    if (articleSearch?.value) {
      setQuery("articles", articleSearch.value);
    }

    // Automatically update the footer year when the element exists.
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
      currentYear.textContent = String(
        new Date().getFullYear()
      );
    }
  });
})();
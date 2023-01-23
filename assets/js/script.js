"use strict";

/**
 * element toggle function
 */

const elemToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

/**
 * header sticky & go to top
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 10) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }
});

/**
 * navbar toggle
 */

const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");

navToggleBtn.addEventListener("click", function () {
  elemToggleFunc(navToggleBtn);
  elemToggleFunc(navbar);
  elemToggleFunc(document.body);
});

/**
 * skills toggle
 */

const toggleBtnBox = document.querySelector("[data-toggle-box]");
const toggleBtns = document.querySelectorAll("[data-toggle-btn]");
const skillsBox = document.querySelector("[data-skills-box]");

for (let i = 0; i < toggleBtns.length; i++) {
  toggleBtns[i].addEventListener("click", function () {
    elemToggleFunc(toggleBtnBox);
    for (let i = 0; i < toggleBtns.length; i++) {
      elemToggleFunc(toggleBtns[i]);
    }
    elemToggleFunc(skillsBox);
  });
}

/**
 * dark & light theme toggle
 */

const themeToggleBtn = document.querySelector("[data-theme-btn]");

themeToggleBtn.addEventListener("click", function () {
  elemToggleFunc(themeToggleBtn);

  if (themeToggleBtn.classList.contains("active")) {
    document.body.classList.remove("dark_theme");
    document.body.classList.add("light_theme");

    localStorage.setItem("theme", "light_theme");
  } else {
    document.body.classList.add("dark_theme");
    document.body.classList.remove("light_theme");

    localStorage.setItem("theme", "dark_theme");
  }
});

/**
 * check & apply last time selected theme from localStorage
 */

if (localStorage.getItem("theme") === "light_theme") {
  themeToggleBtn.classList.add("active");
  document.body.classList.remove("dark_theme");
  document.body.classList.add("light_theme");
} else {
  themeToggleBtn.classList.remove("active");
  document.body.classList.remove("light_theme");
  document.body.classList.add("dark_theme");
}

const PX_RATIO = window.devicePixelRatio;

Math.dist = (dx, dy) => {
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
};

// CURSOR//
class Cursor {
  constructor() {
    this.container = window["cursor"];
    this.shape = window["cursor-shape"];
    this.translation = { x: 1, y: 1 };
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.precision = 2;
    this.scale = 1;
    this.rotation = 1;
    this.friction = 0.1;
    this.animate();
    this.events();
  }

  events() {
    document.addEventListener(
      "mousemove",
      (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      },
      false
    );
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  speed_morph() {
    const dist = Math.dist(this.dx, this.dy);
    const min = 0.3;
    const max_distance = 500;
    const total = dist / max_distance;
    return Number(Math.min(total, min).toFixed(2));
  }

  update() {
    const speed_morph = this.speed_morph(this.dx, this.dy);
    this.scale += (speed_morph - this.scale) * this.friction;

    this.translation.x += this.dx * this.friction;
    this.translation.y += this.dy * this.friction;

    this.rotation = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
  }

  render() {
    this.update();
    this.container.style.transform =
      "translate3d(" +
      this.translation.x.toFixed(this.precision) +
      "px ," +
      this.translation.y.toFixed(this.precision) +
      "px, 0)";
    this.shape.style.transform =
      "rotate(" +
      this.rotation.toFixed(this.precision) +
      "deg) " +
      "scale(" +
      (1 + this.scale) +
      ", " +
      (1 - this.scale) +
      ")";
  }

  get dx() {
    return this.mouse.x - this.translation.x;
  }

  get dy() {
    return this.mouse.y - this.translation.y;
  }
}

const _cursor = new Cursor();

//-------------JOB DESCRIPTION-----------------//

class ItcTabs {
  constructor(target, config) {
    const defaultConfig = {};
    this._config = Object.assign(defaultConfig, config);
    this._elTabs =
      typeof target === "string" ? document.querySelector(target) : target;
    this._elButtons = this._elTabs.querySelectorAll(".tabs__btn");
    this._elPanes = this._elTabs.querySelectorAll(".tabs__pane");
    this._eventShow = new Event("tab.itc.change");
    this._init();
    this._events();
  }
  _init() {
    this._elTabs.setAttribute("role", "tablist");
    this._elButtons.forEach((el, index) => {
      el.dataset.index = index;
      el.setAttribute("role", "tab");
      this._elPanes[index].setAttribute("role", "tabpanel");
    });
  }
  show(elLinkTarget) {
    const elPaneTarget = this._elPanes[elLinkTarget.dataset.index];
    const elLinkActive = this._elTabs.querySelector(".tabs__btn_active");
    const elPaneShow = this._elTabs.querySelector(".tabs__pane_show");
    if (elLinkTarget === elLinkActive) {
      return;
    }
    elLinkActive ? elLinkActive.classList.remove("tabs__btn_active") : null;
    elPaneShow ? elPaneShow.classList.remove("tabs__pane_show") : null;
    elLinkTarget.classList.add("tabs__btn_active");
    elPaneTarget.classList.add("tabs__pane_show");
    this._elTabs.dispatchEvent(this._eventShow);
    elLinkTarget.focus();
  }
  showByIndex(index) {
    const elLinkTarget = this._elButtons[index];
    elLinkTarget ? this.show(elLinkTarget) : null;
  }
  _events() {
    this._elTabs.addEventListener("click", (e) => {
      const target = e.target.closest(".tabs__btn");
      if (target) {
        e.preventDefault();
        this.show(target);
      }
    });
  }
}
new ItcTabs(".tabs");

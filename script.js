//SCROLL ANIMATIONS
gsap.registerPlugin(ScrollTrigger);

gsap.to(".about", {
  marginTop: "-30rem",
  scale: "1",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    scrub: true,
    pin: true,
  },
});

//CARD SCROLL ANIMATION
gsap.from(".card", {
  y: 100,
  opacity: 0,
  stagger: 0.4,
  scrollTrigger: {
    trigger: ".services",
    start: "top bottom",
  },
});

// PRELOADER (logo animation)
window.addEventListener("load", () => {
  setTimeout(() => {
    const tl = gsap.timeline();
    tl.to(".preload img", { opacity: 0, duration: 1 });
    tl.to(".preloader", { yPercent: -100, duration: 1, ease: "power2.out" });
  }, 200);
});

//FAQ TOGGLE
const detailsItems = document.querySelectorAll(".detail-item");
detailsItems.forEach((item) => {
  item.addEventListener("click", () => {
    const details = item.lastElementChild;
    details.classList.toggle("details-open");
  });
});

//NAVBAR OPEN
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu nav");

menuBtn.addEventListener("click", () => {
  menu.classList.toggle("menu-open");
});

//// VIDEO

TweenMax.set(".play-circle-01", {
  rotation: 90,
  transformOrigin: "center",
});

TweenMax.set(".play-circle-02", {
  rotation: -90,
  transformOrigin: "center",
});

TweenMax.set(".play-perspective", {
  xPercent: 6.5,
  scale: 0.175,
  transformOrigin: "center",
  perspective: 1,
});

TweenMax.set(".play-video", {
  visibility: "hidden",
  opacity: 0,
});

TweenMax.set(".play-triangle", {
  transformOrigin: "left center",
  transformStyle: "preserve-3d",
  rotationY: 10,
  scaleX: 2,
});

const rotateTL = new TimelineMax({ paused: true })
  .to(
    ".play-circle-01",
    0.7,
    {
      opacity: 0.1,
      rotation: "+=360",
      strokeDasharray: "456 456",
      ease: Power1.easeInOut,
    },
    0
  )
  .to(
    ".play-circle-02",
    0.7,
    {
      opacity: 0.1,
      rotation: "-=360",
      strokeDasharray: "411 411",
      ease: Power1.easeInOut,
    },
    0
  );

const openTL = new TimelineMax({ paused: true })
  .to(
    ".play-backdrop",
    1,
    {
      opacity: 0.95,
      visibility: "visible",
      ease: Power2.easeInOut,
    },
    0
  )
  .to(
    ".play-close",
    1,
    {
      opacity: 1,
      ease: Power2.easeInOut,
    },
    0
  )
  .to(
    ".play-perspective",
    1,
    {
      xPercent: 0,
      scale: 1,
      ease: Power2.easeInOut,
    },
    0
  )
  .to(
    ".play-triangle",
    1,
    {
      scaleX: 1,
      ease: ExpoScaleEase.config(2, 1, Power2.easeInOut),
    },
    0
  )
  .to(
    ".play-triangle",
    1,
    {
      rotationY: 0,
      ease: ExpoScaleEase.config(10, 0.01, Power2.easeInOut),
    },
    0
  )
  .to(
    ".play-video",
    1,
    {
      visibility: "visible",
      opacity: 1,
    },
    0.5
  );

const button = document.querySelector(".play-button");
const backdrop = document.querySelector(".play-backdrop");
const close = document.querySelector(".play-close");

button.addEventListener("mouseover", () => rotateTL.play());
button.addEventListener("mouseleave", () => rotateTL.reverse());
button.addEventListener("click", () => openTL.play());
backdrop.addEventListener("click", () => openTL.reverse());
close.addEventListener("click", (e) => {
  e.stopPropagation();
  openTL.reverse();
});

// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#____";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

const phrases = [
  "William Henry Gates III (Bill Gates).",
  "O desenvolvimento de sistemas",
  "é a alquimia moderna,",
  "onde os programadores,",
  "como feiticeiros digitais,",
  "transformam linhas de código",
  "em soluções poderosas,",
  "desbravando novos horizontes...",
  "...seguiremos eles ou ficaremos para trás?",
];

const el = document.querySelector(".text-anime");
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 800 * 5);
  });
  counter = (counter + 1) % phrases.length;
};

next();

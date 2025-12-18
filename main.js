const navItem= document.querySelectorAll(".nav-item");
const allSection= document.querySelectorAll("section");
const headerHeight= document.querySelector(".header").offsetHeight;

const underline= document.querySelector(".underline");
const homeBtn= document.querySelector(".home-btn");

let left;
let width;

// const observer =new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     if(entry.isIntersecting) {
//       const id= entry.target.id;
//       navItem.forEach(item => {
//         item.classList.toggle("active", item.dataset.target === id);
//       });
//     }
//   })
// },{
//   root: null,
//   rootMargin: `-${headerHeight}px 0px -40% 0px`,
//   threshold: 3
// })
navItem.forEach((item) => {
  // observer.observe(item);
    item.addEventListener("click", (e) => {
        e.preventDefault();
        left= item.offsetLeft;
        width= item.offsetWidth;
        underline.style.left= left + "px";
        underline.style.width= width + "px";

        const id= item.textContent.toLowerCase();

        const section= document.getElementById(id);
        section.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });;
    });
});

// window.addEventListener("scroll", () => {
//   let currentSection= "";
//   const navHeight= headerTag.offsetHeight;

//   allSection.forEach((sec) => {
//     const sectionTop= section.offsetTop - navHeight - 5;
    
//     if(window.scrollY >= sectionTop) {
//       currentSection = sec.id;
//     }
//   });
// })

const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

/* ======================
   RESIZE
====================== */
function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ======================
   IMAGES
====================== */
const imgPaths = [
  "Touse/h5.jpg",
  "Touse/h3.jpg",
//   "Touse/h11.jpg",
//   "Touse/v2.jpg"
];
const images = imgPaths.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

/* ======================
   ❤️ HEART SYSTEM
====================== */
let hearts = [];

class Heart {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -50;
    this.size = Math.random() * 20 + 25;
    this.speed = Math.random() * 2 + 1.2;
    this.angle = Math.random() * Math.PI * 2;
    this.rotateSpeed = Math.random() * 0.06 + 0.03;
    this.img = images[Math.floor(Math.random() * images.length)];
  }

  heartPath() {
    const s = this.size;
    ctx.beginPath();
    ctx.moveTo(0, s / 4);
    ctx.bezierCurveTo(-s/2, -s/2, -s, s/3, 0, s);
    ctx.bezierCurveTo(s, s/3, s/2, -s/2, 0, s/4);
    ctx.closePath();
  }

  drawImageFit(img) {
    const ratio = img.width / img.height;
    let w, h;
    if (ratio > 1) {
      w = this.size * 2;
      h = w / ratio;
    } else {
      h = this.size * 2;
      w = h * ratio;
    }
    ctx.drawImage(img, -w/2, -h/2, w, h);
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    // 🔄 Y-axis rotation illusion
    const flip = Math.cos(this.angle);
    ctx.scale(flip, 1);

    this.heartPath();

    // ❤️ border
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,105,180,0.9)";
    ctx.shadowColor = "#ff5fa2";
    ctx.shadowBlur = 8;
    ctx.stroke();

    ctx.clip();
    this.drawImageFit(this.img);

    ctx.restore();
  }

  update() {
    this.y += this.speed;
    this.angle += this.rotateSpeed;
    this.draw();
  }
}

/* ======================
   🎉 CONFETTI SYSTEM
====================== */
let confetti = [];
const NUM_CONFETTI = 70;
const COLORS = ['#e57373', '#f48fb1', '#ffcdd2', '#81c784'];

class Confetto {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -Math.random() * canvas.height;
    this.w = 8 + Math.random() * 6;
    this.h = 8 + Math.random() * 6;
    this.velocity = 2 + Math.random() * 3;
    this.rotation = Math.random() * Math.PI;
    this.rotationSpeed = Math.random() * 0.1 - 0.05;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  draw() {
    ctx.save();
    ctx.translate(this.x + this.w/2, this.y + this.h/2);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
    ctx.restore();
  }

  update() {
    this.y += this.velocity;
    this.rotation += this.rotationSpeed;

    if (this.y > canvas.height) {
      this.y = -20;
      this.x = Math.random() * canvas.width;
    }
  }
}

/* ======================
   INIT
====================== */
function initHearts(count = 30) {
  for (let i = 0; i < count; i++) {
    hearts.push(new Heart());
  }
}

function initConfetti() {
  confetti = [];
  for (let i = 0; i < NUM_CONFETTI; i++) {
    confetti.push(new Confetto());
  }
}

/* ======================
   ANIMATION
====================== */
let animationId = null;
let duration = 10000;
let startTime = null;

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;

  if (elapsed < duration) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach(c => {
      c.update();
      c.draw();
    });

    hearts.forEach((h, i) => {
      h.update();
      if (h.y > canvas.height + 80) hearts.splice(i, 1);
    });

    animationId = requestAnimationFrame(animate);
  } else {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationId = null;
    startTime = null;
  }
}

/* ======================
   BUTTON
====================== */
homeBtn.addEventListener("click", () => {
  if (animationId) cancelAnimationFrame(animationId);

  hearts = [];
  resizeCanvas();
  initHearts(35);
  initConfetti();
  animate(0);
});

//scroll to

const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

window.onscroll = () => {
    const header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 100);

    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

// Assurez-vous que votre IntersectionObserver contient cette condition "if"
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-animate');

            // CETTE CONDITION EST CRUCIALE !
            // Elle vérifie si la section visible est bien celle avec l'ID "skills"
            if (entry.target.id === 'skills') {
                animateSkillBars(); // Et si c'est le cas, elle lance l'animation des barres
            }
        } else {
            // Optionnel : réinitialise l'animation quand on quitte la section
            entry.target.classList.remove('show-animate');
        }
    });
}, {
    threshold: 0.1 
});

// Cette ligne ne change pas, elle doit toujours être là
const sectionsToAnimate = document.querySelectorAll('section');
sectionsToAnimate.forEach(sec => observer.observe(sec));

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skills-content .progress span');
    skillBars.forEach(span => {
        const progress = span.dataset.progress || '75%';
        span.style.width = progress;
    });
}

const typingElement = document.querySelector('.text-animate h3');
const words = ["Fullstack Developer", "Ingénieur Informatique", "Créateur de Solutions"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  if (!typingElement) return;

  const currentWord = words[wordIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    setTimeout(() => isDeleting = true, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  const typeSpeed = isDeleting ? 75 : 150;
  setTimeout(typeLoop, typeSpeed);
}
typeLoop();

const canvas = document.getElementById('canvas-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const mouse = {
        x: undefined,
        y: undefined,
        radius: 150
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    window.addEventListener('mouseleave', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    let particles = [];
    const colors = ['#00d4ff', '#4facfe', '#ff6b6b', '#f5576c'];
    const maxParticles = 70;
    const connectDistance = 90;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 1;
            this.baseSize = this.size;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedX = (Math.random() * 2 - 1);
            this.speedY = (Math.random() * 2 - 1);
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                this.size = this.baseSize + (mouse.radius - distance) / 10;
            } else {
                this.size = this.baseSize;
            }
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < connectDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${1 - distance / connectDistance})`;
                    ctx.lineWidth = 0.3;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            
            let mouseDx = mouse.x - particles[i].x;
            let mouseDy = mouse.y - particles[i].y;
            let mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
            if (mouseDistance < mouse.radius) {
                 ctx.beginPath();
                 ctx.strokeStyle = `rgba(255, 255, 255, ${1 - mouseDistance / mouse.radius})`;
                 ctx.lineWidth = 0.5;
                 ctx.moveTo(mouse.x, mouse.y);
                 ctx.lineTo(particles[i].x, particles[i].y);
                 ctx.stroke();
            }
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        }, 250);
    });
}


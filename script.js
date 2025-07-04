
document.addEventListener('DOMContentLoaded', () => {

    function init() {
        setupNavigation();
        setupScrollEffects();
        setupIntersectionObserver();
        setupNavScrollSpy();
        setupTypingAnimation();
        setupParticleCanvas();
        setupInfiniteScroller();
        setupInteractiveTerminal();
        logVisitorActivity();
    }

    function setupNavigation() {
        const menuIcon = document.querySelector('#menu-icon');
        const navbar = document.querySelector('.navbar');

        if (!menuIcon || !navbar) return;

        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        });

        window.closeMobileMenu = () => {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        };
    }
    function setupNavScrollSpy() {
        const sections = document.querySelectorAll('section[id]'); 
        if (sections.length === 0) return;

        const observerOptions = {
            root: null, 
            rootMargin: '0px',

            threshold: 0.7 
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.navbar a[href="#${sectionId}"]`);

                    document.querySelectorAll('.navbar a').forEach(link => {
                        link.classList.remove('active');
                    });

                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    function setupScrollEffects() {
        const header = document.querySelector('.header');
        const scrollTopBtn = document.getElementById('scrollTopBtn');

        if (!header || !scrollTopBtn) return;


        const handleScroll = () => {
            const scrollY = window.scrollY;


            header.classList.toggle('sticky', scrollY > 100);

            scrollTopBtn.classList.toggle('visible', scrollY > 400);

            if (typeof window.closeMobileMenu === 'function') {
                window.closeMobileMenu();
            }
        };

        window.addEventListener('scroll', handleScroll);
    }


    function setupIntersectionObserver() {
        const sectionsToAnimate = document.querySelectorAll('section');
        if (sectionsToAnimate.length === 0) return;


        const animateSkillBars = () => {
            const skillBars = document.querySelectorAll('.skills-content .progress span');
            skillBars.forEach(span => {
                const progress = span.dataset.progress || '0%';
                span.style.width = progress;
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-animate');

                    if (entry.target.id === 'skills') {
                        animateSkillBars();
                    }
                } else {

                }
            });
        }, {
            threshold: 0.1
        });

        sectionsToAnimate.forEach(sec => observer.observe(sec));
    }


    function setupTypingAnimation() {
        const typingElement = document.querySelector('.text-animate h3');
        if (!typingElement) return;

        const words = ["Fullstack Developer", "Ingénieur Informatique", "Créateur de Solutions"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentWord = words[wordIndex];
            const typeSpeed = isDeleting ? 75 : 150;

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

            setTimeout(typeLoop, typeSpeed);
        }

        typeLoop();
    }

    function setupParticleCanvas() {
        const canvas = document.getElementById('canvas-bg');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const mouse = { x: undefined, y: undefined, radius: 150 };
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

                this.size = (distance < mouse.radius) ? this.baseSize + (mouse.radius - distance) / 10 : this.baseSize;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
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
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animate);
        }

        window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
        window.addEventListener('mouseleave', () => { mouse.x = undefined; mouse.y = undefined; });
        
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                initParticles();
            }, 250); // Debounce pour la performance
        });

        initParticles();
        animate();
    }

    /**
     * Configure le défilement infini pour la section des compétences en mode mobile.
     */
    function setupInfiniteScroller() {
        const skillsInner = document.querySelector('.animated-skills .inner');
        if (skillsInner) {
            const skillsContent = Array.from(skillsInner.children);
            skillsContent.forEach(item => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute('aria-hidden', true);
                skillsInner.appendChild(duplicatedItem);
            });
        }
    }

    /**
     * Gère la logique et l'interactivité du terminal CMD.
     */
    function setupInteractiveTerminal() {
        const terminalBody = document.getElementById('terminalBody');
        const terminalInput = document.getElementById('terminalInput');
        const terminalOutput = document.getElementById('terminalOutput');
        
        if (!terminalBody || !terminalInput || !terminalOutput) return;

        const commands = {
            'help': `Commandes disponibles:<br>
                       about
                       skills
                       projects
                       contact
                       clear`,
            'about': "Je suis Mohamed MAHROUCH, un développeur Fullstack et étudiant en cycle d'ingénieur. Passionné par la résolution de problèmes et la création d'applications web performantes.",
            'skills': "Mes compétences incluent :- Langages : Golang, Java, Python, JavaScript/TypeScript- Backend : NestJS, Gin, Laravel- Frontend : React, Next.js, HTML5, CSS3- Bases de données : PostgreSQL, MySQL- Outils : Docker, Git, Postman",
            'projects': "Vous pouvez voir mes projets dans la section dédiée. Quelques exemples notables incluent un système de gestion de location et ce portfolio lui-même !",
            'contact': "Vous pouvez me contacter via le formulaire ou directement par email à :<a href='mailto:mohamedmahrouch551@gmail.com' class='info'>mohamedmahrouch551@gmail.com</a>",
            'clear': ""
        };

        const typeEffect = (element, text, speed = 15) => new Promise(resolve => {
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            };
            type();
        });

        const processCommand = async (command) => {
            const outputDiv = document.createElement('div');
            outputDiv.classList.add('terminal-line');
            outputDiv.innerHTML = `<div class="command-line"><span class="prompt-user">client@mahrouch.dev:~$</span> ${command}</div>`;
            terminalOutput.appendChild(outputDiv);

            if (command === 'clear') {
                terminalOutput.innerHTML = '';
                return;
            }

            const responseText = commands[command.toLowerCase()];
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('output-line');
            outputDiv.appendChild(responseDiv);

            if (responseText !== undefined) {
                await typeEffect(responseDiv, responseText);
            } else {
                responseDiv.classList.add('error');
                await typeEffect(responseDiv, `bash: command not found: ${command}. Tapez 'help' pour la liste des commandes.`);
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
        };

        terminalInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                terminalInput.value = '';
                if (command) {
                    await processCommand(command);
                }
            }
        });

        terminalBody.addEventListener('click', () => terminalInput.focus());

        // Affiche le message de bienvenue au chargement
        const welcomeMessage = async () => {
            const welcomeDiv = document.createElement('div');
            welcomeDiv.classList.add('output-line', 'success');
            terminalOutput.appendChild(welcomeDiv);
            await typeEffect(welcomeDiv, "Bienvenue sur ma console interactive ! Tapez 'help' pour commencer.");
        };
        
        welcomeMessage();
    }

    // Lance l'initialisation de tous les modules
    init();
});

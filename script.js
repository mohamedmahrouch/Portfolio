/**
 * Attend que le contenu du DOM soit entièrement chargé avant d'exécuter les scripts.
 * C'est le point d'entrée principal de notre application.
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Fonction principale qui initialise tous les modules de la page.
     */
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
    function logVisitorActivity() {
        // REMPLACEZ CECI par l'URL réelle de votre fichier PHP hébergé
        const url = 'https://mohamedmahrouch.github.io/log_visitor.php';

        // fetch() envoie une requête en arrière-plan à votre script PHP.
        // L'utilisateur ne voit rien.
        fetch(url)
            .then(response => {
                // On vérifie si le serveur a bien répondu
                if (!response.ok) {
                    console.error('La réponse du serveur n\'est pas OK');
                }
                // On ne fait rien de plus, l'appel est suffisant.
                console.log('Visite enregistrée avec succès.');
            })
            .catch(error => {
                // S'il y a une erreur réseau (ex: le serveur est hors ligne)
                console.error('Erreur lors de l\'appel au script de log:', error);
            });
    }
    /**
     * Configure la navigation : menu burger et fermeture du menu.
     */
    function setupNavigation() {
        const menuIcon = document.querySelector('#menu-icon');
        const navbar = document.querySelector('.navbar');

        if (!menuIcon || !navbar) return;

        // Gère le clic sur l'icône du menu pour ouvrir/fermer la navbar
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        });

        // Fonction pour fermer le menu (utilisée lors du défilement)
        window.closeMobileMenu = () => {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        };
    }
    function setupNavScrollSpy() {
        const sections = document.querySelectorAll('section[id]'); // On ne prend que les sections qui ont un ID
        if (sections.length === 0) return;

        const observerOptions = {
            root: null, // observe par rapport au viewport
            rootMargin: '0px',
            // Le lien devient actif quand 70% de la section est visible.
            // Ajustez cette valeur (entre 0.0 et 1.0) si nécessaire.
            threshold: 0.7 
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                // Si la section est visible (selon le threshold)
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.navbar a[href="#${sectionId}"]`);
                    
                    // On enlève 'active' de tous les liens
                    document.querySelectorAll('.navbar a').forEach(link => {
                        link.classList.remove('active');
                    });

                    // On ajoute 'active' au bon lien
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach(section => observer.observe(section));
    }
    /**
     * Gère les effets visuels liés au défilement (header "sticky" et bouton "scroll-to-top").
     */
    function setupScrollEffects() {
        const header = document.querySelector('.header');
        const scrollTopBtn = document.getElementById('scrollTopBtn');

        if (!header || !scrollTopBtn) return;

        // Centralise la logique de défilement pour de meilleures performances.
        const handleScroll = () => {
            const scrollY = window.scrollY;

            // Rend le header "sticky" après un certain défilement
            header.classList.toggle('sticky', scrollY > 100);

            // Affiche le bouton "scroll-to-top" après 400px de défilement
            scrollTopBtn.classList.toggle('visible', scrollY > 400);

            // Ferme le menu mobile si l'utilisateur commence à défiler
            if (typeof window.closeMobileMenu === 'function') {
                window.closeMobileMenu();
            }
        };

        window.addEventListener('scroll', handleScroll);
    }

    /**
     * Configure l'IntersectionObserver pour animer les sections et les barres de compétences lorsqu'elles deviennent visibles.
     */
    function setupIntersectionObserver() {
        const sectionsToAnimate = document.querySelectorAll('section');
        if (sectionsToAnimate.length === 0) return;

        // Fonction pour animer les barres de compétences
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
                    // Si la section "skills" est visible, on anime les barres.
                    if (entry.target.id === 'skills') {
                        animateSkillBars();
                    }
                } else {
                    // Optionnel : réinitialise l'animation quand l'élément n'est plus visible
                    // entry.target.classList.remove('show-animate');
                }
            });
        }, {
            threshold: 0.1 // L'animation se déclenche quand 10% de l'élément est visible
        });

        sectionsToAnimate.forEach(sec => observer.observe(sec));
    }

    /**
     * Initialise l'animation de machine à écrire pour le titre dynamique.
     */
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

    /**
     * Configure et anime le fond de particules interactif avec le canvas.
     */
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
                       about<br>
                       skills<br>
                       projects<br>
                       contact<br>
                       clear`,
            'about': "Je suis Mohamed MAHROUCH, un développeur Fullstack et étudiant en cycle d'ingénieur. Passionné par la résolution de problèmes et la création d'applications web performantes.",
            'skills': "Mes compétences incluent :<br>- Langages : Golang, Java, Python, JavaScript/TypeScript<br>- Backend : NestJS, Gin, Laravel<br>- Frontend : React, Next.js, HTML5, CSS3<br>- Bases de données : PostgreSQL, MySQL<br>- Outils : Docker, Git, Postman",
            'projects': "Vous pouvez voir mes projets dans la section dédiée. Quelques exemples notables incluent un système de gestion de location et ce portfolio lui-même !",
            'contact': "Vous pouvez me contacter via le formulaire ou directement par email à : <a href='mailto:votre.email@example.com' class='info'>votre.email@example.com</a>",
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

/*===== MENU SHOW/HIDE =====*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId);
    const nav = document.getElementById(navId);

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show');
        });
    }
};
showMenu('nav-toggle', 'nav-menu');

/*===== REMOVE MENU MOBILE =====*/
const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollDown = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');
        const sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            sectionsClass.classList.add('active-link');
        } else {
            sectionsClass.classList.remove('active-link');
        }
    });
};
window.addEventListener('scroll', scrollActive);

/*===== THEME TOGGLE =====*/
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Charger le thème sauvegardé (si disponible)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('bx-moon');
    themeIcon.classList.add('bx-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('bx-moon');
        themeIcon.classList.add('bx-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('bx-sun');
        themeIcon.classList.add('bx-moon');
        localStorage.setItem('theme', 'light');
    }
});

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 2000,
    reset: false
});

sr.reveal('.hero__content', { delay: 100 });
sr.reveal('.hero__image', { delay: 300, origin: 'right' });
sr.reveal('.section-title', { delay: 100 });
sr.reveal('.about__img', { delay: 200, origin: 'left' });
sr.reveal('.about__content', { delay: 300, origin: 'right' });
sr.reveal('.skill-card', { interval: 200 });
sr.reveal('.project-card', { interval: 200 });
sr.reveal('.contact__form', { delay: 200 });

/*===== FORM SUBMISSION =====*/
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Récupérer les valeurs du formulaire
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Ici vous pouvez ajouter votre logique d'envoi (EmailJS, FormSpree, etc.)
        console.log('Formulaire soumis:', { name, email, subject, message });

        // Message de succès
        alert('Message envoyé avec succès! Je vous répondrai bientôt.');

        // Réinitialiser le formulaire
        contactForm.reset();
    });
}

/*===== HEADER SCROLL EFFECT =====*/
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY >= 80) {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
    }
});

/*===== TYPING EFFECT (OPTIONNEL) =====*/
// Effet de texte qui s'écrit tout seul
const typingText = document.querySelector('.hero__title span');
if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    // Démarrer l'effet après un petit délai
    setTimeout(typeWriter, 500);
}

/*===== SMOOTH SCROLL FOR SAFARI =====*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/*===== LAZY LOADING IMAGES =====*/
document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll('img');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

/*===== COUNTER ANIMATION FOR STATS =====*/
const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16); // 60 FPS

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// Observer pour démarrer l'animation quand visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h4');
            const targetValue = parseInt(statNumber.textContent);
            animateCounter(statNumber, targetValue);
            statsObserver.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.info-box').forEach(box => {
    statsObserver.observe(box);
});

/*===== CONSOLE MESSAGE =====*/
console.log('%c👋 Salut! Bienvenue sur mon portfolio', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%c💼 N\'hésitez pas à me contacter!', 'color: #8b5cf6; font-size: 14px;');
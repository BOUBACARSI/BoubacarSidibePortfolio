/*===== MENU MOBILE SHOW/HIDE =====*/
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

/*===== NAV DROPDOWN (clic sur mobile, survol sur desktop) =====*/
const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
dropdownItems.forEach(item => {
    const dropdownLink = item.querySelector('.nav__link--dropdown');
    if (dropdownLink) {
        dropdownLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 968) {
                e.preventDefault();
                item.classList.toggle('mobile-open');
            }
        });
    }
});

/*===== FERMER LE MENU MOBILE AU CLIC SUR UN LIEN =====*/
const navLink = document.querySelectorAll('.nav__link:not(.nav__link--dropdown), .nav__dropdown-link');

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

        if (sectionsClass) {
            if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active-link');
            } else {
                sectionsClass.classList.remove('active-link');
            }
        }
    });
};
window.addEventListener('scroll', scrollActive);

/*===== THEME TOGGLE =====*/
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
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
}

/*===== SCROLL REVEAL — animations d'entrée sobres =====*/
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '40px',
        duration: 700,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
        reset: false
    });

    sr.reveal('.hero__content', { origin: 'left', distance: '30px', delay: 100 });
    sr.reveal('.hero__image', { origin: 'right', distance: '30px', delay: 250 });
    sr.reveal('.section-title', { delay: 50 });
    sr.reveal('.about__img', { origin: 'left', delay: 100 });
    sr.reveal('.about__content', { origin: 'right', delay: 200 });
    sr.reveal('.about__info .info-box', { interval: 120, delay: 150 });
    sr.reveal('.skill-card', { interval: 120 });
    sr.reveal('.tech-item', { interval: 40, distance: '15px' });
    sr.reveal('.project-card', { interval: 100 });
    sr.reveal('.projects__more', { delay: 100 });
    sr.reveal('.experience__item', { interval: 120 });
    sr.reveal('.certification__item', { interval: 100 });
    sr.reveal('.leadership__item', { interval: 120 });
    sr.reveal('.contact__form', { delay: 100 });
}

/*===== COMPTEURS ANIMÉS (stats About) =====*/
const animateCounter = (element, target, duration = 1400) => {
    const suffix = element.textContent.replace(/[0-9]/g, ''); // garde "+" ou autre
    let current = 0;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, stepTime);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h4');
            if (statNumber && !statNumber.dataset.animated) {
                statNumber.dataset.animated = 'true';
                const targetValue = parseInt(statNumber.textContent, 10);
                animateCounter(statNumber, targetValue);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.info-box').forEach(box => {
    statsObserver.observe(box);
});

/*===== FORMULAIRE DE CONTACT (Formspree) =====*/
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<i class='bx bx-loader-alt'></i> Envoi en cours...";

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                alert('Message envoyé avec succès ! Je vous répondrai bientôt.');
                contactForm.reset();
            } else {
                const data = await response.json().catch(() => null);
                const errorMsg = data && data.errors
                    ? data.errors.map(err => err.message).join(', ')
                    : "Une erreur est survenue lors de l'envoi.";
                alert(errorMsg + " Vous pouvez aussi m'écrire directement à elabubakr1161@gmail.com.");
            }
        } catch (error) {
            alert("Impossible d'envoyer le message pour le moment. Merci de m'écrire directement à elabubakr1161@gmail.com.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
}

/*===== HEADER : ombre au scroll =====*/
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY >= 80) {
            header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        }
    }
});

/*===== SMOOTH SCROLL (fallback Safari) =====*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId.length > 1) {
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});
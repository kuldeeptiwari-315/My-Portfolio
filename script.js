document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Smooth scroll enhancement
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Navigation active state
    const navLinks = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
    const sectionMap = navLinks
        .map(link => {
            const target = document.querySelector(link.getAttribute('href'));
            return target ? { link, target } : null;
        })
        .filter(Boolean);

    const setActiveLink = (id) => {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    };

    // Intersection Observer for sections
    if ('IntersectionObserver' in window && sectionMap.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                    entry.target.classList.add('revealed');
                    entry.target.classList.remove('is-hidden');
                }
            });
        }, {
            rootMargin: '-45% 0px -45% 0px',
            threshold: 0
        });

        sectionMap.forEach(({ target }) => {
            target.classList.add('is-hidden');
            observer.observe(target);
        });
    } else {
        const onScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight / 3;
            let currentId = '';
            sectionMap.forEach(({ target }) => {
                const top = target.offsetTop;
                if (scrollPos >= top) {
                    currentId = target.id;
                    target.classList.add('revealed');
                    target.classList.remove('is-hidden');
                }
            });
            if (currentId) {
                setActiveLink(currentId);
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // Hero scroll effect
    const hero = document.querySelector('.hero');
    if (hero) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 100) {
                hero.classList.add('hero--scrolled');
            } else {
                hero.classList.remove('hero--scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // Add reveal animation to panels on load
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, index) => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(30px)';
        setTimeout(() => {
            panel.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });

    // Form submission enhancement
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send message';
                }, 3000);
            }
        });
    }

    // Add parallax effect to hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before, .hero::after');
        if (parallaxElements.length > 0) {
            document.documentElement.style.setProperty('--scroll', scrolled + 'px');
        }
    }, { passive: true });
});


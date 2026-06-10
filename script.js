document.addEventListener('DOMContentLoaded', () => {
    // 1. Mouse Spotlight Tracker Effect
    const mouseGlow = document.getElementById('mouseGlow');
    
    document.addEventListener('mousemove', (e) => {
        // Set variables to match cursor viewport coordinate
        mouseGlow.style.setProperty('--x', `${e.clientX}px`);
        mouseGlow.style.setProperty('--y', `${e.clientY}px`);
    });

    // 2. Typing Text Animation Effect
    const typingSpan = document.getElementById('typingText');
    const wordsList = ["Full-Stack Developer", "UI/UX Innovator", "React Specialist", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;

    function typeEffect() {
        const currentWord = wordsList[wordIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 40; // Erase faster
        } else {
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 120; // Write standard
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingDelay = 2000; // Pause when complete
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % wordsList.length;
            typingDelay = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingDelay);
    }
    
    // Start typing loop
    if (typingSpan) {
        typeEffect();
    }

    // 3. Mobile Header & Toggle Navbar Menu
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.main-header');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Close menu when clicking link items
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // Shrink header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Scroll Active Navigation Link Highlight
    const sections = document.querySelectorAll('section');
    
    const navScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -70% 0px' // Trigger active state when section is centered
    });

    sections.forEach(section => {
        navScrollObserver.observe(section);
    });

    // 5. Scroll Triggered Animated Skill Bars
    const skillSection = document.getElementById('skills');
    const progressFills = document.querySelectorAll('.progress-bar-fill');
    const percentageLabels = document.querySelectorAll('.skill-percentage');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate bars & labels
                progressFills.forEach((fill, index) => {
                    const targetPercent = percentageLabels[index].getAttribute('data-target');
                    fill.style.width = targetPercent;
                    
                    // Increment percentage counter animation
                    animateCounter(percentageLabels[index], parseInt(targetPercent));
                });
                
                // Stop observing after firing once
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    if (skillSection) {
        skillObserver.observe(skillSection);
    }

    function animateCounter(element, targetValue) {
        let currentValue = 0;
        const speed = targetValue / 40; // speed of counts
        
        const counterInterval = setInterval(() => {
            currentValue += speed;
            if (currentValue >= targetValue) {
                element.textContent = targetValue + '%';
                clearInterval(counterInterval);
            } else {
                element.textContent = Math.floor(currentValue) + '%';
            }
        }, 25);
    }

    // 6. Portfolio Projects Filter Grid
    const tabButtons = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            tabButtons.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    // Trigger fade in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 7. Contact Form Handling & Live Validation
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        let isValid = true;

        // Reset error styling
        document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('error'));

        // Name Check
        if (nameInput.value.trim() === '') {
            nameInput.parentElement.classList.add('error');
            isValid = false;
        }

        // Email Check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.parentElement.classList.add('error');
            isValid = false;
        }

        // Message Check
        if (messageInput.value.trim() === '') {
            messageInput.parentElement.classList.add('error');
            isValid = false;
        }

        if (isValid) {
            // Loading State
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Sending...</span><svg class="btn-icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: rotateGlow 1.5s linear infinite"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2v4"></path></svg>`;

            // Mock network delay (1.5 seconds)
            setTimeout(() => {
                // Success State handling
                showToast("Message sent successfully!");
                contactForm.reset();
                
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1500);
        }
    });

    // Live Validation feedback on typing
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.parentElement.classList.remove('error');
            }
        });
    });

    function showToast(message) {
        toastMsg.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
});
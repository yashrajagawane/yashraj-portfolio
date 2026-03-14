// DOM Elements
const cursorGlow = document.querySelector('.cursor-glow');
const navbar = document.querySelector('.navbar');

// Custom Mouse Follower Glow
if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
        // Update cursor glow position
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// Navbar scroll effect
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 15, 22, 0.9)';
            navbar.style.border = '1px solid rgba(62, 240, 209, 0.4)';
            navbar.style.boxShadow = '0 0 20px rgba(62, 240, 209, 0.15)';
        } else {
            navbar.style.background = 'rgba(10, 15, 22, 0.7)';
            navbar.style.border = '1px solid rgba(62, 240, 209, 0.2)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        }
    });
}

// Active nav link highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// Generate Mock GitHub Graph
const constructGraph = () => {
    const graphContainer = document.getElementById('contribution-graph');
    if(!graphContainer) return;
    
    // Create 156 cells (approx 3 months of data for visual)
    for (let i = 0; i < 156; i++) {
        const cell = document.createElement('div');
        cell.classList.add('graph-cell');
        
        // Random level for mock data visualization
        const rand = Math.random();
        let level = 0;
        if (rand > 0.5) level = 1;
        if (rand > 0.7) level = 2;
        if (rand > 0.85) level = 3;
        if (rand > 0.95) level = 4;
        
        if (level > 0) {
            cell.setAttribute('data-level', level);
        }
        
        graphContainer.appendChild(cell);
    }
}
constructGraph();

// Contact Form submission
const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
            btn.style.background = '#3ef0d1'; // Changed to match cyan theme
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        }, 1500);
    });
}

// Global Check before initializing Typed.js
if (typeof Typed !== 'undefined') {
    try {
        // Initialize Typed.js for Subtitle
        new Typed('.typing-text', {
            strings: ['Software Developer'], // Updated strictly to match screenshot
            typeSpeed: 50,
            backSpeed: 30,
            loop: false,
            showCursor: true,
            cursorChar: '|'
        });

        // Initialize Typed.js for Terminal
        new Typed('.typed-terminal', {
            strings: [
                'initializing portfolio system...<br>^500> loading AI projects...<br>^500> loading machine learning modules...<br>^500> <span style="color: var(--accent-primary)">developer profile ready.</span>'
            ],
            typeSpeed: 30,
            showCursor: true,
            cursorChar: '█',
            loop: false
        });
    } catch (error) {
        console.error('Error initializing Typed.js:', error);
    }
}

// Initialize TagCloud (3D Skill Sphere)
if (typeof TagCloud !== 'undefined') {
    try {
        const SkillSphereText = [
            'Python', 'Machine Learning', 'AI', 'JavaScript', 
            'Flask', 'Data Science', 'C++', 'Java',
            'OpenCV', 'React', 'HTML', 'CSS', 
            'SQL', 'Git', 'Deep Learning', 'NLP'
        ];

        var tagCloud = TagCloud('#skill-sphere', SkillSphereText, {
            radius: window.innerWidth < 768 ? 150 : 250,
            maxSpeed: 'fast',
            initSpeed: 'normal',
            direction: 135,
            keep: true
        });
    } catch (error) {
        console.error('Error initializing TagCloud:', error);
    }
}

// Initialize ScrollReveal
if (typeof ScrollReveal !== 'undefined') {
    try {
        ScrollReveal({
            reset: false,
            distance: '60px',
            duration: 2000,
            delay: 200
        });

        ScrollReveal().reveal('.section-title', { delay: 200, origin: 'top' });
        ScrollReveal().reveal('.hero-text, .about-text', { delay: 300, origin: 'left' });
        ScrollReveal().reveal('.hero-visual, .profile-card', { delay: 300, origin: 'right' });
        ScrollReveal().reveal('.skill-category, .project-card, .github-card', { delay: 200, origin: 'bottom', interval: 200 });
    } catch (error) {
        console.error('Error initializing ScrollReveal:', error);
    }
}

// Initialize tsParticles
if (typeof tsParticles !== 'undefined') {
    try {
        tsParticles.load("tsparticles", {
            fpsLimit: 60,
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    // Updated to match the new Cyan & Purple theme
                    value: ["#3ef0d1", "#a374ff", "#ffffff"] 
                },
                links: {
                    enable: true,
                    color: "#3ef0d1", // Updated link color
                    distance: 150,
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: {
                        default: "bounce"
                    }
                },
                size: {
                    value: 3,
                    random: true
                },
                opacity: {
                    value: 0.5,
                    random: true
                }
            },
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "grab"
                    },
                    onClick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        links: {
                            opacity: 0.8
                        }
                    },
                    push: {
                        quantity: 4
                    }
                }
            },
            detectRetina: true
        });
    } catch (error) {
        console.error('Error initializing tsParticles:', error);
    }
}
// DOM Elements
const cursorGlow = document.querySelector('.cursor-glow');
const navbar = document.querySelector('.navbar');

// Custom Mouse Follower Glow
document.addEventListener('mousemove', (e) => {
    // Update cursor glow position
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(17, 17, 17, 0.9)';
        navbar.style.border = '1px solid rgba(220, 38, 38, 0.25)';
        navbar.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.1)';
    } else {
        navbar.style.background = 'rgba(17, 17, 17, 0.7)';
        navbar.style.border = '1px solid rgba(220, 38, 38, 0.15)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    }
});

// Active nav link highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

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


// Contact Form submission
const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        
        // 1. Show "Sending..." with spinner
        btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // 2. Prepare Data for Web3Forms
        const formData = new FormData();
        // 🛑 IMPORTANT: Replace 'YOUR_ACCESS_KEY_HERE' with the key you got in your email!
        formData.append("access_key", "2180806b-af16-48e9-a989-ac0f8834ca0a"); 
        formData.append("name", name);
        formData.append("email", email);
        formData.append("message", message);

        // 3. Send email in the background silently
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        })
        .then(async (response) => {
            if (response.ok) {
                // Success Animation
                btn.innerHTML = '<span>Message Sent ✔</span>';
                btn.style.background = '#10b981'; 
                btn.style.borderColor = '#10b981';
                btn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
                
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.style.boxShadow = '';
                }, 3000);
            } else {
                // If something goes wrong
                btn.innerHTML = '<span>Error! Try Again</span> <i class="fas fa-times"></i>';
                btn.style.background = '#ff3b3b';
                setTimeout(() => { 
                    btn.innerHTML = originalText; 
                    btn.style.background = '';
                }, 3000);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            btn.innerHTML = '<span>Error! Try Again</span> <i class="fas fa-times"></i>';
            btn.style.background = '#ff3b3b';
            setTimeout(() => { 
                btn.innerHTML = originalText; 
                btn.style.background = '';
            }, 3000);
        });
    });
}

// Global Check before initializing Typed.js

// Global Check before initializing Typed.js
if (typeof Typed !== 'undefined') {
    // Initialize Typed.js for Subtitle (Restored looping multi-text)
    new Typed('.typing-text', {
        strings: [
            'Software Developer',
            'AI Developer',
            'Machine Learning Enthusiast'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,           // Restored loop
        backDelay: 2000,      // Added delay before deleting
        showCursor: true,
        cursorChar: '|'
    });

    // Initialize Typed.js for Terminal (Restored terminal boot sequence)
    new Typed('.typed-terminal', {
    strings: [
    'initializing portfolio system...<br>^500> loading AI projects...<br>^500> loading machine learning modules...<br>^500> <span style="color:#ff3b3b">developer profile ready.</span>'
    ],
    typeSpeed: 30,
    showCursor: true,
    cursorChar: '█',
    loop: false,

    onComplete: function(){

    setTimeout(() => {

    const inputLine = document.querySelector(".terminal-input-line");
    const inputBox = document.getElementById("terminal-input");

    if(inputLine){
    inputLine.style.display = "flex";
    }

    if(inputBox){
    inputBox.focus();
    }

    }, 300);

    }
    });
}

// Initialize TagCloud (3D Skill Sphere)
if (typeof TagCloud !== 'undefined') {
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
}

// Initialize ScrollReveal
if (typeof ScrollReveal !== 'undefined') {
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
    ScrollReveal().reveal('.experience-container', { delay: 200, origin: 'bottom', distance: '40px', duration: 1000 });
}

// Initialize tsParticles
if (typeof tsParticles !== 'undefined') {
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
                // Updated to match the new Soft Red theme
                value: ["#ef4444", "#f87171", "#ffffff"] 
            },
            links: {
                enable: true,
                color: "#ef4444", // Updated link color
                distance: 150,
                opacity: 0.15,
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
}

/* ===============================
ADVANCED TERMINAL COMMAND SYSTEM
(Command history + autocomplete)
================================ */

const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

if (terminalInput) {

const commandList = [
"github",
"instagram",
"linkedin",
"whatsapp",
"about",
"skills",
"projects",
"experience",
"contact",
"help"
];

let history = [];
let historyIndex = -1;

terminalInput.addEventListener("keydown", function(e){

/* ===============================
ENTER → RUN COMMAND
================================ */

if(e.key === "Enter"){

let command = terminalInput.value.trim().toLowerCase();

if(command === "") return;

history.push(command);
historyIndex = history.length;

terminalInput.value = "";

/* SOCIAL LINKS */

if(command === "github"){
window.open("https://github.com/yashrajagawane","_blank");
}

else if(command === "instagram"){
window.open("https://instagram.com","_blank");
}

else if(command === "linkedin"){
window.open("https://linkedin.com/in/yashrajagawane","_blank");
}

else if(command === "whatsapp"){
window.open("https://wa.me/","_blank");
}

/* SECTION NAVIGATION */

else if(command === "about"){
document.getElementById("about").scrollIntoView({behavior:"smooth"});
}

else if(command === "skills"){
document.getElementById("skills").scrollIntoView({behavior:"smooth"});
}

else if(command === "projects"){
document.getElementById("projects").scrollIntoView({behavior:"smooth"});
}

else if(command === "experience"){
document.getElementById("experience").scrollIntoView({behavior:"smooth"});
}

else if(command === "contact"){
document.getElementById("contact").scrollIntoView({behavior:"smooth"});
}

/* HELP COMMAND */

else if(command === "help"){

terminalOutput.innerHTML += `
<div>Available commands:</div>
<div>- github, instagram, linkedin, whatsapp</div>
<div>- about, skills, projects, experience, contact</div>
`;

terminalOutput.scrollTop = terminalOutput.scrollHeight;

}

/* UNKNOWN COMMAND */

else{

terminalOutput.innerHTML += `<div>command not found</div>`;

}

}

/* ===============================
ARROW UP → COMMAND HISTORY
================================ */

if(e.key === "ArrowUp"){

if(historyIndex > 0){
historyIndex--;
terminalInput.value = history[historyIndex];
}

}

/* ===============================
ARROW DOWN → COMMAND HISTORY
================================ */

if(e.key === "ArrowDown"){

if(historyIndex < history.length - 1){
historyIndex++;
terminalInput.value = history[historyIndex];
}
else{
historyIndex = history.length;
terminalInput.value = "";
}

}

/* ===============================
TAB → AUTOCOMPLETE
================================ */

if(e.key === "Tab"){

e.preventDefault();

let current = terminalInput.value.toLowerCase().trim();

if(current === "") return;

let match = commandList.find(cmd => cmd.startsWith(current));

if(match){
terminalInput.value = match;
}

}

});

}

/* ===============================
AUTO FOCUS TERMINAL WHEN CLICKED
================================ */

document.querySelector(".terminal-window")?.addEventListener("click", () => {
    terminalInput.focus();
});
// DOM Elements
const cursorGlow = document.querySelector('.cursor-glow');
const navbar = document.querySelector('.navbar');

// Custom Mouse Follower Glow
document.addEventListener('mousemove', (e) => {
    // Update cursor glow position
    if (cursorGlow) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(17, 17, 17, 0.9)';
            navbar.style.border = '1px solid rgba(220, 38, 38, 0.25)';
            navbar.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.1)';
        } else {
            navbar.style.background = 'rgba(17, 17, 17, 0.7)';
            navbar.style.border = '1px solid rgba(220, 38, 38, 0.15)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        }
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

if (contactForm) {
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

        // IMPORTANT: Replace 'YOUR_ACCESS_KEY_HERE' with the key you got in your email!
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
                btn.innerHTML = '<span>Message Sent ✓ </span>';
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
if (typeof Typed !== 'undefined') {
    // Initialize Typed.js for Subtitle
    new Typed('.typing-text', {
        strings: [
            'Software Developer',
            'Al Developer',
            'Machine Learning Enthusiast'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        backDelay: 2000,
        showCursor: true,
        cursorChar: '|'
    });

    // Initialize Typed.js for Terminal
    new Typed('.typed-terminal', {
        strings: [
            'initializing portfolio system...<br>^500> loading Al projects...<br>^500> loading machine learning modules...<br>^500> <span style="color:#ff3b3b">developer profile ready.</span>'
        ],
        typeSpeed: 30,
        showCursor: true,
        cursorChar: '_',
        loop: false,
        onComplete: function() {
            setTimeout(() => {
                const inputLine = document.querySelector(".terminal-input-line");
                const inputBox = document.getElementById("terminal-input");

                if (inputLine) {
                    inputLine.style.display = "flex";
                }
                if (inputBox) {
                    // THE FIX: Adding preventScroll: true prevents the page from jumping 
                    // back to the top when the animation finishes
                    inputBox.focus({ preventScroll: true });
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
    // Fixed syntax formatting here for proper initializaton
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
                value: ["#ef4444", "#f87171", "#ffffff"]
            },
            links: {
                enable: true,
                color: "#ef4444",
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

/* === ADVANCED TERMINAL COMMAND SYSTEM === */
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

if (terminalInput) {
    const commandList = [
        "github", "instagram", "linkedin", "whatsapp",
        "about", "skills", "projects", "experience", "contact", "help"
    ];

    let history = [];
    let historyIndex = -1;

    terminalInput.addEventListener("keydown", function(e) {
        /* ENTER → RUN COMMAND */
        if (e.key === "Enter") {
            let command = terminalInput.value.trim().toLowerCase();
            if (command === "") return;

            history.push(command);
            historyIndex = history.length;
            terminalInput.value = "";

            /* SOCIAL LINKS */
            if (command === "github") {
                window.open("https://github.com/yashrajagawane", "_blank");
            } else if (command === "instagram") {
                window.open("https://instagram.com", "_blank");
            } else if (command === "linkedin") {
                window.open("https://linkedin.com/in/yashrajagawane", "_blank");
            } else if (command === "whatsapp") {
                window.open("https://wa.me/", "_blank");
            }
            /* SECTION NAVIGATION */
            else if (command === "about") {
                document.getElementById("about").scrollIntoView({ behavior: "smooth" });
            } else if (command === "skills") {
                document.getElementById("skills").scrollIntoView({ behavior: "smooth" });
            } else if (command === "projects") {
                document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
            } else if (command === "experience") {
                document.getElementById("experience").scrollIntoView({ behavior: "smooth" });
            } else if (command === "contact") {
                document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
            }
            /* HELP COMMAND */
            else if (command === "help") {
                terminalOutput.innerHTML += `
                    <div>Available commands:</div>
                    <div>- github, instagram, linkedin, whatsapp</div>
                    <div>- about, skills, projects, experience, contact</div>`;
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
            /* UNKNOWN COMMAND */
            else {
                terminalOutput.innerHTML += '<div>command not found</div>';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        }

        /* ARROW UP COMMAND HISTORY */
        if (e.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = history[historyIndex];
            }
        }

        /* ARROW DOWN COMMAND HISTORY */
        if (e.key === "ArrowDown") {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                terminalInput.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                terminalInput.value = "";
            }
        }

        /* TAB AUTOCOMPLETE */
        if (e.key === "Tab") {
            e.preventDefault();
            let current = terminalInput.value.toLowerCase().trim();
            if (current === "") return;
            let match = commandList.find(cmd => cmd.startsWith(current));
            if (match) {
                terminalInput.value = match;
            }
        }
    });
}

/* AUTO FOCUS TERMINAL WHEN CLICKED */
document.querySelector(".terminal-window")?.addEventListener("click", () => {
    // Also adding preventScroll here to ensure smooth usage
    terminalInput.focus({ preventScroll: true });
});

/* === PORTFOLIO CHATBOT WIDGET === */
const chatbot = document.querySelector('.chatbot');
const chatbotLauncher = document.querySelector('.chatbot-launcher');
const chatbotPanel = document.querySelector('.chatbot-panel');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotClear = document.querySelector('.chatbot-clear');
const chatbotMessages = document.querySelector('.chatbot-messages');
const chatbotForm = document.querySelector('.chatbot-form');
const chatbotInput = document.querySelector('#chatbot-input');
const chatbotSend = document.querySelector('.chatbot-send');
const chatbotQuickActions = document.querySelector('.chatbot-quick-actions');
const chatbotCta = document.querySelector('.chatbot-cta');
const chatbotExpand = document.querySelector('.chatbot-expand');
const chatbotInfo = document.querySelector('.chatbot-info');
const chatbotAbout = document.querySelector('.chatbot-about');

if (chatbot && chatbotLauncher && chatbotPanel && chatbotMessages && chatbotForm && chatbotInput) {
    const storageKey = 'yashraj-portfolio-assistant-history';
    const projectCards = [...document.querySelectorAll('#projects .modern-project-card')].map(card => ({
        name: card.querySelector('h3')?.textContent.trim(),
        summary: card.querySelector('.project-header p')?.textContent.replace(/\s+/g, ' ').trim(),
        technologies: [...card.querySelectorAll('.tech-tag')].map(tag => tag.textContent.replace(/\s+/g, ' ').trim()),
        links: [...card.querySelectorAll('.project-links a')].map(link => ({ label: link.textContent.replace(/\s+/g, ' ').trim(), href: link.href }))
    })).filter(project => project.name);
    let isChatbotBusy = false;
    let activeChatController = null;
    let lastQuestion = '';

    const saveHistory = () => {
        const messages = [...chatbotMessages.querySelectorAll('.chatbot-message:not(.chatbot-message-loading)')]
            .map(message => ({ text: message.dataset.rawText || message.textContent, role: message.dataset.role }))
            .slice(-30);
        try { localStorage.setItem(storageKey, JSON.stringify(messages)); } catch (error) { void error; }
    };

    const renderAssistantMarkdown = (message, text) => {
        const fragment = document.createDocumentFragment();
        const inlinePattern = /(\*\*[^*]+\*\*|__[^_]+__|\[([^\]]+)\]\((https?:\/\/[^\s)]+|#[^\s)]+|mailto:[^\s)]+)\))/g;
        text.split('\n').forEach((line, index) => {
            if (index > 0) fragment.appendChild(document.createElement('br'));
            const lineContainer = document.createElement('span');
            lineContainer.className = 'chatbot-markdown-line';
            const isBullet = /^\s*[-*]\s+/.test(line);
            const content = isBullet ? line.replace(/^\s*[-*]\s+/, '') : line;
            if (isBullet) {
                const bullet = document.createElement('span');
                bullet.className = 'chatbot-markdown-bullet';
                bullet.textContent = '•';
                lineContainer.appendChild(bullet);
            }
            let cursor = 0;
            content.replace(inlinePattern, (match, token, linkText, href, offset) => {
                lineContainer.appendChild(document.createTextNode(content.slice(cursor, offset)));
                if (token.startsWith('**') || token.startsWith('__')) {
                    const strong = document.createElement('strong');
                    strong.textContent = token.slice(2, -2);
                    lineContainer.appendChild(strong);
                } else {
                    const link = document.createElement('a');
                    link.href = href;
                    link.textContent = linkText;
                    if (/^https?:/.test(href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
                    lineContainer.appendChild(link);
                }
                cursor = offset + match.length;
                return match;
            });
            lineContainer.appendChild(document.createTextNode(content.slice(cursor)));
            fragment.appendChild(lineContainer);
        });
        message.replaceChildren(fragment);
        message.dataset.rawText = text;
    };

    const addChatMessage = (text, role, temporary = false, persist = true) => {
        const message = document.createElement('div');
        message.className = `chatbot-message chatbot-message-${role}${temporary ? ' chatbot-message-loading' : ''}`;
        message.dataset.role = role;
        message.setAttribute('role', role === 'assistant' ? 'status' : 'article');
        message.setAttribute('aria-label', role === 'user' ? 'Your message' : 'Assistant message');
        if (role === 'assistant') renderAssistantMarkdown(message, text);
        else message.textContent = text;
        message.dataset.rawText = text;
        chatbotMessages.appendChild(message);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        if (persist && !temporary) saveHistory();
        return message;
    };

    const existingLink = (selector) => document.querySelector(selector)?.href || '';

    const renderCta = (question) => {
        if (!chatbotCta) return;
        chatbotCta.replaceChildren();
        const query = question.toLowerCase();
        const actions = [];
        if (/project|built|work|ai\/ml|full stack/.test(query)) actions.push({ label: 'View Projects →', href: '#projects', className: 'chatbot-cta-primary' });
        if (/skill|technology|tech stack/.test(query)) actions.push({ label: 'View Skills →', href: '#skills' });
        if (/experience|hire|intern|collab/.test(query)) actions.push({ label: 'View Experience →', href: '#experience' });
        if (/resume|cv/.test(query)) {
            const resume = existingLink('a[href*="resume"], a[download]');
            if (resume) actions.push({ label: 'Download Resume ↓', href: resume });
        }
        if (/github/.test(query)) actions.push({ label: 'View GitHub →', href: existingLink('a[href="https://github.com/yashrajagawane"]') });
        if (/linkedin/.test(query)) actions.push({ label: 'View LinkedIn →', href: existingLink('a[href*="linkedin.com"]') });
        if (/contact|email|reach/.test(query)) actions.push({ label: 'Contact Yashraj →', href: '#contact' });
        actions.filter(action => action.href).slice(0, 2).forEach(action => {
            const link = document.createElement('a');
            link.className = `chatbot-cta-link ${action.className || ''}`;
            link.href = action.href;
            link.textContent = action.label;
            if (/^https?:/.test(action.href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
            chatbotCta.appendChild(link);
        });
    };

    const renderProjectCards = (question) => {
        if (!/project|built|work|ai\/ml|full stack/.test(question.toLowerCase()) || !projectCards.length) return;
        const query = question.toLowerCase();
        const selected = projectCards.filter(project => query.includes(project.name.toLowerCase().split(' – ')[0])).slice(0, 1);
        const cards = selected.length ? selected : projectCards.slice(0, 3);
        cards.forEach(project => {
            const card = document.createElement('article');
            card.className = 'chatbot-project-card';
            const title = document.createElement('h3'); title.textContent = `🚀 ${project.name}`;
            const summary = document.createElement('p'); summary.textContent = project.summary;
            const tech = document.createElement('p'); tech.className = 'chatbot-project-tech'; tech.textContent = project.technologies.join(' · ');
            const links = document.createElement('div'); links.className = 'chatbot-project-links';
            project.links.forEach(item => {
                const link = document.createElement('a'); link.href = item.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = item.label.includes('GitHub') ? 'GitHub →' : 'View Project →';
                links.appendChild(link);
            });
            card.append(title, summary, tech, links);
            chatbotMessages.appendChild(card);
        });
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const setChatbotOpen = (open) => {
        chatbotPanel.hidden = !open;
        chatbotLauncher.setAttribute('aria-expanded', String(open));
        chatbotLauncher.setAttribute('aria-label', open ? 'Close portfolio assistant' : 'Open portfolio assistant');
        chatbot.classList.toggle('is-open', open);
        document.body.classList.toggle('chatbot-open', open);
        if (open) {
            window.setTimeout(() => chatbotInput.focus({ preventScroll: true }), 50);
        } else {
            chatbotLauncher.focus({ preventScroll: true });
        }
    };

    const setChatbotBusy = (busy) => {
        isChatbotBusy = busy;
        chatbotInput.disabled = busy;
        chatbotSend.disabled = busy;
        chatbot.querySelectorAll('[data-chat-question]').forEach(button => { button.disabled = busy; });
        chatbot.classList.toggle('is-busy', busy);
    };

    const sendChatMessage = async (messageText) => {
        const message = messageText.trim();
        if (!message || isChatbotBusy) return;

        addChatMessage(message, 'user');
        chatbot.classList.add('has-conversation');
        lastQuestion = message;
        const isProjectQuestion = /project|built|work|ai\/ml|full stack/.test(message.toLowerCase());
        chatbotInput.value = '';
        chatbotInput.style.height = 'auto';
        const loadingMessage = addChatMessage('Thinking...', 'assistant', true);
        setChatbotBusy(true);
        activeChatController = new AbortController();

        try {
            const response = await fetch('/api/chat?stream=1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
                signal: activeChatController.signal
            });
            if (!response.ok || !response.body) {
                const payload = await response.json().catch(() => null);
                throw new Error(payload?.error?.message || 'The assistant is temporarily unavailable.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let streamError = '';
            let hasStreamText = false;
            const consumeEvent = (event) => {
                const data = event.split('\n')
                    .filter(line => line.startsWith('data:'))
                    .map(line => line.slice(5).trim())
                    .join('\n');
                if (!data) return;
                const payload = JSON.parse(data);
                if (event.startsWith('event: error')) streamError = payload.message;
                if (event.startsWith('event: token')) {
                    if (isProjectQuestion) return;
                    if (!hasStreamText) {
                        renderAssistantMarkdown(loadingMessage, '');
                        hasStreamText = true;
                    }
                    loadingMessage.classList.remove('chatbot-message-loading');
                    renderAssistantMarkdown(loadingMessage, (loadingMessage.dataset.rawText || '') + (payload.text || ''));
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }
            };
            while (true) {
                const { done, value } = await reader.read();
                buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
                const events = buffer.split('\n\n');
                buffer = events.pop() || '';
                events.forEach(consumeEvent);
                if (done) break;
            }
            if (buffer.trim()) consumeEvent(buffer);
            if (streamError) throw new Error(streamError);
            if (isProjectQuestion) {
                renderAssistantMarkdown(loadingMessage, 'Here are a few projects from Yashraj\'s portfolio:');
                loadingMessage.classList.remove('chatbot-message-loading');
            }
            if (!loadingMessage.textContent.trim() || loadingMessage.textContent === 'Thinking...') throw new Error('The assistant did not return a response.');
            loadingMessage.classList.remove('chatbot-message-loading');
            renderProjectCards(lastQuestion);
            renderCta(lastQuestion);
            saveHistory();
        } catch (error) {
            loadingMessage.remove();
            if (error.name === 'AbortError') return;
            addChatMessage(error.message || 'The assistant is temporarily unavailable. Please try again.', 'error');
        } finally {
            activeChatController = null;
            setChatbotBusy(false);
            chatbotInput.focus({ preventScroll: true });
        }
    };

    chatbotLauncher.addEventListener('click', () => setChatbotOpen(chatbotPanel.hidden));
    chatbotClose?.addEventListener('click', () => {
        activeChatController?.abort();
        setChatbotOpen(false);
    });
    chatbotClear?.addEventListener('click', () => {
        chatbotMessages.querySelectorAll('.chatbot-message, .chatbot-project-card').forEach(message => message.remove());
        chatbot.classList.remove('has-conversation');
        chatbotCta?.replaceChildren();
        try { localStorage.removeItem(storageKey); } catch (error) { void error; }
        chatbotInput.focus({ preventScroll: true });
    });

    chatbotForm.addEventListener('submit', (event) => {
        event.preventDefault();
        sendChatMessage(chatbotInput.value);
    });

    chatbotInput.addEventListener('input', () => {
        chatbotInput.style.height = 'auto';
        chatbotInput.style.height = `${Math.min(chatbotInput.scrollHeight, 120)}px`;
    });

    chatbotInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            chatbotForm.requestSubmit();
        }
    });

    try {
        const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
        history.forEach(item => addChatMessage(item.text, item.role, false, false));
    } catch (error) { void error; }
    chatbotQuickActions?.querySelectorAll('button').forEach(button => button.addEventListener('click', () => sendChatMessage(button.dataset.chatQuestion || '')));
    if (chatbotMessages.querySelector('.chatbot-message')) chatbot.classList.add('has-conversation');

    chatbotExpand?.addEventListener('click', () => {
        const expanded = chatbot.classList.toggle('is-expanded');
        chatbotExpand.setAttribute('aria-pressed', String(expanded));
        chatbotExpand.setAttribute('aria-label', expanded ? 'Reduce assistant' : 'Expand assistant');
        chatbotExpand.setAttribute('title', expanded ? 'Reduce assistant' : 'Expand assistant');
        const icon = chatbotExpand.querySelector('i');
        icon?.classList.toggle('fa-expand', !expanded);
        icon?.classList.toggle('fa-compress', expanded);
    });

    chatbotInfo?.addEventListener('click', () => {
        const expanded = chatbotInfo.getAttribute('aria-expanded') === 'true';
        chatbotInfo.setAttribute('aria-expanded', String(!expanded));
        if (chatbotAbout) chatbotAbout.hidden = expanded;
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !chatbotPanel.hidden) setChatbotOpen(false);
    });
}

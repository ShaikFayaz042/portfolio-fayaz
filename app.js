// ==============================
// Load Skills from JSON
// ==============================
async function loadSkills() {
    try {
        const res = await fetch('skills.json');
        const skills = await res.json();
        const container = document.getElementById('skill-grid-container');
        if (!container) return;

        container.innerHTML = skills.map(skill => `
            <div class="skill-card">
                <div class="skill-top">
                    <span class="skill-name"><i class="fa-brands ${skill.icon}"></i> ${skill.name}</span>
                    <span class="skill-pct">${skill.percent}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="--pct: ${skill.percent}%"></div>
                </div>
            </div>
        `).join('');

        // Attach progress bar animation observer to newly created skill cards
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const fill = e.target.querySelector('.progress-fill');
                    if (fill) {
                        fill.style.width = fill.style.getPropertyValue('--pct') || getComputedStyle(fill).getPropertyValue('--pct');
                        fill.classList.add('animate');
                    }
                    skillObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.4 });

        document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

    } catch (err) {
        console.error('Skills load error:', err);
        const container = document.getElementById('skill-grid-container');
        if (container) container.innerHTML = '<p style="color:red">Failed to load skills.</p>';
    }
}

// ==============================
// Load Projects from JSON
// ==============================
async function loadProjects() {
    try {
        const res = await fetch('projects.json');
        const projects = await res.json();
        const container = document.getElementById('project-grid-container');
        if (!container) return;

        container.innerHTML = projects.map(proj => `
            <div class="project-card" data-category="${proj.category}">
                <div class="project-img" style="background-image: url('${proj.image}')"></div>
                <div class="project-info">
                    <h4>${proj.title}</h4>
                    <p class="project-stack">${proj.stack}</p>
                    <div class="project-links">
                        <a href="${proj.live}" class="btn-live" target="_blank" rel="noopener">Live Demo</a>
                        <a href="${proj.code}" class="btn-code" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>
                    </div>
                </div>
            </div>
        `).join('');

        attachFilterListeners();

    } catch (err) {
        console.error('Projects load error:', err);
        const container = document.getElementById('project-grid-container');
        if (container) container.innerHTML = '<p style="color:red">Failed to load projects.</p>';
    }
}

// ==============================
// Filter logic (used after dynamic project load)
// ==============================
function attachFilterListeners() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        // Remove any existing listener to avoid duplicates
        btn.removeEventListener('click', btn._listener);
        const handler = () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.project-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        };
        btn.addEventListener('click', handler);
        btn._listener = handler;
    });
}

// ==============================
// EmailJS Initialize
// ==============================
emailjs.init("JJ0qKOHKBuhAP6-8X");

// ==============================
// Hamburger Menu
// ==============================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });
}

// ==============================
// Sticky Navbar
// ==============================
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ==============================
// Scroll Reveal (for all sections & cards)
// ==============================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.12 });

document.querySelectorAll('section, .project-card, .skill-card, .stat-card').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ==============================
// Send Email (EmailJS)
// ==============================
function sendEmail() {
    const btn = document.getElementById("send-btn");
    const status = document.getElementById("status-msg");

    const name = document.getElementById("user_name").value.trim();
    const email = document.getElementById("user_email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Empty field validation
    if (!name || !email || !message) {
        status.style.display = "block";
        status.style.color = "#f87171";
        status.textContent = "Please fill in all fields.";
        return;
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailPattern.test(email)) {
        status.style.display = "block";
        status.style.color = "#f87171";
        status.textContent = "Please enter a valid email address (e.g., name@example.com).";
        return;
    }

    // Button loading state
    btn.disabled = true;
    btn.textContent = "Sending...";

    const templateParams = {
        from_name: name,
        from_email: email,
        message: message
    };

    emailjs.send("service_email_123", "template_email_123", templateParams)
        .then(() => {
            status.style.display = "block";
            status.style.color = "#4ade80";
            status.textContent = "Message sent successfully!";

            document.getElementById("user_name").value = "";
            document.getElementById("user_email").value = "";
            document.getElementById("message").value = "";

            btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
            btn.disabled = false;

            setTimeout(() => {
                status.style.display = "none";
            }, 4000);
        })
        .catch((error) => {
            status.style.display = "block";
            status.style.color = "#f87171";
            status.textContent = "Something went wrong. Try again.";
            console.error("EmailJS Error:", error);
            btn.disabled = false;
            btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        });
}

// ==============================
// Initialize everything after DOM loads
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    loadProjects();
});
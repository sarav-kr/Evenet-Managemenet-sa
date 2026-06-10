// ======================
// Global Functions (outside DOMContentLoaded)
// ======================
function scrollServices(direction) {
    const track = document.querySelector('.services-track');
    if (!track) return;
    track.scrollBy({ left: direction * 340, behavior: 'smooth' });
}

function toggleCard(card) {
    const isExpanded = card.classList.contains('expanded');
    document.querySelectorAll('.service-card-new.expanded').forEach(c => {
        c.classList.remove('expanded');
    });
    if (!isExpanded) {
        card.classList.add('expanded');
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 100);
    }
}

function closeCard(event, btn) {
    event.stopPropagation();
    btn.closest('.service-card-new').classList.remove('expanded');
}

// ======================
// DOMContentLoaded
// ======================
document.addEventListener("DOMContentLoaded", () => {

    // ======================
    // Navbar Scroll Effect
    // ======================
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        });
    }

    // ======================
    // Mobile Menu
    // ======================
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // ======================
    // Scroll Animation Observer
    // ======================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".fade-up, .fade-in").forEach(el => observer.observe(el));

    // ======================
    // Load Services Component
    // ======================
if (document.getElementById('services-placeholder')) {
    fetch('./components/services.html')
        .then(res => {
            if (!res.ok) throw new Error('File not found');
            return res.text();
        })
        .then(html => {
            document.getElementById('services-placeholder').innerHTML = html;

            const track = document.querySelector('.services-track');
            if (!track) return;

            let isDown = false, startX, scrollLeft;

            track.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - track.offsetLeft;
                scrollLeft = track.scrollLeft;
            });
            track.addEventListener('mouseleave', () => isDown = false);
            track.addEventListener('mouseup', () => isDown = false);
            track.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - track.offsetLeft;
                track.scrollLeft = scrollLeft - (x - startX) * 1.5;
            });

            document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));
        })
        .catch(err => console.error('Could not load services section:', err));
}

    // ======================
    // Fetch Events From Backend
    // ======================
    displayEvents();

    async function displayEvents() {
        try {
            const response = await fetch("https://evenet-managemenet.onrender.com/api/events");
            const events = await response.json();

            const eventsGrid = document.getElementById("eventsGrid");
            if (!eventsGrid) return;

            eventsGrid.innerHTML = "";

            events.forEach(event => {
                const card = document.createElement("div");
                card.className = "event-card";

                card.innerHTML = `
                    <h3>${event.name}</h3>
                    <p>${event.date}</p>
                    <p>${event.location}</p>
                    <p>${event.description}</p>
                    <button onclick="window.location.href='login.html'">Send Query</button>
                `;

                eventsGrid.appendChild(card);
            });

        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }

    // ======================
    // Query Form Popup
    // ======================
    const queryForm = document.getElementById("query-form");
    const popup = document.getElementById("success-popup");
    const closePopupBtn = document.getElementById("close-popup");

    if (queryForm) {
        queryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (popup) popup.classList.add("active");
        });
    }

    if (closePopupBtn) {
        closePopupBtn.addEventListener("click", () => {
            popup.classList.remove("active");
            window.location.href = "../index.html";
        });
    }

});

// ======================
// EmailJS Query Form
// ======================
document.addEventListener("DOMContentLoaded", function () {

    if (typeof emailjs !== "undefined") {
        emailjs.init("rwS1ZnkPCGNBhjifq");
    }

    const queryForm = document.getElementById("query-form");

    if (queryForm) {
        queryForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const formData = {
                name: queryForm.querySelector('input[type="text"]').value,
                phone: queryForm.querySelector('input[type="tel"]').value,
                event: queryForm.querySelector('select').value,
                date: queryForm.querySelector('input[type="date"]').value,
                city: queryForm.querySelectorAll('input[type="text"]')[1].value,
                guests: queryForm.querySelector('input[type="number"]').value,
                budget: queryForm.querySelectorAll('select')[1].value,
                message: queryForm.querySelector('textarea').value,
                email: "customer@email.com"
            };

            emailjs.send("service_3qtjq9x", "template_g9kz96t", formData)
                .then(function () {
                    alert("Query submitted successfully!");
                    window.location.href = "../index.html";
                }, function (error) {
                    alert("Failed to send query.");
                    console.log(error);
                });
        });
    }

});
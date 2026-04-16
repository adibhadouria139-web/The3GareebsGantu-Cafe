const doctorData = [
  {
    name: "Dr. Aisha Rahman",
    dept: "Cardiology",
    experience: "14 years",
    availability: "Mon, Wed, Fri",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Dr. David Morgan",
    dept: "Neurology",
    experience: "11 years",
    availability: "Tue, Thu",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Dr. Priya Nair",
    dept: "Pediatrics",
    experience: "10 years",
    availability: "Mon - Sat",
    image: "https://images.unsplash.com/photo-1594824475317-8f3f3275d4f7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Dr. Lucas Bennett",
    dept: "Orthopedics",
    experience: "16 years",
    availability: "Mon, Tue, Thu",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Dr. Sara Collins",
    dept: "Emergency Care",
    experience: "9 years",
    availability: "24/7 Rotation",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=900&q=80"
  }
];

const departments = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Emergency Care"];

function initCommon() {
  const nav = document.querySelector("#nav");
  if (nav) {
    const current = document.body.dataset.page || "home";
    nav.innerHTML = `
      <header>
        <div class="container navbar">
          <a class="brand" href="index.html" aria-label="Lifeline Care Hospital home">Lifeline Care Hospital</a>
          <button class="menu-toggle" aria-label="Open menu">☰</button>
          <nav class="nav-links" aria-label="Main navigation">
            <a href="index.html" ${current === "home" ? 'aria-current="page"' : ""}>Home</a>
            <a href="about.html" ${current === "about" ? 'aria-current="page"' : ""}>About</a>
            <a href="services.html" ${current === "services" ? 'aria-current="page"' : ""}>Services</a>
            <a href="doctors.html" ${current === "doctors" ? 'aria-current="page"' : ""}>Doctors</a>
            <a href="appointment.html" ${current === "appointment" ? 'aria-current="page"' : ""}>Appointments</a>
            <a href="contact.html" ${current === "contact" ? 'aria-current="page"' : ""}>Contact</a>
          </nav>
        </div>
      </header>`;

    nav.querySelector(".menu-toggle")?.addEventListener("click", () => {
      nav.querySelector(".nav-links")?.classList.toggle("open");
    });
  }

  const footer = document.querySelector("#footer");
  if (footer) {
    footer.innerHTML = `
      <footer>
        <div class="container footer-inner">
          <span>© ${new Date().getFullYear()} Lifeline Care Hospital. Compassion. Precision. Trust.</span>
          <span>Emergency Hotline: <strong>+1 (800) 911-CARE</strong></span>
        </div>
      </footer>`;
  }

  const bot = document.querySelector("#chatbot");
  if (bot) {
    bot.innerHTML = `
      <div class="chatbot" aria-live="polite">
        <button class="chatbot-toggle" aria-label="Open patient assistant">💬</button>
        <div class="chat-panel">
          <div class="chat-header">Patient Assistant</div>
          <div class="chat-body">
            <p>Hello! How can we help today?</p>
            <ul>
              <li>Book an appointment</li>
              <li>Emergency services</li>
              <li>Find a specialist</li>
            </ul>
          </div>
        </div>
      </div>`;

    const toggle = bot.querySelector(".chatbot-toggle");
    const panel = bot.querySelector(".chat-panel");
    toggle?.addEventListener("click", () => {
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
  }
}

function mountDoctors(containerId = "doctor-grid") {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = doctorData
    .map(
      (doctor) => `
      <article class="doctor-card" data-dept="${doctor.dept}">
        <img src="${doctor.image}" alt="${doctor.name}, ${doctor.dept} specialist" loading="lazy" />
        <h3>${doctor.name}</h3>
        <p><strong>Specialization:</strong> ${doctor.dept}</p>
        <p><strong>Experience:</strong> ${doctor.experience}</p>
        <p><strong>Availability:</strong> ${doctor.availability}</p>
      </article>`
    )
    .join("");
}

function setupDoctorFilters() {
  const wrap = document.getElementById("doctor-filters");
  if (!wrap) return;

  const options = ["All", ...departments];
  wrap.innerHTML = options
    .map(
      (opt, idx) =>
        `<button class="filter-btn ${idx === 0 ? "active" : ""}" data-filter="${opt}">${opt}</button>`
    )
    .join("");

  wrap.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selected = btn.dataset.filter;
      document.querySelectorAll(".doctor-card").forEach((card) => {
        const show = selected === "All" || card.dataset.dept === selected;
        card.style.display = show ? "block" : "none";
      });
    });
  });
}

function setupDepartmentAndDoctorFields() {
  const depSelect = document.getElementById("department");
  const doctorSelect = document.getElementById("doctor");
  if (!depSelect || !doctorSelect) return;

  depSelect.innerHTML = `<option value="">Choose Department</option>${departments
    .map((d) => `<option value="${d}">${d}</option>`)
    .join("")}`;

  const fillDoctors = (department) => {
    const filtered = doctorData.filter((d) => !department || d.dept === department);
    doctorSelect.innerHTML = `<option value="">Choose Doctor</option>${filtered
      .map((d) => `<option value="${d.name}">${d.name}</option>`)
      .join("")}`;
  };

  depSelect.addEventListener("change", () => fillDoctors(depSelect.value));
  fillDoctors();
}

function setupForms() {
  document.querySelectorAll("form[data-api-ready='true']").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const msg = form.parentElement.querySelector(".notice");
      if (msg) msg.style.display = "block";
      form.reset();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCommon();
  mountDoctors();
  setupDoctorFilters();
  setupDepartmentAndDoctorFields();
  setupForms();
});

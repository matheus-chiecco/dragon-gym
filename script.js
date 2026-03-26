const burger = document.getElementById("burger");
const nav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link");
const topbar = document.getElementById("topbar");
const backToTop = document.getElementById("backToTop");
const sections = document.querySelectorAll("main section");
const animatedElements = document.querySelectorAll("[data-anim]");

const testimonials = document.querySelectorAll(".testimonial-card");
const prevBtn = document.getElementById("prevTestimonial");
const nextBtn = document.getElementById("nextTestimonial");

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const phoneInput = document.getElementById("telefone");

let currentTestimonial = 0;
let testimonialInterval;

function toggleMobileMenu() {
  if (!nav || !burger) return;

  const isOpen = nav.classList.toggle("show");
  burger.classList.toggle("active");
  burger.setAttribute("aria-expanded", String(isOpen));
}

function closeMobileMenu() {
  if (!nav || !burger) return;

  nav.classList.remove("show");
  burger.classList.remove("active");
  burger.setAttribute("aria-expanded", "false");
}

if (burger) {
  burger.addEventListener("click", toggleMobileMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    if (href && href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offset = topbar ? topbar.offsetHeight - 2 : 70;
        const top = target.offsetTop - offset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    }

    closeMobileMenu();
  });
});

function revealOnScroll() {
  animatedElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 90) {
      el.classList.add("is-visible");
    }
  });
}

function updateTopbarShadow() {
  if (!topbar) return;

  if (window.scrollY > 20) {
    topbar.classList.add("scrolled");
  } else {
    topbar.classList.remove("scrolled");
  }
}

function updateActiveNav() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

function updateBackToTop() {
  if (!backToTop) return;

  if (window.scrollY > 450) {
    backToTop.style.display = "grid";
    backToTop.style.placeItems = "center";
  } else {
    backToTop.style.display = "none";
  }
}

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function handleScroll() {
  revealOnScroll();
  updateTopbarShadow();
  updateActiveNav();
  updateBackToTop();
}

window.addEventListener("scroll", handleScroll);
window.addEventListener("load", handleScroll);
window.addEventListener("DOMContentLoaded", handleScroll);

function showTestimonial(index) {
  testimonials.forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}

function prevTestimonial() {
  currentTestimonial =
    (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
}

function startTestimonialsAutoplay() {
  stopTestimonialsAutoplay();
  testimonialInterval = setInterval(nextTestimonial, 5000);
}

function stopTestimonialsAutoplay() {
  if (testimonialInterval) {
    clearInterval(testimonialInterval);
  }
}

if (testimonials.length) {
  showTestimonial(currentTestimonial);
  startTestimonialsAutoplay();

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextTestimonial();
      startTestimonialsAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevTestimonial();
      startTestimonialsAutoplay();
    });
  }
}

function applyPhoneMask(value) {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  if (numbers.length <= 10) {
    return numbers
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numbers
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

if (phoneInput) {
  phoneInput.addEventListener("input", (e) => {
    e.target.value = applyPhoneMask(e.target.value);
  });
}

function setFieldError(field, message) {
  const parent = field.parentElement;
  const wrapper = field.closest(".form-group");
  const feedback = wrapper ? wrapper.querySelector(".feedback") : null;

  if (feedback) feedback.textContent = message;

  if (field.type === "hidden" && wrapper) {
    const trigger = wrapper.querySelector(".custom-select-trigger");
    if (trigger) trigger.style.borderColor = "#ff6f00";
  } else {
    field.style.borderColor = "#ff6f00";
  }
}

function clearFieldError(field) {
  const wrapper = field.closest(".form-group");
  const feedback = wrapper ? wrapper.querySelector(".feedback") : null;

  if (feedback) feedback.textContent = "";

  if (field.type === "hidden" && wrapper) {
    const trigger = wrapper.querySelector(".custom-select-trigger");
    if (trigger) trigger.style.borderColor = "";
  } else {
    field.style.borderColor = "";
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  const clean = phone.replace(/\D/g, "");
  return clean.length === 10 || clean.length === 11;
}

if (contactForm) {
  const fields = contactForm.querySelectorAll("input, textarea, select");

  fields.forEach((field) => {
    field.addEventListener("input", () => clearFieldError(field));
    field.addEventListener("change", () => clearFieldError(field));
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;
    formMessage.textContent = "";

    const nome = contactForm.nome;
    const email = contactForm.email;
    const telefone = contactForm.telefone;
    const plano = contactForm.plano;
    const mensagem = contactForm.mensagem;

    fields.forEach((field) => clearFieldError(field));

    if (nome.value.trim().length < 3) {
      valid = false;
      setFieldError(nome, "Digite um nome válido.");
    }

    if (!validateEmail(email.value.trim())) {
      valid = false;
      setFieldError(email, "Digite um e-mail válido.");
    }

    if (!validatePhone(telefone.value.trim())) {
      valid = false;
      setFieldError(telefone, "Digite um telefone válido.");
    }

    if (!plano.value.trim()) {
      valid = false;
      setFieldError(plano, "Selecione um plano.");
    }

    if (mensagem.value.trim().length < 8) {
      valid = false;
      setFieldError(mensagem, "Escreva uma mensagem um pouco maior.");
    }

    if (!valid) {
      formMessage.style.color = "#ff6f00";
      formMessage.textContent = "Por favor, corrija os campos destacados.";
      return;
    }

    const texto =
      `Olá, vim pelo site da Dragon Gym!%0A%0A` +
      `Plano de interesse: ${plano.value}%0A` +
      `Nome: ${nome.value.trim()}%0A` +
      `Email: ${email.value.trim()}%0A` +
      `Telefone: ${telefone.value.trim()}%0A` +
      `Mensagem: ${mensagem.value.trim()}`;

    const numero = "5513991567569";
    const urlWhats = `https://wa.me/${numero}?text=${texto}`;

    formMessage.style.color = "#f3a325";
    formMessage.textContent = "Redirecionando para o WhatsApp...";

    window.open(urlWhats, "_blank");
    contactForm.reset();
  });
}

const customPlanoSelect = document.getElementById("customPlanoSelect");
const customSelectTrigger = document.getElementById("customSelectTrigger");
const customSelectText = document.getElementById("customSelectText");
const customSelectOptions = document.getElementById("customSelectOptions");
const customOptions = document.querySelectorAll(".custom-option");
const planoInput = document.getElementById("plano");

if (customPlanoSelect && customSelectTrigger && planoInput) {
  customSelectTrigger.addEventListener("click", () => {
    customPlanoSelect.classList.toggle("open");
  });

  customOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;

      planoInput.value = value;
      customSelectText.textContent = value;
      customSelectText.classList.remove("custom-select-placeholder");

      customOptions.forEach((item) => item.classList.remove("selected"));
      option.classList.add("selected");

      customPlanoSelect.classList.remove("open");
      clearFieldError(planoInput);
    });
  });

  document.addEventListener("click", (e) => {
    if (!customPlanoSelect.contains(e.target)) {
      customPlanoSelect.classList.remove("open");
    }
  });
}

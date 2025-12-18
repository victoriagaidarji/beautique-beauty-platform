import { mastersData } from './mastersData.js'
import { servicesData } from './servicesData.js'

/* ======================
   БУРГЕР-МЕНЮ
====================== */
const burger = document.getElementById('burger');
const menu = document.querySelector('.header__menu-list');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  menu.classList.toggle('active');
});

menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    menu.classList.remove('active');
  });
});

document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !burger.contains(e.target)) {
    burger.classList.remove('active');
    menu.classList.remove('active');
  }
});

/* ======================
   МОДАЛЬНОЕ ОКНО
====================== */
const modal = document.getElementById("bookingModal");

document.querySelectorAll(".book-button").forEach(btn => {
  btn.addEventListener("click", () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  });
});

modal.addEventListener("click", e => {
  if (e.target.dataset.close !== undefined) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }
});

/* ======================
   ФОРМА ЗАПИСИ
====================== */
const serviceSelect = document.getElementById("serviceSelect");
const masterSelect = document.getElementById("masterSelect");
const extrasList = document.getElementById("extrasList");
const totalPriceEl = document.getElementById("totalPrice");
const promoInput = document.getElementById("promoInput");


/* === Placeholder'ы === */
serviceSelect.innerHTML = `
  <option value="" disabled selected>Выберите услугу</option>
`;

masterSelect.innerHTML = `
  <option value="" disabled selected>Выберите мастера</option>
`;
masterSelect.disabled = true;

/* ======================
   УСЛУГИ (ВСЕ КАТЕГОРИИ)
====================== */
servicesData.forEach(category => {
  const group = document.createElement("optgroup");
  group.label = category.category;

  category.items.forEach(item => {
    if (typeof item.price === "number") {
      const option = document.createElement("option");
      option.value = item.price;
      option.dataset.category = category.category;
      option.textContent = `${item.name} — ${item.price} руб`;
      group.append(option);
    }
  });

  serviceSelect.append(group);
});

/* ======================
   МАСТЕРА ПО УСЛУГЕ
====================== */
function renderMastersForService(categoryName) {
  masterSelect.innerHTML = `
    <option value="" disabled selected>Выберите мастера</option>
  `;

  mastersData.forEach(master => {
    if (master.categories.includes(categoryName)) {
      const option = document.createElement("option");
      option.value = master.id;
      option.textContent = `${master.name} — ${master.profession}`;
      masterSelect.append(option);
    }
  });

  calculateTotal();
}

/* === Выбор услуги === */
serviceSelect.addEventListener("change", () => {
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  const categoryName = selectedOption.dataset.category;

  if (!categoryName) return;

  masterSelect.disabled = false;
  renderMastersForService(categoryName);
});

const dateInput = document.getElementById('dateInput');

function setMinDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
}

// Проверка выбранной даты на выходные
dateInput.addEventListener('input', () => {
  const selectedDate = new Date(dateInput.value);
  const day = selectedDate.getDay(); // 0 = Воскресенье, 6 = Суббота
  if (day === 0 || day === 6) {
    alert('Пожалуйста, выберите будний день (Пн–Пт).');
    dateInput.value = '';
  }
});

setMinDate();

/* ======================
   ДОП. УСЛУГИ
====================== */
const extras = [
  { name: "Уход за кожей", price: 80 },
  { name: "Дополнительный массаж", price: 100 }
];

extras.forEach(extra => {
  const label = document.createElement("label");
  label.className = "form__checkbox";

  label.innerHTML = `
    <input type="checkbox" value="${extra.price}">
    ${extra.name} (+${extra.price} руб)
  `;

  extrasList.append(label);
});

/* ======================
   ПОДСЧЁТ СТОИМОСТИ
====================== */
function calculateTotal() {
  let total = Number(serviceSelect.value) || 0;

  extrasList.querySelectorAll("input:checked").forEach(cb => {
    total += Number(cb.value);
  });

  if (promoInput.value.trim().toUpperCase() === "BEAUTIQUE") {
    total *= 0.9;
  }

  totalPriceEl.textContent = Math.round(total);
}

serviceSelect.addEventListener("change", calculateTotal);
masterSelect.addEventListener("change", calculateTotal);
extrasList.addEventListener("change", calculateTotal);
promoInput.addEventListener("input", calculateTotal);
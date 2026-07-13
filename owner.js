const store = window.AmigosStore;
const currentDate = document.querySelector("[data-current-date]");
const menuEditor = document.querySelector("[data-menu-editor]");
const eventForm = document.querySelector("[data-event-form]");
const reservationForm = document.querySelector("[data-reservation-form]");
const eventsCalendar = document.querySelector("[data-events-calendar]");
const reservationsCalendar = document.querySelector("[data-reservations-calendar]");
const eventsList = document.querySelector("[data-events-list]");
const reservationsList = document.querySelector("[data-reservations-list]");
const menuCount = document.querySelector("[data-menu-count]");
const eventsCount = document.querySelector("[data-events-count]");
const reservationsCount = document.querySelector("[data-reservations-count]");
const copyButton = document.querySelector("[data-copy-menu-link]");
const menuLinkInput = document.querySelector("[data-menu-link]");
const copyStatus = document.querySelector("[data-copy-status]");

const monthState = {
  events: new Date(2026, 6, 1),
  reservations: new Date(2026, 6, 1),
};

const typeLabels = {
  food: "Храна",
  cocktails: "Коктейли",
  soft: "Безалкохолни",
  beer: "Бири",
  spirits: "Алкохол",
  desserts: "Десерти",
};

const colorLabels = {
  green: "Зелена",
  pink: "Корал",
  blue: "Синя",
  orange: "Оранжева",
  black: "Черна",
};

const dayNames = ["Пон", "Вто", "Сря", "Чет", "Пет", "Съб", "Нед"];

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const formatMonth = (date) =>
  new Intl.DateTimeFormat("bg-BG", { month: "long", year: "numeric" }).format(date).replace(/^./, (letter) => letter.toUpperCase());

const getDateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const renderStats = () => {
  const menu = store.getMenu();
  const events = store.getEvents();
  const reservations = store.getReservations();

  menuCount.textContent = menu.reduce((total, category) => total + category.items.length, 0);
  eventsCount.textContent = events.length;
  reservationsCount.textContent = reservations.length;
};

const renderMenuEditor = () => {
  const menu = store.getMenu();

  menuEditor.innerHTML = menu
    .map(
      (category, categoryIndex) => `
        <article class="category-editor" data-category-index="${categoryIndex}">
          <div class="category-header">
            <input type="text" value="${escapeHtml(category.title)}" aria-label="Име на категория" data-category-field="title" />
            <select aria-label="Тип категория" data-category-field="type">
              ${Object.entries(typeLabels)
                .map(([value, label]) => `<option value="${value}" ${category.type === value ? "selected" : ""}>${label}</option>`)
                .join("")}
            </select>
            <select aria-label="Цвят" data-category-field="color">
              ${Object.entries(colorLabels)
                .map(([value, label]) => `<option value="${value}" ${category.color === value ? "selected" : ""}>${label}</option>`)
                .join("")}
            </select>
            <button type="button" data-add-item="${categoryIndex}">+ Позиция</button>
            <button type="button" data-delete-category="${categoryIndex}">Изтрий</button>
          </div>
          <div class="category-items">
            ${category.items
              .map(
                (item, itemIndex) => `
                  <div class="menu-row" data-category-index="${categoryIndex}" data-item-index="${itemIndex}">
                    <input type="text" value="${escapeHtml(item.name)}" aria-label="Име на позиция" data-item-field="name" />
                    <input type="text" value="${escapeHtml(item.size)}" aria-label="Грамаж или размер" data-item-field="size" />
                    <input type="text" value="${escapeHtml(item.price)}" aria-label="Цена" data-item-field="price" />
                    <button type="button" aria-label="Изтрий позиция" data-delete-item="${categoryIndex}:${itemIndex}">X</button>
                  </div>
                `,
              )
              .join("")}
          </div>
        </article>
      `,
    )
    .join("");
};

const renderCalendar = ({ target, labelTarget, stateKey, items, itemType }) => {
  const date = monthState[stateKey];
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const leadingEmptyDays = firstDay === 0 ? 6 : firstDay - 1;
  const itemsByDate = items.reduce((map, item) => {
    map[item.date] = map[item.date] || [];
    map[item.date].push(item);
    return map;
  }, {});

  labelTarget.textContent = formatMonth(date);
  target.innerHTML = [
    ...dayNames.map((dayName) => `<span class="day-name">${dayName}</span>`),
    ...Array.from({ length: leadingEmptyDays }, () => `<span class="empty-day" aria-hidden="true"></span>`),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const key = getDateKey(year, month, day);
      const dayItems = itemsByDate[key] || [];
      const label = dayItems[0]?.title || dayItems[0]?.name || "";

      return `
        <button type="button" class="${dayItems.length ? "has-items" : ""}" data-calendar-date="${key}" data-calendar-type="${itemType}">
          <b>${day}</b>
          ${dayItems.length ? `<small>${dayItems.length} - ${escapeHtml(label)}</small>` : ""}
        </button>
      `;
    }),
  ].join("");
};

const renderEvents = () => {
  const events = store.getEvents().sort((a, b) => a.date.localeCompare(b.date));

  renderCalendar({
    target: eventsCalendar,
    labelTarget: document.querySelector("[data-event-month]"),
    stateKey: "events",
    items: events,
    itemType: "event",
  });

  eventsList.innerHTML = events
    .map(
      (event) => `
        <article class="compact-item">
          <div>
            <h3>${escapeHtml(event.title)}</h3>
            <p>${event.date}${event.label ? ` - ${escapeHtml(event.label)}` : ""}</p>
          </div>
          <button type="button" data-edit-event="${event.id}">Редактирай</button>
          <button type="button" data-delete-event="${event.id}">Изтрий</button>
        </article>
      `,
    )
    .join("");
};

const renderReservations = () => {
  const reservations = store.getReservations().sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  renderCalendar({
    target: reservationsCalendar,
    labelTarget: document.querySelector("[data-reservation-month]"),
    stateKey: "reservations",
    items: reservations,
    itemType: "reservation",
  });

  reservationsList.innerHTML = reservations
    .map(
      (reservation) => `
        <article class="compact-item">
          <div>
            <h3>${escapeHtml(reservation.name)}</h3>
            <p>${reservation.date} ${reservation.time} - ${escapeHtml(reservation.guests)} души${reservation.note ? ` - ${escapeHtml(reservation.note)}` : ""}</p>
          </div>
          <button type="button" data-edit-reservation="${reservation.id}">Редактирай</button>
          <button type="button" data-delete-reservation="${reservation.id}">Изтрий</button>
        </article>
      `,
    )
    .join("");
};

const renderAll = () => {
  renderStats();
  renderMenuEditor();
  renderEvents();
  renderReservations();
};

const shiftMonth = (key, amount) => {
  monthState[key] = new Date(monthState[key].getFullYear(), monthState[key].getMonth() + amount, 1);
  key === "events" ? renderEvents() : renderReservations();
};

const fillForm = (form, values) => {
  Object.entries(values).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = value || "";
    }
  });
};

currentDate.textContent = new Intl.DateTimeFormat("bg-BG", {
  day: "2-digit",
  month: "long",
  year: "numeric",
}).format(new Date());

renderAll();

const handleMenuEditorChange = (event) => {
  const menu = store.getMenu();
  const categoryElement = event.target.closest("[data-category-index]");
  const itemElement = event.target.closest("[data-item-index]");

  if (!categoryElement) return;

  const categoryIndex = Number(categoryElement.dataset.categoryIndex);
  const categoryField = event.target.dataset.categoryField;
  const itemField = event.target.dataset.itemField;

  if (categoryField) {
    menu[categoryIndex][categoryField] = event.target.value;
  }

  if (itemElement && itemField) {
    const itemIndex = Number(itemElement.dataset.itemIndex);
    menu[categoryIndex].items[itemIndex][itemField] = event.target.value;
  }

  store.saveMenu(menu);
  renderStats();
};

menuEditor.addEventListener("input", handleMenuEditorChange);
menuEditor.addEventListener("change", handleMenuEditorChange);

menuEditor.addEventListener("click", (event) => {
  const menu = store.getMenu();
  const addItem = event.target.dataset.addItem;
  const deleteItem = event.target.dataset.deleteItem;
  const deleteCategory = event.target.dataset.deleteCategory;

  if (addItem !== undefined) {
    menu[Number(addItem)].items.push({ name: "Нова позиция", size: "300г", price: "0.00" });
  }

  if (deleteItem) {
    const [categoryIndex, itemIndex] = deleteItem.split(":").map(Number);
    menu[categoryIndex].items.splice(itemIndex, 1);
  }

  if (deleteCategory !== undefined) {
    menu.splice(Number(deleteCategory), 1);
  }

  store.saveMenu(menu);
  renderMenuEditor();
  renderStats();
});

document.querySelector("[data-add-category]").addEventListener("click", () => {
  const menu = store.getMenu();
  menu.push({
    id: store.uid("category"),
    title: "Нова категория",
    type: "food",
    color: "green",
    items: [{ name: "Нова позиция", size: "300г", price: "0.00" }],
  });
  store.saveMenu(menu);
  renderAll();
});

document.querySelector("[data-reset-menu]").addEventListener("click", () => {
  store.resetMenu();
  renderAll();
});

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(eventForm);
  const events = store.getEvents();
  const payload = {
    id: formData.get("id") || store.uid("event"),
    date: formData.get("date"),
    title: formData.get("title"),
    label: formData.get("label"),
    description: formData.get("description"),
  };
  const index = events.findIndex((item) => item.id === payload.id);

  if (index >= 0) {
    events[index] = payload;
  } else {
    events.push(payload);
  }

  store.saveEvents(events);
  eventForm.reset();
  renderEvents();
  renderStats();
});

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(reservationForm);
  const reservations = store.getReservations();
  const payload = {
    id: formData.get("id") || store.uid("reservation"),
    date: formData.get("date"),
    time: formData.get("time"),
    name: formData.get("name"),
    guests: formData.get("guests"),
    phone: formData.get("phone"),
    note: formData.get("note"),
    status: "confirmed",
  };
  const index = reservations.findIndex((item) => item.id === payload.id);

  if (index >= 0) {
    reservations[index] = payload;
  } else {
    reservations.push(payload);
  }

  store.saveReservations(reservations);
  reservationForm.reset();
  renderReservations();
  renderStats();
});

eventsList.addEventListener("click", (event) => {
  const editId = event.target.dataset.editEvent;
  const deleteId = event.target.dataset.deleteEvent;
  const events = store.getEvents();

  if (editId) {
    const selected = events.find((item) => item.id === editId);
    if (selected) fillForm(eventForm, selected);
  }

  if (deleteId) {
    store.saveEvents(events.filter((item) => item.id !== deleteId));
    renderEvents();
    renderStats();
  }
});

reservationsList.addEventListener("click", (event) => {
  const editId = event.target.dataset.editReservation;
  const deleteId = event.target.dataset.deleteReservation;
  const reservations = store.getReservations();

  if (editId) {
    const selected = reservations.find((item) => item.id === editId);
    if (selected) fillForm(reservationForm, selected);
  }

  if (deleteId) {
    store.saveReservations(reservations.filter((item) => item.id !== deleteId));
    renderReservations();
    renderStats();
  }
});

eventsCalendar.addEventListener("click", (event) => {
  const date = event.target.closest("[data-calendar-date]")?.dataset.calendarDate;
  if (date) eventForm.elements.date.value = date;
});

reservationsCalendar.addEventListener("click", (event) => {
  const date = event.target.closest("[data-calendar-date]")?.dataset.calendarDate;
  if (date) reservationForm.elements.date.value = date;
});

document.querySelector("[data-event-prev]").addEventListener("click", () => shiftMonth("events", -1));
document.querySelector("[data-event-next]").addEventListener("click", () => shiftMonth("events", 1));
document.querySelector("[data-reservation-prev]").addEventListener("click", () => shiftMonth("reservations", -1));
document.querySelector("[data-reservation-next]").addEventListener("click", () => shiftMonth("reservations", 1));

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(menuLinkInput.value);
    copyStatus.textContent = "Линкът е копиран.";
  } catch {
    copyStatus.textContent = "Маркирай и копирай линка ръчно.";
  }
});

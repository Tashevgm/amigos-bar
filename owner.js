const localStore = window.AmigosStore;
const store = window.AmigosDb;
const currentDate = document.querySelector("[data-current-date]");
const menuEditor = document.querySelector("[data-menu-editor]");
const menuSaveButton = document.querySelector("[data-save-menu]");
const menuSaveStatus = document.querySelector("[data-menu-save-status]");
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
const downloadQrButton = document.querySelector("[data-download-qr]");
const menuLinkInput = document.querySelector("[data-menu-link]");
const copyStatus = document.querySelector("[data-copy-status]");
const qrImage = document.querySelector("[data-qr-image]");
const qrStats = document.querySelector("[data-qr-stats]");
const qrToday = document.querySelector("[data-qr-today]");
const authPanel = document.querySelector("[data-auth-panel]");
const loginForm = document.querySelector("[data-login-form]");
const logoutButton = document.querySelector("[data-logout]");
const authStatus = document.querySelector("[data-auth-status]");

const monthState = {
  events: new Date(2026, 6, 1),
  reservations: new Date(2026, 6, 1),
};

let menuState = [];
let eventsState = [];
let reservationsState = [];
let qrStatsState = [];
let menuSaveTimer;

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
  menuCount.textContent = menuState.reduce((total, category) => total + category.items.length, 0);
  eventsCount.textContent = eventsState.length;
  reservationsCount.textContent = reservationsState.length;
  qrToday.textContent = qrStatsState[0]?.count || 0;
};

const getQrUrl = () => {
  const value = menuLinkInput.value.trim();
  return value || `${window.location.origin}/qr.html`;
};

const getExternalQrUrl = (size = 420, margin = 18) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=${margin}&data=${encodeURIComponent(getQrUrl())}`;

const createQrDataUrl = async (width = 1200, margin = 4) => {
  if (!window.QRCode?.toDataURL) {
    return getExternalQrUrl(width, margin);
  }

  return window.QRCode.toDataURL(getQrUrl(), {
    width,
    margin,
    errorCorrectionLevel: "M",
    color: {
      dark: "#083f45",
      light: "#ffffff",
    },
  });
};

const renderQrPanel = async () => {
  const qrUrl = getQrUrl();
  const maxCount = Math.max(1, ...qrStatsState.map((item) => item.count));

  try {
    qrImage.src = await createQrDataUrl(420, 3);
  } catch {
    qrImage.src = getExternalQrUrl(420, 18);
  }

  qrStats.innerHTML = qrStatsState.length
    ? qrStatsState
        .map(
          (item) => `
            <div class="qr-stat-row">
              <span>${item.date.slice(5)}</span>
              <div class="qr-stat-bar"><i style="width: ${(item.count / maxCount) * 100}%"></i></div>
              <strong>${item.count}</strong>
            </div>
          `,
        )
        .join("")
    : `<p class="hint">Още няма записани сканирания.</p>`;
};

const downloadQrCode = async () => {
  const imageUrl = await createQrDataUrl(1200, 4);
  const link = document.createElement("a");

  link.href = imageUrl;
  link.download = "amigos-menu-qr.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const renderMenuEditor = () => {
  const menu = menuState;

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
  const events = [...eventsState].sort((a, b) => a.date.localeCompare(b.date));

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
  const reservations = [...reservationsState].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

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
  renderQrPanel();
};

const setAuthUi = async () => {
  if (!store.client) return;

  const { data } = await store.client.auth.getSession();
  const isLoggedIn = Boolean(data.session);

  loginForm.classList.toggle("is-hidden", isLoggedIn);
  logoutButton.classList.toggle("is-hidden", !isLoggedIn);
  authStatus.textContent = isLoggedIn
    ? "Влязъл си. Промените се записват в Supabase."
    : "Влез с потребител от Supabase Auth, за да редактираш базата.";
};

const setMenuSaveStatus = (message, state = "") => {
  menuSaveStatus.textContent = message;
  menuSaveStatus.dataset.state = state;
};

const persistMenu = async () => {
  window.clearTimeout(menuSaveTimer);
  localStore.saveMenu(menuState);

  if (menuSaveButton) {
    menuSaveButton.disabled = true;
    menuSaveButton.textContent = "Записване...";
  }

  setMenuSaveStatus("Записване на менюто...", "pending");

  try {
    if (store.client) {
      const { data } = await store.client.auth.getSession();
      if (!data.session) {
        throw new Error("Owner login required before saving menu changes.");
      }
    }

    await store.saveMenu(menuState);

    const message = store.client
      ? "Менюто е записано в Supabase. Презареди menu.html, за да видиш промените."
      : "Менюто е записано локално в този браузър.";

    setMenuSaveStatus(message, "success");
    authStatus.textContent = store.client ? "Менюто е записано в Supabase." : message;
    return true;
  } catch (error) {
    const message = "Менюто не е записано онлайн. Влез в owner portal и натисни \"Запази менюто\" отново.";
    setMenuSaveStatus(message, "error");
    authStatus.textContent = message;
    console.error(error);
    return false;
  } finally {
    if (menuSaveButton) {
      menuSaveButton.disabled = false;
      menuSaveButton.textContent = "Запази менюто";
    }
  }
};

const saveMenuSoon = () => {
  window.clearTimeout(menuSaveTimer);
  menuSaveTimer = window.setTimeout(() => {
    persistMenu();
  }, 900);
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

const loadOwnerData = async () => {
  await setAuthUi();
  menuState = await store.getMenu();
  eventsState = await store.getEvents();
  reservationsState = await store.getReservations();
  qrStatsState = await store.getQrDailyStats(14);
  renderAll();
};

loadOwnerData();

const handleMenuEditorChange = (event) => {
  const menu = menuState;
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

  localStore.saveMenu(menu);
  setMenuSaveStatus("Има промени по менюто. Записват се автоматично, но можеш да натиснеш \"Запази менюто\".", "pending");
  saveMenuSoon();
  renderStats();
};

menuEditor.addEventListener("input", handleMenuEditorChange);
menuEditor.addEventListener("change", handleMenuEditorChange);

menuEditor.addEventListener("click", async (event) => {
  const menu = menuState;
  const addItem = event.target.dataset.addItem;
  const deleteItem = event.target.dataset.deleteItem;
  const deleteCategory = event.target.dataset.deleteCategory;
  const hasMenuAction = addItem !== undefined || Boolean(deleteItem) || deleteCategory !== undefined;

  if (!hasMenuAction) return;

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

  localStore.saveMenu(menu);
  await persistMenu();
  renderMenuEditor();
  renderStats();
});

menuSaveButton.addEventListener("click", () => {
  persistMenu();
});

document.querySelector("[data-add-category]").addEventListener("click", async () => {
  const menu = menuState;
  menu.push({
    id: localStore.uid("category"),
    title: "Нова категория",
    type: "food",
    color: "green",
    items: [{ name: "Нова позиция", size: "300г", price: "0.00" }],
  });
  localStore.saveMenu(menu);
  await persistMenu();
  renderAll();
});

document.querySelector("[data-reset-menu]").addEventListener("click", async () => {
  localStore.resetMenu();
  menuState = localStore.getMenu();
  await persistMenu();
  renderAll();
});

eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(eventForm);
  const events = eventsState;
  const payload = {
    id: formData.get("id") || localStore.uid("event"),
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

  localStore.saveEvents(events);
  try {
    await store.upsertEvent(payload);
    eventsState = await store.getEvents();
  } catch (error) {
    authStatus.textContent = "Event-ът не е записан. Провери дали си влязъл.";
    console.error(error);
  }
  eventForm.reset();
  renderEvents();
  renderStats();
});

reservationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(reservationForm);
  const reservations = reservationsState;
  const payload = {
    id: formData.get("id") || localStore.uid("reservation"),
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

  localStore.saveReservations(reservations);
  try {
    await store.upsertReservation(payload);
    reservationsState = await store.getReservations();
  } catch (error) {
    authStatus.textContent = "Резервацията не е записана. Провери дали си влязъл.";
    console.error(error);
  }
  reservationForm.reset();
  renderReservations();
  renderStats();
});

eventsList.addEventListener("click", async (event) => {
  const editId = event.target.dataset.editEvent;
  const deleteId = event.target.dataset.deleteEvent;
  const events = eventsState;

  if (editId) {
    const selected = events.find((item) => item.id === editId);
    if (selected) fillForm(eventForm, selected);
  }

  if (deleteId) {
    eventsState = events.filter((item) => item.id !== deleteId);
    localStore.saveEvents(eventsState);
    try {
      await store.deleteEvent(deleteId);
    } catch (error) {
      authStatus.textContent = "Event-ът не е изтрит. Провери дали си влязъл.";
      console.error(error);
    }
    renderEvents();
    renderStats();
  }
});

reservationsList.addEventListener("click", async (event) => {
  const editId = event.target.dataset.editReservation;
  const deleteId = event.target.dataset.deleteReservation;
  const reservations = reservationsState;

  if (editId) {
    const selected = reservations.find((item) => item.id === editId);
    if (selected) fillForm(reservationForm, selected);
  }

  if (deleteId) {
    reservationsState = reservations.filter((item) => item.id !== deleteId);
    localStore.saveReservations(reservationsState);
    try {
      await store.deleteReservation(deleteId);
    } catch (error) {
      authStatus.textContent = "Резервацията не е изтрита. Провери дали си влязъл.";
      console.error(error);
    }
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

menuLinkInput.addEventListener("input", renderQrPanel);

downloadQrButton.addEventListener("click", async () => {
  try {
    await downloadQrCode();
    copyStatus.textContent = "QR кодът е свален.";
  } catch (error) {
    copyStatus.textContent = "Неуспешно сваляне. Опитайте отново.";
    console.error(error);
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);

  try {
    const { error } = await store.client.auth.signInWithPassword({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (error) throw error;

    loginForm.reset();
    await loadOwnerData();
  } catch (error) {
    authStatus.textContent = "Неуспешен вход. Провери email/password.";
    console.error(error);
  }
});

logoutButton.addEventListener("click", async () => {
  await store.client.auth.signOut();
  await loadOwnerData();
});

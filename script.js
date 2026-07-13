const header = document.querySelector("[data-header]");
const bookingForm = document.querySelector(".booking-form");
const formStatus = document.querySelector("[data-form-status]");
const eventSelect = document.querySelector("[data-event-select]");
const publicEventsCalendar = document.querySelector("[data-public-events-calendar]");
const publicMenu = document.querySelector("[data-public-menu]");
let eventTiles = document.querySelectorAll("[data-event]");
const bookingDate = bookingForm?.querySelector('input[name="date"]');
const menuFilterButtons = document.querySelectorAll("[data-menu-filter]");
let menuCategories = document.querySelectorAll("[data-menu-category]");
const menuStatus = document.querySelector("[data-menu-status]");

const menuLabels = {
  all: "Показани са всички категории.",
  food: "Показани са категориите с храна.",
  cocktails: "Показани са коктейлите.",
  soft: "Показани са безалкохолни напитки, лимонади, фрешове и кафе.",
  beer: "Показани са бирите.",
  spirits: "Показан е твърдият алкохол.",
  desserts: "Показани са десертите.",
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const dayNames = ["Пон", "Вто", "Сря", "Чет", "Пет", "Съб", "Нед"];

const formatMonthTitle = (date) =>
  new Intl.DateTimeFormat("bg-BG", { month: "long", year: "numeric" }).format(date).replace(/^./, (letter) => letter.toUpperCase());

const parseGuests = (value) => {
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : 1;
};

const renderPublicMenu = async () => {
  if (!publicMenu || !window.AmigosDb) return;

  const menu = await window.AmigosDb.getMenu();

  publicMenu.innerHTML = menu
    .map(
      (category) => `
        <article class="menu-category ${escapeHtml(category.color)}" data-menu-category="${escapeHtml(category.type)}">
          <h3>${escapeHtml(category.title)}</h3>
          <ul>
            ${category.items
              .map(
                (item) => `
                  <li>
                    <span>${escapeHtml(item.name)}${item.size ? ` <small>${escapeHtml(item.size)}</small>` : ""}</span>
                    <strong>${escapeHtml(item.price)}</strong>
                  </li>
                `,
              )
              .join("")}
          </ul>
        </article>
      `,
    )
    .join("");

  menuCategories = document.querySelectorAll("[data-menu-category]");
};

const renderPublicEventsCalendar = async () => {
  if (!publicEventsCalendar || !window.AmigosDb) return;

  const events = (await window.AmigosDb.getEvents()).sort((a, b) => a.date.localeCompare(b.date));
  const baseDate = events[0]?.date ? new Date(`${events[0].date}T12:00:00`) : new Date();
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const leadingEmptyDays = firstDay === 0 ? 6 : firstDay - 1;
  const eventsByDate = new Map(events.map((event) => [event.date, event]));
  const monthLabel = document.querySelector(".calendar-month span");

  if (monthLabel) {
    monthLabel.textContent = formatMonthTitle(baseDate);
  }

  publicEventsCalendar.innerHTML = [
    ...dayNames.map((dayName) => `<span class="day-name">${dayName}</span>`),
    ...Array.from({ length: leadingEmptyDays }, () => `<span class="date-tile is-empty" aria-hidden="true"></span>`),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const event = eventsByDate.get(date);

      if (!event) {
        return `<button class="date-tile" type="button" data-event="Свободна вечер" data-date="${date}"><span>${day}</span></button>`;
      }

      return `
        <button class="date-tile is-event" type="button" data-event="${escapeHtml(event.title)}" data-date="${date}">
          <span>${day}</span>
          <em>${escapeHtml(event.label || event.title)}</em>
        </button>
      `;
    }),
  ].join("");

  eventTiles = document.querySelectorAll("[data-event]");
};

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const selectEvent = (eventName) => {
  if (!eventSelect) return;

  let matchingOption = [...eventSelect.options].find((option) => option.textContent === eventName);

  if (!matchingOption) {
    matchingOption = new Option(eventName, eventName);
    eventSelect.add(matchingOption);
  }

  eventSelect.value = matchingOption.value;
};

const attachEventTileHandlers = () => {
  eventTiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      selectEvent(tile.dataset.event);
      if (bookingDate) {
        bookingDate.value = tile.dataset.date || "";
      }
      document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};

const initPublicPages = async () => {
  await renderPublicMenu();
  await renderPublicEventsCalendar();
  attachEventTileHandlers();
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
};

initPublicPages();

menuFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.menuFilter;

    menuFilterButtons.forEach((item) => {
      const isActive = item === button;

      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    menuCategories.forEach((category) => {
      const shouldShow = filter === "all" || category.dataset.menuCategory === filter;

      category.classList.toggle("is-hidden", !shouldShow);
    });

    if (menuStatus) {
      menuStatus.textContent = menuLabels[filter] || menuLabels.all;
    }
  });
});

bookingForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = bookingForm.querySelector("button");
  const formData = new FormData(bookingForm);
  const eventName = formData.get("event") || "вашата резервация";

  button.disabled = true;

  try {
    await window.AmigosDb.createReservation({
      date: formData.get("date"),
      time: "20:00",
      name: formData.get("name"),
      guests: parseGuests(formData.get("party")),
      contact: formData.get("contact"),
      message: `${eventName}${formData.get("message") ? ` - ${formData.get("message")}` : ""}`,
    });

    button.textContent = "Заявката е изпратена";
    formStatus.textContent = `Благодарим. Заявката за "${eventName}" е записана.`;
    bookingForm.reset();
  } catch (error) {
    formStatus.textContent = "Има проблем със записването. Опитайте отново.";
    console.error(error);
  }

  window.setTimeout(() => {
    button.textContent = "Изпрати заявка";
    button.disabled = false;
    formStatus.textContent = "";
  }, 2800);
});

const AMIGOS_STORAGE_KEYS = {
  menu: "amigos-menu-categories",
  events: "amigos-events",
  reservations: "amigos-reservations",
};

const AMIGOS_DEFAULT_MENU = [
  {
    id: "salads",
    title: "Салати",
    type: "food",
    color: "green",
    items: [
      { name: "Цезар с пиле", size: "300г", price: "8.50" },
      { name: "Капрезе", size: "250г", price: "7.50" },
      { name: "Шопска салата", size: "250г", price: "6.00" },
      { name: "Зелена салата с риба тон", size: "300г", price: "8.00" },
    ],
  },
  {
    id: "starters",
    title: "Предястия",
    type: "food",
    color: "pink",
    items: [
      { name: "Пържени картофи", size: "300г", price: "3.90" },
      { name: "Пържени картофи със сирене", size: "300г", price: "4.50" },
      { name: "Сладки картофи", size: "250г", price: "5.90" },
      { name: "Начос с чедър", size: "250г", price: "6.90" },
      { name: "Пилешки хапки", size: "300г", price: "7.50" },
      { name: "Пилешки крилца", size: "300г", price: "7.50" },
    ],
  },
  {
    id: "seafood",
    title: "Морски специалитети",
    type: "food",
    color: "blue",
    items: [
      { name: "Цаца", size: "250г", price: "3.90" },
      { name: "Калмари", size: "300г", price: "10.99" },
      { name: "Сафрид", size: "250г", price: "5.90" },
      { name: "Скариди", size: "200г", price: "9.90" },
      { name: "Миди с черупка", size: "800г", price: "9.90" },
    ],
  },
  {
    id: "mains",
    title: "Основни / Street Food",
    type: "food",
    color: "orange",
    items: [
      { name: "Smash Burger", size: "350г", price: "9.90" },
      { name: "Кесадия", size: "350г", price: "9.90" },
      { name: "Бурито", size: "400г", price: "9.90" },
      { name: "Хот-дог", size: "220г", price: "4.90" },
      { name: "Кубински сандвич", size: "350г", price: "7.90" },
    ],
  },
  {
    id: "cocktails",
    title: "Коктейли",
    type: "cocktails",
    color: "pink",
    items: [
      { name: "Мохито", size: "", price: "7.00" },
      { name: "Ягодово мохито", size: "", price: "7.50" },
      { name: "Аперол Шприц", size: "", price: "8.00" },
      { name: "Джин с тоник", size: "", price: "7.00" },
      { name: "Куба Либре", size: "", price: "6.80" },
      { name: "Секс на плажа", size: "", price: "7.50" },
      { name: "Amigos Tropical", size: "", price: "8.00" },
      { name: "Ягодово дайкири", size: "", price: "7.50" },
      { name: "Пина Колада", size: "", price: "8.00" },
      { name: "Маргарита", size: "", price: "8.00" },
    ],
  },
  {
    id: "lemonades",
    title: "Домашни лимонади",
    type: "soft",
    color: "green",
    items: [
      { name: "Пъпеш", size: "400мл", price: "3.50" },
      { name: "Драконов плод", size: "400мл", price: "3.50" },
      { name: "Бъз", size: "400мл", price: "3.50" },
      { name: "Маракуя", size: "400мл", price: "3.50" },
      { name: "Малина", size: "400мл", price: "3.50" },
      { name: "Ягода", size: "400мл", price: "3.50" },
      { name: "Киви", size: "400мл", price: "3.50" },
      { name: "Гуава", size: "400мл", price: "3.50" },
    ],
  },
  {
    id: "fresh",
    title: "Фрешове и шейкове",
    type: "soft",
    color: "orange",
    items: [
      { name: "Портокал", size: "250мл", price: "4.00" },
      { name: "Грейпфрут", size: "250мл", price: "4.00" },
      { name: "Морков и ябълка", size: "250мл", price: "4.00" },
      { name: "Бананов шейк", size: "", price: "4.00" },
      { name: "Шоколадов шейк", size: "", price: "4.00" },
      { name: "Ягодов шейк", size: "", price: "4.00" },
    ],
  },
  {
    id: "beer",
    title: "Бири",
    type: "beer",
    color: "blue",
    items: [
      { name: "Шуменско малка", size: "330мл", price: "3.00" },
      { name: "Шуменско голяма", size: "500мл", price: "4.00" },
      { name: "Карлсберг малка", size: "330мл", price: "3.60" },
      { name: "Карлсберг голяма", size: "500мл", price: "4.60" },
      { name: "Карлсберг 0%", size: "330мл", price: "3.20" },
      { name: "Бъдвайзер", size: "300мл", price: "3.60" },
    ],
  },
  {
    id: "coffee",
    title: "Кафе и топли напитки",
    type: "soft",
    color: "pink",
    items: [
      { name: "Червен Ричард", size: "", price: "2.40" },
      { name: "Черна Перла", size: "", price: "2.70" },
      { name: "Ричард Лешник", size: "", price: "2.70" },
      { name: "Безкофеиново", size: "", price: "2.70" },
      { name: "Капучино", size: "", price: "3.50" },
      { name: "Лате", size: "", price: "3.50" },
      { name: "Фрапе", size: "", price: "3.50" },
      { name: "Айс кафе", size: "", price: "3.50" },
    ],
  },
  {
    id: "soft-drinks",
    title: "Безалкохолни напитки",
    type: "soft",
    color: "blue",
    items: [
      { name: "Pepsi / Pepsi Max / Pepsi Twist", size: "", price: "2.80" },
      { name: "Mirinda / 7UP", size: "330мл", price: "2.80" },
      { name: "Everest Tonic", size: "250мл", price: "2.80" },
      { name: "Lipton Lemon / Peach", size: "500мл", price: "3.00" },
      { name: "Prisan сок", size: "250мл", price: "3.20" },
      { name: "Red Bull", size: "250мл", price: "3.20" },
      { name: "Вода", size: "0.5л", price: "2.00" },
      { name: "Газирана вода", size: "500мл", price: "2.40" },
    ],
  },
  {
    id: "spirits",
    title: "Твърд алкохол",
    type: "spirits",
    color: "black",
    items: [
      { name: "Smirnoff водка", size: "50мл", price: "3.00" },
      { name: "Finlandia водка", size: "50мл", price: "3.60" },
      { name: "Gordon's джин", size: "50мл", price: "4.00" },
      { name: "Gordon's Pink джин", size: "50мл", price: "4.20" },
      { name: "Havana Club 3Y ром", size: "50мл", price: "5.20" },
      { name: "Sierra текила", size: "50мл", price: "4.50" },
      { name: "Olmeca Blanco", size: "50мл", price: "4.00" },
      { name: "Узо", size: "50мл", price: "4.00" },
    ],
  },
  {
    id: "desserts",
    title: "Десерти",
    type: "desserts",
    color: "pink",
    items: [
      { name: "Тарт с шоколад и солен карамел", size: "150г", price: "6.00" },
      { name: "Десерт с бадемов блат, ванилов скир, горски плодове и ядки", size: "150г", price: "6.00" },
      { name: "Хрупкав двоен шоколадов мус", size: "150г", price: "6.00" },
      { name: "Малиново брауни", size: "150г", price: "6.00" },
      { name: "Американски чийзкейк", size: "150г", price: "6.00" },
    ],
  },
  {
    id: "fruit",
    title: "Плодове",
    type: "desserts",
    color: "green",
    items: [
      { name: "Тропик", size: "диня, ананас, грозде", price: "12.50" },
      { name: "Лято", size: "диня, пъпеш, ягода", price: "12.90" },
      { name: "Цветен контраст", size: "ананас, киви, ягода", price: "13.50" },
    ],
  },
];

const AMIGOS_DEFAULT_EVENTS = [
  { id: "event-2026-07-16", date: "2026-07-16", title: "Тако и текила вечер", label: "Тако", description: "Street food, маргарити и текила шотове." },
  { id: "event-2026-07-17", date: "2026-07-17", title: "Латино залез парти", label: "Латино", description: "Салса, регетон и коктейли от 19:00." },
  { id: "event-2026-07-18", date: "2026-07-18", title: "Viva Loca DJ вечер", label: "DJ", description: "Dance music, бутилки за маса и коктейли." },
  { id: "event-2026-07-19", date: "2026-07-19", title: "Лежерен плажен брънч", label: "Брънч", description: "Фрешове, кафе, десерти и спокойна музика." },
];

const AMIGOS_DEFAULT_RESERVATIONS = [
  { id: "reservation-1", date: "2026-07-17", time: "20:30", name: "Иван Петров", guests: "4", phone: "", note: "Тераса", status: "pending" },
  { id: "reservation-2", date: "2026-07-18", time: "19:00", name: "Мария Георгиева", guests: "8", phone: "", note: "Рожден ден", status: "confirmed" },
  { id: "reservation-3", date: "2026-07-19", time: "21:00", name: "Николай", guests: "6", phone: "", note: "", status: "pending" },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

const readStoredData = (key, fallback) => {
  const saved = window.localStorage.getItem(key);

  if (!saved) return clone(fallback);

  try {
    return JSON.parse(saved);
  } catch {
    return clone(fallback);
  }
};

const writeStoredData = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

window.AmigosStore = {
  keys: AMIGOS_STORAGE_KEYS,
  getMenu: () => readStoredData(AMIGOS_STORAGE_KEYS.menu, AMIGOS_DEFAULT_MENU),
  saveMenu: (menu) => writeStoredData(AMIGOS_STORAGE_KEYS.menu, menu),
  resetMenu: () => writeStoredData(AMIGOS_STORAGE_KEYS.menu, AMIGOS_DEFAULT_MENU),
  getEvents: () => readStoredData(AMIGOS_STORAGE_KEYS.events, AMIGOS_DEFAULT_EVENTS),
  saveEvents: (events) => writeStoredData(AMIGOS_STORAGE_KEYS.events, events),
  getReservations: () => readStoredData(AMIGOS_STORAGE_KEYS.reservations, AMIGOS_DEFAULT_RESERVATIONS),
  saveReservations: (reservations) => writeStoredData(AMIGOS_STORAGE_KEYS.reservations, reservations),
  uid: (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
};

const createSupabaseClient = () => {
  const config = window.AMIGOS_SUPABASE;

  if (!config?.url || !config?.anonKey || !window.supabase) {
    return null;
  }

  return window.supabase.createClient(config.url, config.anonKey);
};

const supabaseClient = createSupabaseClient();

const mapMenuRows = (categories, items) =>
  categories.map((category) => ({
    id: category.id,
    title: category.title,
    type: category.type,
    color: category.color,
    items: items
      .filter((item) => item.category_id === category.id)
      .map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size || "",
        price: Number(item.price).toFixed(2),
        isAvailable: item.is_available,
      })),
  }));

window.AmigosDb = {
  client: supabaseClient,
  isEnabled: Boolean(supabaseClient),

  async getMenu() {
    if (!supabaseClient) return window.AmigosStore.getMenu();

    const [{ data: categories, error: categoriesError }, { data: items, error: itemsError }] = await Promise.all([
      supabaseClient.from("menu_categories").select("*").order("sort_order").order("title"),
      supabaseClient.from("menu_items").select("*").eq("is_available", true).order("sort_order").order("name"),
    ]);

    if (categoriesError || itemsError || !categories?.length) {
      return window.AmigosStore.getMenu();
    }

    return mapMenuRows(categories, items || []);
  },

  async getEvents() {
    if (!supabaseClient) return window.AmigosStore.getEvents();

    const { data, error } = await supabaseClient
      .from("events")
      .select("*")
      .eq("is_public", true)
      .order("event_date");

    if (error || !data?.length) {
      return window.AmigosStore.getEvents();
    }

    return data.map((event) => ({
      id: event.id,
      date: event.event_date,
      title: event.title,
      label: event.label || "",
      description: event.description || "",
    }));
  },

  async getReservations() {
    if (!supabaseClient) return window.AmigosStore.getReservations();

    const { data, error } = await supabaseClient
      .from("reservations")
      .select("*")
      .order("reservation_date")
      .order("reservation_time");

    if (error || !data) {
      return window.AmigosStore.getReservations();
    }

    return data.map((reservation) => ({
      id: reservation.id,
      date: reservation.reservation_date,
      time: reservation.reservation_time?.slice(0, 5) || "",
      name: reservation.guest_name,
      guests: String(reservation.guests),
      phone: reservation.phone || "",
      note: reservation.note || "",
      status: reservation.status,
    }));
  },

  async createReservation(reservation) {
    if (!supabaseClient) {
      const reservations = window.AmigosStore.getReservations();
      reservations.push({ ...reservation, id: window.AmigosStore.uid("reservation"), status: "pending" });
      window.AmigosStore.saveReservations(reservations);
      return;
    }

    const { error } = await supabaseClient.from("reservations").insert({
      reservation_date: reservation.date,
      reservation_time: reservation.time || "20:00",
      guest_name: reservation.name,
      guests: Number(reservation.guests || 1),
      phone: reservation.phone || reservation.contact || "",
      note: reservation.note || reservation.message || "",
      status: "pending",
    });

    if (error) throw error;
  },

  async saveMenu(menu) {
    if (!supabaseClient) {
      window.AmigosStore.saveMenu(menu);
      return;
    }

    const { error: deleteError } = await supabaseClient
      .from("menu_categories")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (deleteError) throw deleteError;

    for (const [categoryIndex, category] of menu.entries()) {
      const { data: insertedCategory, error: categoryError } = await supabaseClient
        .from("menu_categories")
        .insert({
          title: category.title,
          type: category.type,
          color: category.color,
          sort_order: categoryIndex,
        })
        .select("id")
        .single();

      if (categoryError) throw categoryError;

      const items = category.items.map((item, itemIndex) => ({
        category_id: insertedCategory.id,
        name: item.name,
        size: item.size || null,
        price: Number(item.price || 0),
        sort_order: itemIndex,
        is_available: item.isAvailable !== false,
      }));

      if (items.length) {
        const { error: itemsError } = await supabaseClient.from("menu_items").insert(items);
        if (itemsError) throw itemsError;
      }
    }
  },

  async upsertEvent(event) {
    if (!supabaseClient) return;

    const payload = {
      event_date: event.date,
      title: event.title,
      label: event.label || null,
      description: event.description || null,
      is_public: true,
    };

    if (event.id && !String(event.id).startsWith("event-")) {
      payload.id = event.id;
    }

    const { error } = await supabaseClient.from("events").upsert(payload);
    if (error) throw error;
  },

  async deleteEvent(id) {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.from("events").delete().eq("id", id);
    if (error) throw error;
  },

  async upsertReservation(reservation) {
    if (!supabaseClient) return;

    const payload = {
      reservation_date: reservation.date,
      reservation_time: reservation.time,
      guest_name: reservation.name,
      guests: Number(reservation.guests || 1),
      phone: reservation.phone || null,
      note: reservation.note || null,
      status: reservation.status || "confirmed",
    };

    if (reservation.id && !String(reservation.id).startsWith("reservation-")) {
      payload.id = reservation.id;
    }

    const { error } = await supabaseClient.from("reservations").upsert(payload);
    if (error) throw error;
  },

  async deleteReservation(id) {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.from("reservations").delete().eq("id", id);
    if (error) throw error;
  },
};

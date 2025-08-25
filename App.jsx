import React, { useMemo, useState, useEffect } from "react";

// ----- Sample Data (MVP) -----
const cities = ["Atlanta", "New York", "Los Angeles", "Chicago"];

const sampleEvents = [
  {
    id: 1,
    title: "Ramen Night: Shoyu & Smoke",
    chef: "Chef Hana Ito",
    city: "Atlanta",
    neighborhood: "Old Fourth Ward",
    venue: "The Boiler Room",
    start: addDays(new Date(), 3),
    end: addDays(new Date(), 3),
    cover:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
    cuisine: ["Ramen", "Japanese"],
    priceText: "$22–$38",
    ticketUrl: "#",
    description:
      "Small-batch shoyu broth with smoked chashu. 1-night-only counter service.",
  },
  {
    id: 2,
    title: "Taco Yards: Mezcal Pairing",
    chef: "Chef Lalo Cruz",
    city: "Atlanta",
    neighborhood: "West Midtown",
    venue: "Yard & Co.",
    start: addDays(new Date(), 6),
    end: addDays(new Date(), 6),
    cover:
      "https://images.unsplash.com/photo-1601050690597-9aa4deaddadf?q=80&w=1600&auto=format&fit=crop",
    cuisine: ["Tacos", "Mexican"],
    priceText: "$18–$45",
    ticketUrl: "#",
    description:
      "Street tacos meet sipping mezcals. Four-course pairing; patio vibes.",
  },
  {
    id: 3,
    title: "Vegan Test Kitchen: Summer",
    chef: "Chef Aria Bloom",
    city: "Atlanta",
    neighborhood: "Inman Park",
    venue: "The Greenhouse",
    start: addDays(new Date(), 10),
    end: addDays(new Date(), 10),
    cover:
      "https://images.unsplash.com/photo-1526312426976-593c2b999d9f?q=80&w=1600&auto=format&fit=crop",
    cuisine: ["Vegan", "Seasonal"],
    priceText: "$35–$55",
    ticketUrl: "#",
    description:
      "Five plates around stone fruit, sweet corn, and basil. Limited to 24 seats.",
  },
  {
    id: 4,
    title: "Hand-Pulled Noodles Pop-In",
    chef: "Chef Wei Zhang",
    city: "Atlanta",
    neighborhood: "Midtown",
    venue: "Common Counter",
    start: addDays(new Date(), 15),
    end: addDays(new Date(), 15),
    cover:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1600&auto=format&fit=crop",
    cuisine: ["Chinese", "Noodles"],
    priceText: "$14–$28",
    ticketUrl: "#",
    description:
      "Biang-biang noodles and chili crisp bar. Walk-up orders until sellout.",
  },
  {
    id: 5,
    title: "Gully Kitchen: Mumbai Night",
    chef: "Chef Rohan Desai",
    city: "Atlanta",
    neighborhood: "Decatur",
    venue: "Porchlight",
    start: addDays(new Date(), 20),
    end: addDays(new Date(), 20),
    cover:
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1600&auto=format&fit=crop",
    cuisine: ["Indian", "Street Food"],
    priceText: "$12–$30",
    ticketUrl: "#",
    description:
      "Pav bhaji, vada pav, and kala khatta soda. Fast, messy, delicious.",
  },
  {
    id: 6,
    title: "Bouchon at the Bar (Pop-Up)",
    chef: "Chef Camille Rousseau",
    city: "Atlanta",
    neighborhood: "Grant Park",
    venue: "Paper Plane",
    start: addDays(new Date(), 28),
    end: addDays(new Date(), 28),
    cover:
      "https://images.unsplash.com/photo-1546549039-49ec6c163d93?q=80&w=1600&auto=format&fit=crop",
    cuisine: ["French", "Bistro"],
    priceText: "$28–$64",
    ticketUrl: "#",
    description:
      "Steak frites, onion soup gratinée, and pastis spritzes. One-night carte.",
  },
];

// ----- Utilities -----
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateRange(start, end) {
  const f = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  if (!end || start.toDateString() === end.toDateString()) return f(start);
  return `${f(start)} – ${f(end)}`;
}

function isWithinRange(d, preset) {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (preset === "all") return true;
  if (preset === "week") {
    const end = addDays(startOfToday, 7);
    return d >= startOfToday && d <= end;
  }
  if (preset === "month") {
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    return d >= startOfToday && d <= endOfMonth;
  }
  return true;
}

// ----- UI Primitives -----
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition hover:opacity-90 active:opacity-80 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-300 ${className}`}
    {...props}
  />
);

const Select = ({ value, onChange, options, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm ${className}`}
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

// Tag component (fixed quotes)
const Tag = ({ children }) => (
  <span className="rounded-full bg-gradient-to-r from-orange-100 to-rose-100 px-2.5 py-1 text-xs text-rose-800">
    {children}
  </span>
);

// ----- Layout Components -----
function Header({ current, onNav, city, setCity }) {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white"
            title="Brand"
          >
            🍽️
          </div>
          <div className="text-lg font-semibold tracking-tight">ChefDrop</div>
          <div className="hidden items-center gap-2 pl-4 text-sm text-neutral-500 md:flex">
            <span>City:</span>
            <Select value={city} onChange={setCity} options={cities} className="w-40" />
          </div>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          {[
            { key: "home", label: "Home" },
            { key: "discover", label: "Discover" },
            { key: "submit", label: "Submit an Event" },
            { key: "subscribe", label: "Subscribe" },
          ].map((link) => (
            <Button
              key={link.key}
              onClick={() => onNav(link.key)}
              className={`rounded-xl bg-transparent px-3 py-2 text-neutral-700 hover:bg-rose-50 ${
                current === link.key ? "font-semibold" : ""
              }`}
            >
              {link.label}
            </Button>
          ))}
        </nav>
      </div>
      <div className="mx-auto block max-w-6xl px-4 pb-3 md:hidden">
        <Select value={city} onChange={setCity} options={cities} />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-500">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ChefDrop (starter). All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-700">
              Terms
            </a>
            <a href="#" className="hover:text-neutral-700">
              Privacy
            </a>
            <a href="#" className="hover:text-neutral-700">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ----- Page: Home -----
function Home({ onStartDiscover, city, setCity }) {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="mt-10 grid items-center gap-8 rounded-3xl bg-rose-50 px-6 py-10 md:grid-cols-2 md:gap-12 md:px-10 md:py-14">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Discover Pop‑Up Chef Events
            </h1>
            <p className="mt-3 max-w-prose text-neutral-600">
              One place for limited‑time dinners, residencies, and chef takeovers near you.
            </p>
            <div className="mt-6 flex flex-col items-start gap-3 md:flex-row">
              <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-neutral-100">
                <span className="pl-2 text-sm text-neutral-500">City</span>
                <Select value={city} onChange={setCity} options={cities} className="w-40" />
              </div>
              <Button
                onClick={onStartDiscover}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-orange-500 px-5 py-3 text-white"
              >
                Discover pop‑ups →
              </Button>
            </div>
          </div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl">
            <img
              className="h-full w-full object-cover"
              alt="Hero food collage"
              src="https://images.unsplash.com/photo-1543352634-8730cde58b22?q=80&w=1600&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="mt-10 flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Featured in {city}</h2>
          <button onClick={onStartDiscover} className="text-sm text-neutral-600 hover:text-neutral-900">
            See all →
          </button>
        </div>
        <EventsGrid city={city} limit={6} />
      </section>

      {/* Newsletter */}
      <NewsletterCTA />
    </main>
  );
}

// ----- Page: Discover -----
function Discover({ city, onSelectEvent }) {
  const [when, setWhen] = useState("week");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");

  const events = useMemo(() => {
    return sampleEvents
      .filter((e) => e.city === city)
      .filter((e) => isWithinRange(new Date(e.start), when))
      .filter((e) =>
        query
          ? [e.title, e.chef, e.description, e.venue, e.neighborhood]
              .join(" ")
              .toLowerCase()
              .includes(query.toLowerCase())
          : true
      )
      .filter((e) => (tag === "All" ? true : e.cuisine.includes(tag)))
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  }, [city, when, query, tag]);

  const cuisineTags = ["All", ...Array.from(new Set(sampleEvents.flatMap((e) => e.cuisine)))];

  return (
    <main className="mx-auto max-w-6xl px-4">
      <div className="mt-8 flex flex-col gap-3 md:mt-10 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{city} · Upcoming Pop‑Ups</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-1">
            <button
              onClick={() => setWhen("week")}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                when === "week"
                  ? "bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white"
                  : "text-neutral-700 hover:bg-rose-50"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setWhen("month")}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                when === "month"
                  ? "bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white"
                  : "text-neutral-700 hover:bg-rose-50"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setWhen("all")}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                when === "all"
                  ? "bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white"
                  : "text-neutral-700 hover:bg-rose-50"
              }`}
            >
              All
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search (ramen, chef, venue)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64"
            />
            <Select value={tag} onChange={setTag} options={cuisineTags} className="w-40" />
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="mt-16 rounded-3xl bg-rose-50 p-10 text-center text-neutral-600">
          No events yet. Try a different filter or check back soon.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} onClick={() => onSelectEvent(e)} />
          ))}
        </div>
      )}

      <NewsletterCTA />
    </main>
  );
}

function EventCard({ event, onClick }) {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={event.cover}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap gap-1">
          {event.cuisine.slice(0, 2).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <h3 className="line-clamp-1 text-base font-semibold tracking-tight">{event.title}</h3>
        <p className="line-clamp-1 text-sm text-neutral-600">{event.chef}</p>
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>{formatDateRange(new Date(event.start), new Date(event.end))}</span>
          <span>{event.neighborhood}</span>
        </div>
      </div>
    </article>
  );
}

// ----- Page: Event Details -----
function EventDetails({ event, onBack }) {
  if (!event) return null;
  return (
    <main className="mx-auto max-w-3xl px-4">
      <button onClick={onBack} className="mt-6 text-sm text-neutral-600 hover:text-neutral-900">
        ← Back to Discover
      </button>
      <div className="mt-4 overflow-hidden rounded-3xl">
        <img src={event.cover} alt={event.title} className="h-auto w-full object-cover" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">{event.title}</h1>
      <p className="mt-1 text-neutral-700">by {event.chef}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {event.cuisine.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div className="mt-4 grid gap-3 rounded-2xl border border-neutral-100 bg-rose-50 p-4 md:grid-cols-2">
        <div>
          <div className="text-sm text-neutral-500">Date</div>
          <div className="text-sm">{formatDateRange(new Date(event.start), new Date(event.end))}</div>
        </div>
        <div>
          <div className="text-sm text-neutral-500">Venue</div>
          <div className="text-sm">
            {event.venue} · {event.neighborhood}, {event.city}
          </div>
        </div>
        <div>
          <div className="text-sm text-neutral-500">Price</div>
          <div className="text-sm">{event.priceText}</div>
        </div>
      </div>
      <p className="mt-6 text-neutral-700">{event.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={event.ticketUrl}
          className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white"
        >
          Get Tickets
        </a>
        <Button className="rounded-2xl bg-neutral-100 px-5 py-3 text-sm">Share</Button>
        <button className="text-sm text-neutral-500 hover:text-neutral-800">Report issue</button>
      </div>

      <div className="mt-10 rounded-2xl bg-rose-50 p-5">
        <h3 className="text-sm font-semibold">More in {event.city}</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sampleEvents
            .filter((e) => e.city === event.city && e.id !== event.id)
            .slice(0, 2)
            .map((e) => (
              <div key={e.id} className="rounded-xl border border-neutral-100 bg-white p-3">
                <div className="flex items-center gap-3">
                  <img src={e.cover} alt={e.title} className="h-16 w-20 rounded-lg object-cover" />
                  <div>
                    <div className="line-clamp-1 text-sm font-medium">{e.title}</div>
                    <div className="text-xs text-neutral-600">
                      {formatDateRange(new Date(e.start), new Date(e.end))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

// ----- Page: Submit an Event -----
function Submit({ onSubmitted }) {
  const [form, setForm] = useState({
    title: "",
    chef: "",
    city: cities[0],
    date: "",
    venue: "",
    neighborhood: "",
    image: "",
    ticketUrl: "",
    description: "",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e) {
    e.preventDefault();
    // Simple client-side validation (MVP)
    if (!form.title || !form.chef || !form.city || !form.date || !form.ticketUrl) {
      alert("Please complete the required fields: title, chef, city, date, ticket URL.");
      return;
    }
    onSubmitted();
  }

  return (
    <main className="mx-auto max-w-2xl px-4">
      <h1 className="mt-8 text-2xl font-semibold tracking-tight">Submit a Pop‑Up</h1>
      <p className="mt-2 text-sm text-neutral-600">
        We'll review submissions within 24–48 hours to keep listings fresh and high‑quality.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="Event Title*">
          <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
        </Field>
        <Field label="Chef Name*">
          <Input value={form.chef} onChange={(e) => update("chef", e.target.value)} />
        </Field>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="City*">
            <Select value={form.city} onChange={(v) => update("city", v)} options={cities} />
          </Field>
          <Field label="Date & Time*">
            <Input type="datetime-local" value={form.date} onChange={(e) => update("date", e.target.value)} />
          </Field>
          <Field label="Ticket URL*">
            <Input value={form.ticketUrl} onChange={(e) => update("ticketUrl", e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Venue">
            <Input value={form.venue} onChange={(e) => update("venue", e.target.value)} />
          </Field>
          <Field label="Neighborhood">
            <Input value={form.neighborhood} onChange={(e) => update("neighborhood", e.target.value)} />
          </Field>
        </div>
        <Field label="Cover Image URL">
          <Input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://…" />
        </Field>
        <Field label="Short Description">
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="h-28 w-full rounded-xl border border-neutral-200 p-3 text-sm"
            placeholder="Tell diners what to expect (menu theme, vibe, any limits)"
          />
        </Field>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms" className="text-sm text-neutral-600">
            I confirm this event is real and agree to the listing guidelines.
          </label>
        </div>
        <Button className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-orange-500 px-5 py-3 text-white">Submit for Review</Button>
      </form>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

// ----- Page: Subscribe -----
function Subscribe() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <main className="mx-auto max-w-md px-4">
      <h1 className="mt-8 text-2xl font-semibold tracking-tight">Subscribe</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Get the 7 must‑try pop‑ups each week in your city.
      </p>
      {done ? (
        <div className="mt-6 rounded-2xl bg-rose-50 p-6 text-sm text-neutral-700">
          Thanks! Check your inbox to confirm your subscription.
        </div>
      ) : (
        <div className="mt-6 flex gap-2">
          <Input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={() => setDone(true)} className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-orange-500 px-5 py-3 text-white">
            Subscribe
          </Button>
        </div>
      )}
    </main>
  );
}

// ----- Shared Blocks -----
function EventsGrid({ city, limit }) {
  const items = sampleEvents
    .filter((e) => e.city === city)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, limit || 99);

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((e) => (
        <article key={e.id} className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm">
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img src={e.cover} alt={e.title} className="h-full w-full object-cover" />
          </div>
          <div className="space-y-2 p-4">
            <div className="flex flex-wrap gap-1">
              {e.cuisine.slice(0, 2).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <h3 className="line-clamp-1 text-base font-semibold tracking-tight">{e.title}</h3>
            <p className="line-clamp-1 text-sm text-neutral-600">{e.chef}</p>
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>{formatDateRange(new Date(e.start), new Date(e.end))}</span>
              <span>{e.neighborhood}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="mt-14 rounded-3xl bg-rose-50 p-6 md:p-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Weekly in your city</h3>
            <p className="mt-1 text-sm text-neutral-600">
              Get 7 can’t‑miss pop‑ups every Monday. Quick, curated, and free.
            </p>
          </div>
          {done ? (
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-neutral-700 ring-1 ring-neutral-100">
              Thanks! You’re on the list.
            </div>
          ) : (
            <div className="flex w-full max-w-md gap-2">
              <Input
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={() => setDone(true)} className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-orange-500 px-5 py-3 text-white">
                Subscribe
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ----- Lightweight Dev Tests (added) -----
function runTests() {
  const tests = [];

  // addDays test (3 days)
  const base = new Date("2025-01-01T00:00:00Z");
  const plus3 = addDays(base, 3);
  const diffDays = Math.round((plus3.getTime() - base.getTime()) / (24 * 3600 * 1000));
  tests.push({ name: "addDays adds 3 days", pass: diffDays === 3, info: `diffDays=${diffDays}` });

  // formatDateRange tests
  const single = formatDateRange(base, base);
  const range = formatDateRange(base, addDays(base, 1));
  tests.push({ name: "formatDateRange single-day has no dash", pass: !single.includes("–"), info: single });
  tests.push({ name: "formatDateRange range uses dash", pass: range.includes("–"), info: range });

  // isWithinRange tests (relative to now)
  const today = new Date();
  const in3 = addDays(today, 3);
  const in30 = addDays(today, 30);
  tests.push({ name: "isWithinRange week includes +3", pass: isWithinRange(in3, "week") === true });
  tests.push({ name: "isWithinRange week excludes +30", pass: isWithinRange(in30, "week") === false });
  tests.push({ name: "isWithinRange all is true", pass: isWithinRange(in30, "all") === true });

  return tests;
}

function DevTests() {
  const [results, setResults] = useState([]);
  useEffect(() => {
    setResults(runTests());
  }, []);
  const passed = results.every((r) => r.pass);
  return (
    <details className="mx-auto mt-10 max-w-6xl px-4">
      <summary className={`text-sm ${passed ? "text-green-700" : "text-rose-700"}`}>
        Dev Tests: {passed ? "All passing" : "Some failing"} (click to view)
      </summary>
      <ul className="mt-2 space-y-1 text-sm text-neutral-700">
        {results.map((r, i) => (
          <li key={i}>
            <span className={`mr-2 font-medium ${r.pass ? "text-green-700" : "text-rose-700"}`}>
              {r.pass ? "✓" : "✗"}
            </span>
            {r.name} {r.info ? <em className="text-neutral-500">— {r.info}</em> : null}
          </li>
        ))}
      </ul>
    </details>
  );
}

// ----- App Shell -----
export default function App() {
  const [route, setRoute] = useState("home"); // home | discover | submit | subscribe | event
  const [city, setCity] = useState("Atlanta");
  const [selectedEvent, setSelectedEvent] = useState(null);

  function go(to) {
    setRoute(to);
    if (to !== "event") setSelectedEvent(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50 to-orange-50/40 text-neutral-900">
      <Header current={route} onNav={go} city={city} setCity={setCity} />

      {route === "home" && (
        <Home onStartDiscover={() => go("discover")} city={city} setCity={setCity} />
      )}

      {route === "discover" && (
        <Discover city={city} onSelectEvent={(e) => { setSelectedEvent(e); go("event"); }} />
      )}

      {route === "event" && (
        <EventDetails event={selectedEvent} onBack={() => go("discover")} />
      )}

      {route === "submit" && <Submit onSubmitted={() => go("home")} />}
      {route === "subscribe" && <Subscribe />}

      <Footer />
      <DevTests />
    </div>
  );
}

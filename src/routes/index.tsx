import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import {
  ArrowDown,
  ShoppingBag,
  Facebook,
  Instagram,
  Twitter,
  Leaf,
  Clock,
  Truck,
  Check,
  Star,
  Menu as MenuIcon,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import logo from "@/assets/logo.webp";
import salad1 from "@/assets/salad1.webp";
import salad2 from "@/assets/salad2.webp";
import salad3 from "@/assets/salad3.webp";
import salad4 from "@/assets/salad4.webp";
import salad5 from "@/assets/salad5.webp";

import { submitContact } from "@/lib/contact.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saladly — Fresh Bowls, Crafted Daily" },
      {
        name: "description",
        content:
          "Hand-tossed seasonal salads delivered fresh. Browse breakfast, lunch and dinner bowls, read what our guests say, and order in seconds.",
      },
      { property: "og:title", content: "Saladly — Fresh Bowls, Crafted Daily" },
      {
        property: "og:description",
        content: "Hand-tossed seasonal salads delivered fresh.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

type Dish = {
  name: string;
  price: string;
  image: string;
  description: string;
};

const DISHES: Dish[] = [
  {
    name: "Green Goddess Chicken Salad",
    price: "$32",
    image: salad1,
    description:
      "Slow-grilled chicken breast over crisp romaine, heirloom tomatoes, cucumber ribbons and pickled red onion, finished with a creamy green goddess dressing.",
  },
  {
    name: "Classic Caesar Bowl",
    price: "$26",
    image: salad2,
    description:
      "Charred chicken, butter lettuce and sourdough croutons tossed in a bright anchovy caesar with shaved aged parmesan.",
  },
  {
    name: "Avocado Cobb",
    price: "$29",
    image: salad3,
    description:
      "Soft-boiled egg, ripe avocado, smoked chicken, and a confetti of vegetables on a bed of crunchy greens.",
  },
  {
    name: "Quinoa Pomegranate",
    price: "$24",
    image: salad4,
    description:
      "Toasted quinoa, chickpeas, pomegranate jewels and avocado, finished with citrus-tahini vinaigrette.",
  },
  {
    name: "Tuscan Kale & Parmesan",
    price: "$28",
    image: salad5,
    description:
      "Massaged kale, grilled chicken, shaved parmesan and golden lemon, tossed with toasted breadcrumbs.",
  },
];

function Index() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative bg-background">
      <Nav />
      <Hero scrollYProgress={scrollYProgress} reduce={!!reduce} />
      <Features />
      <Menu />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}

/* ----------------------------- NAV ----------------------------- */

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#menu", label: "Menu" },
    { href: "#features", label: "Why us" },
    { href: "#pricing", label: "Plans" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="flex items-center gap-2">
          <img src={logo} alt="Saladly" width={36} height={36} className="h-9 w-9" />
          <span className="font-display text-lg font-semibold tracking-tight">Saladly</span>
        </a>
        <nav className="hidden gap-10 text-sm font-medium text-foreground/80 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            aria-label="Cart"
            className="hidden h-10 w-10 place-items-center rounded-full transition-colors hover:bg-card md:grid"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full bg-card ring-1 ring-border md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-background/95 md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 pb-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-card"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ----------------------------- HERO ----------------------------- */

function Hero({
  scrollYProgress,
  reduce,
}: {
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const [index, setIndex] = useState(0);
  const total = DISHES.length;
  const featured = DISHES[index];
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  // Parallax tied to global scroll (zero when reduce-motion)
  const circleY = useTransform(scrollYProgress, [0, 0.25], [0, reduce ? 0 : 200]);
  const circleScale = useTransform(scrollYProgress, [0, 0.25], [1, reduce ? 1 : 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, reduce ? 1 : 0.3]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, reduce ? 0 : -80]);

  const slots = useMemo(() => {
    const angles = [-90, -45, 0, 45, 90];
    return angles.map((a) => {
      const rad = (a * Math.PI) / 180;
      return { x: Math.sin(rad), y: -Math.cos(rad), a };
    });
  }, []);

  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-24">
      <motion.div
        aria-hidden
        style={{ y: circleY, scale: circleScale, background: "var(--peach)" }}
        className="pointer-events-none absolute -right-[20%] -top-[28%] h-[140vh] w-[140vh] rounded-full will-change-transform"
      />

      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-10 pt-4 md:grid-cols-2 md:px-10 md:pb-20"
      >
        <div className="relative z-10 max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-display text-4xl font-bold text-primary">{featured.price}</div>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                {featured.name}
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {featured.description}
              </p>
            </motion.div>
          </AnimatePresence>
          <button
            onClick={() => toast.success("Added to your cart")}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
          >
            Add to Cart
          </button>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <Carousel slots={slots} dishes={DISHES} index={index} featured={featured} />
        </div>
      </motion.div>

      <div className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 pb-10 md:px-10">
        <div className="flex items-center gap-4">
          <RoundButton onClick={prev} ariaLabel="Previous dish" rotate={180} />
          <RoundButton onClick={next} ariaLabel="Next dish" />
          <span className="ml-2 font-display text-sm tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, "0")}{" "}
            <span className="text-foreground/30">/ {String(total).padStart(2, "0")}</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <a href="#" aria-label="Facebook" className="transition-colors hover:text-foreground">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="#" aria-label="Instagram" className="transition-colors hover:text-foreground">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="#" aria-label="Twitter" className="transition-colors hover:text-foreground">
            <Twitter className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function RoundButton({
  onClick,
  ariaLabel,
  rotate = 0,
}: {
  onClick: () => void;
  ariaLabel: string;
  rotate?: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="group grid h-12 w-12 place-items-center rounded-full bg-card shadow-md shadow-foreground/5 ring-1 ring-border transition-transform hover:scale-110 active:scale-95"
    >
      <ArrowDown
        className="h-4 w-4 text-primary transition-transform group-hover:translate-y-0.5"
        style={{ transform: `rotate(${rotate}deg)` }}
      />
    </button>
  );
}

function Carousel({
  slots,
  dishes,
  index,
  featured,
}: {
  slots: { x: number; y: number; a: number }[];
  dishes: Dish[];
  index: number;
  featured: Dish;
}) {
  const total = dishes.length;
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <path
          d="M 8 55 A 42 42 0 0 1 92 55"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1.2 1.6"
          className="text-foreground/30"
        />
      </svg>

      {dishes.map((d, i) => {
        const slotIdx = (i - index + total) % total;
        const slot = slots[slotIdx];
        const left = 50 + slot.x * 38;
        const top = 50 + slot.y * 36;
        const isFeatured = slotIdx === 2;
        return (
          <motion.div
            key={d.name}
            className="absolute"
            initial={false}
            animate={{
              left: `${left}%`,
              top: `${top}%`,
              scale: isFeatured ? 1.9 : 0.55,
              zIndex: isFeatured ? 20 : 10,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ x: "-50%", y: "-50%", willChange: "transform" }}
          >
            <img
              src={d.image}
              alt={d.name}
              width={160}
              height={160}
              loading={isFeatured ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className="pointer-events-none h-32 w-32 select-none object-contain drop-shadow-2xl sm:h-40 sm:w-40"
            />
          </motion.div>
        );
      })}

      <motion.div
        key={featured.name}
        className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--peach) 60%, transparent) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/* --------------------------- SECTION SHELL --------------------------- */

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        {eyebrow && (
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {intro && <p className="mt-4 text-base text-muted-foreground">{intro}</p>}
      </motion.div>
      <div className="mt-14">{children}</div>
    </section>
  );
}

/* --------------------------- FEATURES --------------------------- */

function Features() {
  const items = [
    {
      icon: Leaf,
      title: "Sourced from farms",
      body: "We buy direct from regenerative farms within 100 miles, so leaves arrive same-day fresh.",
    },
    {
      icon: Clock,
      title: "Tossed to order",
      body: "Every bowl is hand-built when you tap order — no soggy pre-packs, no compromises.",
    },
    {
      icon: Truck,
      title: "Delivered in 25 min",
      body: "Our riders cool every bag with reusable thermals so flavor lands intact at your door.",
    },
  ];
  return (
    <Section
      id="features"
      eyebrow="Why Saladly"
      title="Crisp ingredients, calm rituals"
      intro="A daily rotating menu of clean, seasonal bowls — built by chefs, not factories."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-3xl bg-card p-8 ring-1 ring-border transition-transform hover:-translate-y-1"
          >
            <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <it.icon className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-xl font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------- MENU --------------------------- */

function Menu() {
  return (
    <Section
      id="menu"
      eyebrow="On the menu"
      title="This week's bowls"
      intro="A small, focused board. We swap dishes weekly to follow what's in season."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DISHES.map((d, i) => (
          <motion.article
            key={d.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group overflow-hidden rounded-3xl bg-card ring-1 ring-border"
          >
            <div className="relative aspect-square overflow-hidden bg-secondary/40">
              <img
                src={d.image}
                alt={d.name}
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
              />
            </div>
            <div className="flex items-start justify-between gap-4 p-6">
              <div>
                <h3 className="font-display text-lg font-semibold leading-snug">{d.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{d.description}</p>
              </div>
              <div className="shrink-0 font-display text-lg font-bold text-primary">{d.price}</div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------- TESTIMONIALS --------------------------- */

function Testimonials() {
  const items = [
    {
      quote:
        "The Green Goddess is the only lunch I look forward to all week. The portion is huge and the chicken is actually moist.",
      name: "Mira K.",
      role: "Designer, Brooklyn",
    },
    {
      quote:
        "I cancelled my meal-prep service. Saladly is faster, cheaper, and tastes like something a chef actually plated.",
      name: "Jordan A.",
      role: "Engineer, Chicago",
    },
    {
      quote:
        "Riders show up cold-bag in hand within 22 minutes every time. The croutons are still crunchy. Magic.",
      name: "Elena R.",
      role: "Founder, Austin",
    },
  ];
  return (
    <Section
      eyebrow="Loved by 12,000+ guests"
      title="Reviews that land in our inbox"
      intro="No fake stock photos. Real notes from real lunchers."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-3xl bg-card p-8 ring-1 ring-border"
          >
            <div className="mb-4 flex gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="text-sm leading-relaxed text-foreground/90">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-6 text-sm">
              <div className="font-semibold">{t.name}</div>
              <div className="text-muted-foreground">{t.role}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------- PRICING --------------------------- */

function Pricing() {
  const tiers = [
    {
      name: "Taste",
      price: "$14",
      cadence: "/bowl",
      features: ["Single bowl", "Free delivery over $25", "No commitment"],
      cta: "Order one",
      highlight: false,
    },
    {
      name: "Weekly",
      price: "$59",
      cadence: "/week",
      features: ["5 bowls weekly", "Skip or pause anytime", "Priority delivery window"],
      cta: "Start plan",
      highlight: true,
    },
    {
      name: "Family",
      price: "$129",
      cadence: "/week",
      features: ["12 bowls weekly", "2 dressings included", "Dedicated rider"],
      cta: "Feed the table",
      highlight: false,
    },
  ];
  return (
    <Section
      id="pricing"
      eyebrow="Plans"
      title="Simple, hungry-friendly pricing"
      intro="Order one bowl or build a weekly habit. Cancel in a tap."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={[
              "relative flex flex-col rounded-3xl p-8 ring-1 transition-transform hover:-translate-y-1",
              t.highlight
                ? "bg-foreground text-background ring-foreground shadow-xl"
                : "bg-card text-card-foreground ring-border",
            ].join(" ")}
          >
            {t.highlight && (
              <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
                Most loved
              </span>
            )}
            <div className="font-display text-lg font-semibold">{t.name}</div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold">{t.price}</span>
              <span className="text-sm opacity-70">{t.cadence}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => toast.success(`${t.name} plan selected`)}
              className={[
                "mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-transform hover:scale-[1.02] active:scale-95",
                t.highlight
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground text-background",
              ].join(" ")}
            >
              {t.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------- CONTACT --------------------------- */

const ContactClientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Tell us a little more (10+ chars)").max(1000),
});

function Contact() {
  const submit = useServerFn(submitContact);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "message", string>>>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = ContactClientSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof typeof errors;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await submit({ data: parsed.data });
      setStatus("success");
      toast.success("Message sent — we'll reply within a day.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error("Couldn't send your message. Please try again.");
    }
  };

  return (
    <Section
      id="contact"
      eyebrow="Say hi"
      title="Talk to a real person"
      intro="Catering, allergens, partnership ideas — we read every note."
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto grid max-w-2xl gap-5 rounded-3xl bg-card p-8 ring-1 ring-border"
      >
        <Field label="Your name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={80}
            autoComplete="name"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            placeholder="Alex Rivera"
          />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={255}
            autoComplete="email"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Message" htmlFor="message" error={errors.message}>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            maxLength={1000}
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            placeholder="What's on your mind?"
          />
        </Field>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === "loading" ? "Sending…" : "Send message"}
        </button>

        <AnimatePresence>
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary"
            >
              Thanks — your note landed in our inbox.
            </motion.div>
          )}
          {status === "error" && Object.keys(errors).length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              Something went wrong sending your message. Please try again.
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* --------------------------- FOOTER --------------------------- */

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" width={36} height={36} className="h-9 w-9" />
            <span className="font-display text-lg font-semibold">Saladly</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Fresh bowls, calmly delivered. Built in Brooklyn, served daily.
          </p>
        </div>
        <FooterCol title="Explore" links={["Menu", "Plans", "Why us", "Catering"]} />
        <FooterCol title="Company" links={["About", "Careers", "Press", "Contact"]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:px-10">
          <div>© {new Date().getFullYear()} Saladly. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</div>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="transition-colors hover:text-foreground">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, ShoppingBag, Facebook, Instagram, Twitter } from "lucide-react";

import logo from "@/assets/logo.png";
import salad1 from "@/assets/salad1.png";
import salad2 from "@/assets/salad2.png";
import salad3 from "@/assets/salad3.png";
import salad4 from "@/assets/salad4.png";
import salad5 from "@/assets/salad5.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saladly — Fresh Bowls, Crafted Daily" },
      {
        name: "description",
        content:
          "Hand-tossed seasonal salads delivered fresh. Browse our rotating menu of breakfast, lunch and dinner bowls.",
      },
      { property: "og:title", content: "Saladly — Fresh Bowls, Crafted Daily" },
      {
        property: "og:description",
        content: "Hand-tossed seasonal salads delivered fresh.",
      },
    ],
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
  const [index, setIndex] = useState(0);
  const total = DISHES.length;
  const featured = DISHES[index];

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  // Polar positions for each orbit slot (5 slots around an arc above center bowl)
  const slots = useMemo(() => {
    // angles in degrees, 0 = top
    const angles = [-90, -45, 0, 45, 90];
    return angles.map((a) => {
      const rad = (a * Math.PI) / 180;
      return { x: Math.sin(rad), y: -Math.cos(rad), a };
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Big peach circle behind hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] -top-[30%] h-[140vh] w-[140vh] rounded-full"
        style={{ background: "var(--peach)" }}
      />

      {/* NAV */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Saladly" width={40} height={40} className="h-10 w-10" />
          <span className="hidden font-display text-lg font-semibold tracking-tight sm:inline">
            Saladly
          </span>
        </div>
        <nav className="hidden gap-10 text-sm font-medium text-foreground/80 md:flex">
          <a href="#" className="transition-colors hover:text-foreground">Breakfast</a>
          <a href="#" className="transition-colors hover:text-foreground">Lunch</a>
          <a href="#" className="transition-colors hover:text-foreground">Dinner</a>
        </nav>
        <button
          aria-label="Cart"
          className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-background/60"
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </header>

      {/* HERO */}
      <main className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-20 pt-6 md:grid-cols-2 md:px-10 md:pb-32 md:pt-10">
        {/* Left: copy */}
        <div className="relative z-10 max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-display text-4xl font-bold text-primary">
                {featured.price}
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
                {featured.name}
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {featured.description}
              </p>
            </motion.div>
          </AnimatePresence>
          <button className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95">
            Add to Cart
          </button>
        </div>

        {/* Right: 3D orbital carousel */}
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <Carousel
            slots={slots}
            dishes={DISHES}
            index={index}
            featured={featured}
          />
        </div>
      </main>

      {/* Controls + footer */}
      <div className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 pb-10 md:px-10">
        <div className="flex items-center gap-4">
          <RoundButton onClick={prev} ariaLabel="Previous dish" rotate={180} />
          <RoundButton onClick={next} ariaLabel="Next dish" />
          <span className="ml-2 font-display text-sm text-muted-foreground tabular-nums">
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
    </div>
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
      {/* Dashed orbit arc */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <path
          d="M 8 55 A 42 42 0 0 1 92 55"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1.2 1.6"
          className="text-foreground/30"
        />
      </svg>

      {/* Orbit small bowls */}
      {dishes.map((d, i) => {
        // slot index relative to current featured (featured is slot[2])
        const slotIdx = (i - index + total) % total;
        const slot = slots[slotIdx];
        // Center within container; arc top, so y normalized
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
              opacity: 1,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ x: "-50%", y: "-50%", willChange: "transform" }}
          >
            <motion.img
              src={d.image}
              alt={d.name}
              draggable={false}
              className="pointer-events-none h-32 w-32 select-none object-contain drop-shadow-2xl sm:h-40 sm:w-40"
              animate={{ rotate: isFeatured ? 0 : 0 }}
            />
          </motion.div>
        );
      })}

      {/* Subtle rotating ring on featured */}
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

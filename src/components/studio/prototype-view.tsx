"use client";

import { useId, useRef, useState, type ComponentType, type CSSProperties, type KeyboardEvent, type SVGProps } from "react";
import { CalendarDays, ClipboardList, LayoutDashboard, Map as MapIcon, SquareKanban, Table2 } from "lucide-react";
import type { Accent, Prototype, Screen } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";
import { BookingScreen } from "./screens/booking-screen";
import { DashboardScreen } from "./screens/dashboard-screen";
import { FormScreen } from "./screens/form-screen";
import { KanbanScreen } from "./screens/kanban-screen";
import { MapScreen } from "./screens/map-screen";
import { OdontogramScreen, ToothIcon } from "./screens/odontogram-screen";
import { TableScreen } from "./screens/table-screen";
import s from "./studio.module.css";

const ICONS: Record<Screen["type"], ComponentType<SVGProps<SVGSVGElement>>> = {
  dashboard: LayoutDashboard,
  table: Table2,
  form: ClipboardList,
  map: MapIcon,
  booking: CalendarDays,
  kanban: SquareKanban,
  odontogram: ToothIcon,
};

// Every accent sits at the same lightness as the brand gold, so the dark ink on buttons keeps its contrast.
const ACCENT: Record<Accent, string> = {
  gold: "oklch(0.78 0.16 85)",
  coral: "oklch(0.78 0.14 40)",
  rose: "oklch(0.78 0.13 5)",
  emerald: "oklch(0.78 0.15 155)",
  teal: "oklch(0.78 0.11 190)",
  sky: "oklch(0.78 0.11 235)",
  indigo: "oklch(0.78 0.11 275)",
  violet: "oklch(0.78 0.13 305)",
};

export function ScreenView({ screen }: { screen: Screen }) {
  switch (screen.type) {
    case "dashboard":
      return <DashboardScreen screen={screen} />;
    case "table":
      return <TableScreen screen={screen} />;
    case "form":
      return <FormScreen screen={screen} />;
    case "map":
      return <MapScreen screen={screen} />;
    case "booking":
      return <BookingScreen screen={screen} />;
    case "kanban":
      return <KanbanScreen screen={screen} />;
    case "odontogram":
      return <OdontogramScreen screen={screen} />;
  }
}

/** The frame while Pao is still building: a ring of light circles the border and sparks drift up through it. */
export function BuildMagic() {
  return (
    <span aria-hidden className={s.magic}>
      <span className={s.aura} />
      {Array.from({ length: 14 }, (_, i) => (
        // Spread by index, not Math.random: the server and the client must render the same sparks.
        <i key={i} style={{ left: `${(i * 37 + 9) % 96}%`, animationDelay: `${(i * 0.37) % 2.6}s`, fontSize: `${12 + (i % 4) * 5}px` }}>
          ✦
        </i>
      ))}
    </span>
  );
}

export function PrototypeView({
  prototype,
  revealed = 3,
  building = false,
  className,
}: {
  prototype: Prototype;
  revealed?: number;
  building?: boolean;
  className?: string;
}) {
  const uid = useId();
  const [picked, setPicked] = useState(0);
  // Panels (by content key) that have already played their entrance: a screen staggers in the first time it is shown
  // by a tap or by the build, never again on later visits and never when reached with the arrow keys.
  const [settled, setSettled] = useState<ReadonlySet<string>>(() => new Set());
  const settle = (...keys: string[]) => setSettled((prev) => new Set([...prev, ...keys]));
  const keyOf = (i: number) => `${i}-${JSON.stringify(prototype.screens[i])}`;
  // A new build starts on its first tab, even when business and screen types repeat.
  const sig = JSON.stringify(prototype);
  const [seen, setSeen] = useState(sig);
  if (seen !== sig) {
    setSeen(sig);
    setPicked(0);
  }
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  // A tab that hasn't been revealed yet can't stay selected.
  const active = Math.min(picked, Math.max(0, revealed - 1));

  function onKey(e: KeyboardEvent) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step || revealed < 1) return;
    e.preventDefault();
    const n = Math.min(revealed, prototype.screens.length);
    const next = (active + step + n) % n;
    settle(keyOf(active), keyOf(next));
    setPicked(next);
    tabs.current[next]?.focus();
  }

  return (
    // The prototype wears the business's own colour: everything inside reads --gold, so one override re-themes it.
    <div className={cn(s.root, className)} style={prototype.accent ? ({ "--gold": ACCENT[prototype.accent] } as CSSProperties) : undefined}>
      <div className={cn(s.glass, "overflow-hidden rounded-2xl")}>
        {/* Keyed on the count, so the sheen replays each time another screen lands. */}
        {revealed > 0 && <span key={revealed} aria-hidden className={s.sheen} />}
        {building && <BuildMagic />}
        {/* App chrome */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <span
            className={cn(s.display, s.primary, "flex size-8 shrink-0 items-center justify-center rounded-lg text-sm")}
            aria-hidden
          >
            {prototype.business.trim().charAt(0).toUpperCase()}
          </span>
          <p className={cn(s.display, "min-w-0 flex-1 truncate font-medium")}>{prototype.business}</p>
          {/* Wrapper carries the breakpoint: .pill sets display and would beat Tailwind's `hidden`. */}
          <span className="hidden sm:block">
            <span className={s.pill}>
              <span className={cn(s.dot, "text-[var(--ok)]")} />
              Live prototype
            </span>
          </span>
        </div>

        <div role="tablist" aria-label="Prototype screens" onKeyDown={onKey} className="grid grid-cols-3 border-b border-white/10 px-1 sm:px-2">
          {prototype.screens.map((sc, i) => {
            const Icon = ICONS[sc.type];
            const open = i < revealed;
            const on = open && i === active;
            return (
              <button
                key={i}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${uid}-tab-${i}`}
                aria-selected={on}
                aria-controls={`${uid}-panel-${i}`}
                tabIndex={on ? 0 : -1}
                disabled={!open}
                onClick={() => {
                  if (i !== active) settle(keyOf(active));
                  setPicked(i);
                }}
                className={cn(s.tab, s.press, "flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-t-lg px-2 text-sm sm:justify-start sm:px-3")}
              >
                <Icon className={cn("size-4 shrink-0", on && "text-[var(--gold)]")} aria-hidden />
                {open ? (
                  <span className={cn(s.swap, "truncate")}>{sc.title}</span>
                ) : (
                  <span className={cn(s.shimmer, "h-2.5 w-16 rounded-full")} aria-label="Building" />
                )}
              </button>
            );
          })}
        </div>

        {/* Every revealed panel stays mounted, so clicks on one screen survive a tab switch. */}
        {prototype.screens.map((sc, i) =>
          i < revealed ? (
            <div
              // Content key: a different screen remounts with fresh local state.
              key={keyOf(i)}
              data-enter={settled.has(keyOf(i)) ? undefined : ""}
              role="tabpanel"
              id={`${uid}-panel-${i}`}
              aria-labelledby={`${uid}-tab-${i}`}
              hidden={i !== active}
              className={cn(s.materialize, "p-3 sm:p-5")}
            >
              <div className="mb-3 flex items-baseline justify-between gap-3 px-1 sm:mb-4">
                <h3 className={cn(s.display, "truncate text-lg font-medium sm:text-xl")}>{sc.title}</h3>
                <span className={cn(s.faint, s.num, "shrink-0 text-xs")}>
                  {i + 1} / {prototype.screens.length}
                </span>
              </div>
              <ScreenView screen={sc} />
            </div>
          ) : null,
        )}
        {revealed < 1 && (
          <div className="grid gap-3 p-3 sm:p-5" aria-busy>
            <div className={cn(s.shimmer, "h-6 w-40 rounded-md")} />
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className={cn(s.shimmer, "h-20 rounded-xl")} />
              ))}
            </div>
            <div className={cn(s.shimmer, "h-48 rounded-xl")} />
          </div>
        )}
      </div>
    </div>
  );
}

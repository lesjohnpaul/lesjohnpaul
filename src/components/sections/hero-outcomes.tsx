import { ArrowRight, Clock, TrendingDown, TrendingUp } from "lucide-react";
import { heroOutcome, heroOutcomes } from "@/data/portfolio-data";
import s from "./hero-outcomes.module.css";

const icons = { TrendingUp, TrendingDown, Clock };

/** Business-outcome framing for the first seconds on the page: what moves, from what, to what. */
export function HeroOutcomes() {
  // Bold the three levers inside the sentence so a skim reads "revenue / costs / hours".
  const [lead, rest] = heroOutcome.split("grow revenue, cut costs, and win back hours");
  return (
    <div className="space-y-5">
      <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
        {lead}
        <strong className="font-semibold text-foreground">
          grow <span className="text-primary">revenue</span>, cut <span className="text-primary">costs</span>, and win
          back <span className="text-primary">hours</span>
        </strong>
        {rest}
      </p>

      <ul className="grid max-w-2xl gap-2 sm:grid-cols-3 sm:gap-3">
        {heroOutcomes.map((o, i) => {
          const Icon = icons[o.icon as keyof typeof icons] ?? TrendingUp;
          return (
            <li
              key={o.lever}
              className={`${s.card} border border-border bg-card/60 px-4 py-3 backdrop-blur-sm sm:p-4`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-500">
                <Icon className="h-3.5 w-3.5" aria-hidden /> {o.lever}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2">{o.what}</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 font-display">
                <span className={`${s.before} whitespace-nowrap text-xs text-muted-foreground`}>
                  <span className="sr-only">from </span>
                  {o.before}
                </span>
                <ArrowRight className={`${s.arrow} h-3.5 w-3.5 self-center text-muted-foreground`} aria-hidden />
                <span className={`${s.after} whitespace-nowrap text-xl font-bold text-primary`}>
                  <span className="sr-only">to </span>
                  {o.after}
                </span>
              </p>
              <p className="mt-1.5 hidden text-[11px] leading-snug text-muted-foreground/80 sm:block">{o.proof}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

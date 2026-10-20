import {
  siAnthropic, siClaude, siCloudflare, siDocker, siExpress, siFastapi, siFastify, siGooglechrome, siKong,
  siLinux, siMaplibre, siMysql, siNextdotjs, siNodedotjs, siObsstudio, siPostgresql, siPrisma, siPwa,
  siPython, siReact, siRedis, siRust, siShadcnui, siSocketdotio, siSqlalchemy, siSupabase, siTailwindcss,
  siTauri, siTypescript, siUpstash, siVercel, siVite, siResend, siTelegram, siPytest, siGithubactions,
  type SimpleIcon,
} from "simple-icons";
import {
  BarChart3, Bot, Boxes, CalendarCheck, Cloud, CreditCard, Database, FileText, FlaskConical, GitBranch,
  Globe, HardDrive, Headphones, KeyRound, Mail, MessageSquare, Network, Radar, Radio, Server, ShieldCheck,
  Sparkles, UserCheck, Users, Workflow, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Layer = "interface" | "logic" | "ai" | "data" | "infra";
export type Tech = { name: string; layer: Layer; brand?: SimpleIcon; icon?: LucideIcon; color?: string };

// Order matters: first match wins for a tech tag, and the text scan dedupes by name.
// Brands missing from simple-icons (Microsoft, AWS, Playwright…) fall back to a lucide glyph.
const REGISTRY: (Tech & { re: RegExp })[] = [
  { re: /next\.?js/i, name: "Next.js", layer: "interface", brand: siNextdotjs },
  { re: /\breact\b/i, name: "React", layer: "interface", brand: siReact },
  { re: /tauri/i, name: "Tauri", layer: "interface", brand: siTauri },
  { re: /\bpwa\b/i, name: "PWA", layer: "interface", brand: siPwa },
  { re: /chrome|mv3/i, name: "Chrome", layer: "interface", brand: siGooglechrome },
  { re: /tailwind/i, name: "Tailwind", layer: "interface", brand: siTailwindcss },
  { re: /\bvite\b/i, name: "Vite", layer: "interface", brand: siVite },
  { re: /shadcn/i, name: "shadcn/ui", layer: "interface", brand: siShadcnui },
  { re: /maplibre/i, name: "MapLibre", layer: "interface", brand: siMaplibre },
  { re: /recharts|dashboard/i, name: "Charts", layer: "interface", icon: BarChart3, color: "#22b5bf" },
  { re: /\bobs\b/i, name: "OBS", layer: "interface", brand: siObsstudio },
  { re: /speech|voice/i, name: "Voice", layer: "interface", icon: Headphones, color: "#a78bfa" },
  { re: /claude/i, name: "Claude", layer: "ai", brand: siClaude },
  { re: /anthropic/i, name: "Anthropic API", layer: "ai", brand: siAnthropic },
  { re: /llm|ai agent|tool use/i, name: "LLM agent", layer: "ai", icon: Bot, color: "#c084fc" },
  { re: /human-in-the-loop|human confirm/i, name: "Human-in-the-loop", layer: "ai", icon: UserCheck, color: "#f5b700" },
  { re: /knowledge base/i, name: "Knowledge base", layer: "ai", icon: Sparkles, color: "#c084fc" },
  { re: /typescript/i, name: "TypeScript", layer: "logic", brand: siTypescript },
  { re: /fastapi/i, name: "FastAPI", layer: "logic", brand: siFastapi },
  { re: /fastify/i, name: "Fastify", layer: "logic", brand: siFastify },
  { re: /express/i, name: "Express", layer: "logic", brand: siExpress },
  { re: /node\.?js/i, name: "Node.js", layer: "logic", brand: siNodedotjs },
  { re: /python/i, name: "Python", layer: "logic", brand: siPython },
  { re: /\brust\b/i, name: "Rust", layer: "logic", brand: siRust },
  { re: /socket\.?io|websocket|real-?time/i, name: "Realtime", layer: "logic", brand: siSocketdotio },
  { re: /kong/i, name: "Kong Gateway", layer: "logic", brand: siKong },
  { re: /prisma/i, name: "Prisma", layer: "logic", brand: siPrisma },
  { re: /sqlalchemy/i, name: "SQLAlchemy", layer: "logic", brand: siSqlalchemy },
  { re: /inngest|workflow|etl|automation/i, name: "Automation", layer: "logic", icon: Workflow, color: "#f59e0b" },
  { re: /pdf/i, name: "PDF pipeline", layer: "logic", icon: FileText, color: "#ef4444" },
  { re: /pytest/i, name: "pytest", layer: "logic", brand: siPytest },
  { re: /playwright/i, name: "Playwright", layer: "logic", icon: FlaskConical, color: "#2ead33" },
  { re: /supabase/i, name: "Supabase", layer: "data", brand: siSupabase },
  { re: /postgres/i, name: "PostgreSQL", layer: "data", brand: siPostgresql },
  { re: /sql server|mssql/i, name: "SQL Server", layer: "data", icon: Database, color: "#cc2927" },
  { re: /mysql/i, name: "MySQL", layer: "data", brand: siMysql },
  { re: /upstash/i, name: "Upstash", layer: "data", brand: siUpstash },
  { re: /redis/i, name: "Redis", layer: "data", brand: siRedis },
  { re: /\brls\b|row-level security/i, name: "Row-level security", layer: "data", icon: ShieldCheck, color: "#3ecf8e" },
  { re: /azure/i, name: "Azure", layer: "infra", icon: Cloud, color: "#0089d6" },
  { re: /\bses\b|amazon/i, name: "Amazon SES", layer: "infra", icon: Mail, color: "#ff9900" },
  { re: /resend|e-?mail/i, name: "Email", layer: "infra", brand: siResend },
  { re: /sms/i, name: "SMS", layer: "infra", icon: MessageSquare, color: "#22c55e" },
  { re: /telegram/i, name: "Telegram", layer: "infra", brand: siTelegram },
  { re: /cal\.com|booking/i, name: "Cal.com", layer: "infra", icon: CalendarCheck, color: "#e5e5e5" },
  { re: /paymongo|gcash|payment/i, name: "Payments", layer: "infra", icon: CreditCard, color: "#38bdf8" },
  { re: /cloudflare/i, name: "Cloudflare", layer: "infra", brand: siCloudflare },
  { re: /vercel/i, name: "Vercel", layer: "infra", brand: siVercel },
  { re: /docker/i, name: "Docker", layer: "infra", brand: siDocker },
  { re: /\bci\b|github actions/i, name: "CI", layer: "infra", brand: siGithubactions },
  { re: /linux/i, name: "Linux", layer: "infra", brand: siLinux },
  { re: /hci|archer|\bvm\b|kvm|hyper-?converged/i, name: "HCI cluster", layer: "infra", icon: HardDrive, color: "#94a3b8" },
  { re: /\bmtls\b|identity|\bauth\b/i, name: "Identity", layer: "infra", icon: KeyRound, color: "#f5b700" },
  { re: /ndr|network|east-west|traffic/i, name: "Network", layer: "infra", icon: Network, color: "#60a5fa" },
  { re: /behavioral|incident|detection/i, name: "Detection", layer: "infra", icon: Radar, color: "#f87171" },
  { re: /omnichannel|customer 360/i, name: "Omnichannel", layer: "infra", icon: Radio, color: "#c084fc" },
  { re: /multi-tenant|vendor/i, name: "Multi-tenant", layer: "data", icon: Users, color: "#3ecf8e" },
  { re: /hybrid cloud|distributed/i, name: "Distributed", layer: "infra", icon: Globe, color: "#60a5fa" },
  { re: /(?<!sql )\bservers?\b/i, name: "Server", layer: "infra", icon: Server, color: "#94a3b8" },
  { re: /\bgit\b/i, name: "Git", layer: "infra", icon: GitBranch, color: "#f05032" },
];

const toTech = ({ name, layer, brand, icon, color }: Tech): Tech => ({ name, layer, brand, icon, color });

/** A stack tag → its icon entry. Unknown tags keep their own name with a generic glyph. */
export function techFor(tag: string): Tech {
  const hit = REGISTRY.find((t) => t.re.test(tag));
  return hit ? { ...toTech(hit), name: tag } : { name: tag, layer: "logic", icon: Boxes, color: "#a1a1aa" };
}

/** Every known technology mentioned in free text (architecture bullets), deduped, max `limit`. */
export function techsIn(text: string, limit = 4): Tech[] {
  return REGISTRY.filter((t) => t.re.test(text)).slice(0, limit).map(toTech);
}

/** Brand glyph as inline SVG (zero client JS), or the lucide fallback. Near-black brands use currentColor. */
export function TechIcon({ tech, className }: { tech: Tech; className?: string }) {
  if (tech.brand) {
    const hex = tech.brand.hex;
    const dark = parseInt(hex.slice(0, 2), 16) + parseInt(hex.slice(2, 4), 16) + parseInt(hex.slice(4, 6), 16) < 150;
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cn("h-4 w-4 shrink-0", className)} fill={dark ? "currentColor" : `#${hex}`}>
        <path d={tech.brand.path} />
      </svg>
    );
  }
  const Icon = tech.icon ?? Boxes;
  return <Icon aria-hidden className={cn("h-4 w-4 shrink-0", className)} style={{ color: tech.color }} />;
}

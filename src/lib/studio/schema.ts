import { z } from "zod";

const title = z.string().min(1).max(40);
const label = z.string().min(1).max(60);

export const StudioRequest = z.object({
  text: z.string().trim().min(1).max(500),
  who: z.enum(["team", "customers", "both"]),
  pain: z.enum(["manual", "visibility", "slow"]),
});
export type StudioRequest = z.infer<typeof StudioRequest>;

const Dashboard = z.object({
  type: z.literal("dashboard"),
  title,
  kpis: z
    .array(
      z.object({
        label,
        value: label,
        delta: z.string().min(1).max(12).optional().describe('Short change vs the previous period, e.g. "+12%" or "-3"'),
        tone: z.enum(["good", "bad", "neutral"]).optional().describe("Whether that change is good or bad for the business"),
      }),
    )
    .min(2)
    .max(4),
  chart: z.object({ label, points: z.array(z.number()).min(5).max(12) }),
  breakdown: z
    .object({ label, items: z.array(z.object({ label, value: z.number().positive() })).min(2).max(5) })
    .optional()
    .describe("A split of one total into parts, e.g. sales by category or orders by channel"),
});

const Table = z
  .object({
    type: z.literal("table"),
    title,
    columns: z.array(label).min(2).max(5),
    rows: z.array(z.array(label)).min(3).max(8),
  })
  .refine((t) => t.rows.every((r) => r.length === t.columns.length), {
    message: "every row must match columns length",
  });

const Form = z.object({
  type: z.literal("form"),
  title,
  fields: z
    .array(
      z.object({
        label,
        kind: z.enum(["text", "number", "select", "date"]),
        options: z.array(label).max(6).optional(),
      }),
    )
    .min(2)
    .max(6),
  submitLabel: label,
});

const MapScreen = z.object({
  type: z.literal("map"),
  title,
  pins: z
    .array(z.object({ label, x: z.number().min(0).max(1), y: z.number().min(0).max(1), status: label.optional() }))
    .min(2)
    .max(8),
});

const Booking = z.object({
  type: z.literal("booking"),
  title,
  service: label,
  slots: z.array(z.object({ day: label, times: z.array(label).min(1).max(4) })).min(3).max(5),
});

const Kanban = z.object({
  type: z.literal("kanban"),
  title,
  columns: z.array(z.object({ name: label, cards: z.array(label).max(4) })).min(3).max(5),
});

export const TOOTH_CONDITIONS = ["healthy", "caries", "filled", "crown", "root_canal", "extraction", "missing"] as const;
// FDI permanent teeth: quadrant 1-4, position 1-8 (11-18, 21-28, 31-38, 41-48).
const isFdi = (n: number) => n >= 11 && n <= 48 && n % 10 >= 1 && n % 10 <= 8;

const Odontogram = z.object({
  type: z.literal("odontogram"),
  title,
  patients: z
    .array(
      z
        .object({
          name: label,
          note: label.optional(),
          teeth: z
            .array(z.object({ tooth: z.number().int().min(11).max(48).describe("FDI tooth number: 11-18, 21-28, 31-38 or 41-48").refine(isFdi, "not an FDI tooth number"), condition: z.enum(TOOTH_CONDITIONS) }))
            .max(32),
        })
        .refine((p) => new Set(p.teeth.map((t) => t.tooth)).size === p.teeth.length, { message: "duplicate tooth" }),
    )
    .min(1)
    .max(3),
});

export const Screen = z.discriminatedUnion("type", [Dashboard, Table, Form, MapScreen, Booking, Kanban, Odontogram]);
export type Screen = z.infer<typeof Screen>;

// The prototype's own brand colour. Optional: builds stored before it existed still parse (and render in gold).
export const ACCENTS = ["gold", "coral", "rose", "emerald", "teal", "sky", "indigo", "violet"] as const;
export const Accent = z.enum(ACCENTS);
export type Accent = z.infer<typeof Accent>;

export const PrototypeSchema = z.object({
  business: z.string().min(1).max(40),
  spec: z.string().min(1).max(160),
  accent: Accent.optional().describe("Brand colour that suits this business"),
  screens: z.tuple([Screen, Screen, Screen]),
});
export type Prototype = z.infer<typeof PrototypeSchema>;

export function parsePrototype(raw: unknown): Prototype | null {
  const r = PrototypeSchema.safeParse(raw);
  return r.success ? r.data : null;
}

export function parseScreen(raw: unknown): Screen | null {
  const r = Screen.safeParse(raw);
  return r.success ? r.data : null;
}

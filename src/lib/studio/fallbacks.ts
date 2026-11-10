import type { Prototype } from "./schema.ts";

// All sample data is invented and generic.
export const FALLBACKS = {
  clinic: {
    business: "Sample Family Clinic",
    spec: "Appointments, patient records and daily visit numbers in one place.",
    screens: [
      {
        type: "dashboard",
        title: "Today at the clinic",
        kpis: [
          { label: "Visits today", value: "24" },
          { label: "Waiting now", value: "3" },
          { label: "No-shows", value: "2" },
        ],
        chart: { label: "Visits this week", points: [18, 22, 20, 26, 24, 12, 8] },
      },
      {
        type: "table",
        title: "Patients",
        columns: ["Name", "Last visit", "Next"],
        rows: [
          ["Patient A", "Oct 02", "Nov 12"],
          ["Patient B", "Oct 14", "Dec 01"],
          ["Patient C", "Sep 28", "Nov 20"],
          ["Patient D", "Oct 30", "Pending"],
        ],
      },
      {
        type: "booking",
        title: "Book a visit",
        service: "General check-up",
        slots: [
          { day: "Mon", times: ["9:00", "10:30", "14:00"] },
          { day: "Tue", times: ["9:30", "13:00"] },
          { day: "Wed", times: ["10:00", "15:30"] },
        ],
      },
    ],
  },
  dental: {
    business: "Sample Dental Clinic",
    spec: "Chart every patient's teeth, book visits and track treatments in one place.",
    screens: [
      {
        type: "odontogram",
        title: "Dental chart",
        patients: [
          {
            name: "Patient A",
            note: "Sensitive upper right. Recall in 6 months.",
            teeth: [
              { tooth: 16, condition: "caries" },
              { tooth: 17, condition: "filled" },
              { tooth: 26, condition: "crown" },
              { tooth: 36, condition: "root_canal" },
              { tooth: 46, condition: "caries" },
              { tooth: 38, condition: "extraction" },
            ],
          },
          {
            name: "Patient B",
            note: "Braces consult next visit.",
            teeth: [
              { tooth: 11, condition: "filled" },
              { tooth: 24, condition: "caries" },
              { tooth: 48, condition: "missing" },
            ],
          },
          {
            name: "Patient C",
            teeth: [
              { tooth: 18, condition: "missing" },
              { tooth: 28, condition: "missing" },
              { tooth: 37, condition: "crown" },
              { tooth: 45, condition: "filled" },
            ],
          },
        ],
      },
      {
        type: "booking",
        title: "Book a visit",
        service: "Cleaning and check-up",
        slots: [
          { day: "Mon", times: ["9:00", "10:30", "14:00"] },
          { day: "Wed", times: ["9:30", "13:00", "16:00"] },
          { day: "Sat", times: ["8:30", "10:00"] },
        ],
      },
      {
        type: "table",
        title: "Treatments",
        columns: ["Patient", "Treatment", "Tooth", "Fee"],
        rows: [
          ["Patient A", "Filling", "16", "₱1,500"],
          ["Patient A", "Root canal", "36", "₱8,000"],
          ["Patient B", "Filling", "24", "₱1,500"],
          ["Patient C", "Crown", "37", "₱12,000"],
          ["Patient B", "Cleaning", "All", "₱1,000"],
        ],
      },
    ],
  },
  restaurant: {
    business: "Sample Neighborhood Eatery",
    spec: "Orders, daily sales and menu stock tracked from one screen.",
    screens: [
      {
        type: "dashboard",
        title: "Today's sales",
        kpis: [
          { label: "Sales", value: "₱42,500" },
          { label: "Orders", value: "62" },
          { label: "Avg ticket", value: "₱685" },
        ],
        chart: { label: "Sales by hour", points: [40, 90, 160, 120, 60, 140, 230] },
      },
      {
        type: "kanban",
        title: "Order board",
        columns: [
          { name: "New", cards: ["Table 4 - 3 items", "Pickup - 1 item"] },
          { name: "Cooking", cards: ["Table 2 - 5 items"] },
          { name: "Ready", cards: ["Table 7 - 2 items", "Pickup - 4 items"] },
        ],
      },
      {
        type: "table",
        title: "Menu stock",
        columns: ["Item", "In stock", "Reorder at"],
        rows: [
          ["Rice", "18 kg", "10 kg"],
          ["Chicken", "9 kg", "8 kg"],
          ["Cooking oil", "6 L", "5 L"],
          ["Coffee beans", "3 kg", "2 kg"],
        ],
      },
    ],
  },
  logistics: {
    business: "Sample Courier Co.",
    spec: "Dispatch deliveries, see rider locations and follow every parcel.",
    screens: [
      {
        type: "map",
        title: "Live riders",
        pins: [
          { label: "Rider 1", x: 0.25, y: 0.3, status: "Delivering" },
          { label: "Rider 2", x: 0.6, y: 0.45, status: "Idle" },
          { label: "Rider 3", x: 0.78, y: 0.72, status: "Pickup" },
          { label: "Depot", x: 0.45, y: 0.8 },
        ],
      },
      {
        type: "kanban",
        title: "Deliveries",
        columns: [
          { name: "Queued", cards: ["Parcel 101", "Parcel 102", "Parcel 103"] },
          { name: "On the way", cards: ["Parcel 098", "Parcel 099"] },
          { name: "Delivered", cards: ["Parcel 095", "Parcel 096", "Parcel 097"] },
        ],
      },
      {
        type: "dashboard",
        title: "Delivery performance",
        kpis: [
          { label: "Delivered", value: "48" },
          { label: "On time", value: "94%" },
          { label: "Active riders", value: "5" },
        ],
        chart: { label: "Deliveries this week", points: [32, 40, 38, 45, 48, 30, 22] },
      },
    ],
  },
  retail: {
    business: "Sample Corner Shop",
    spec: "Track stock, record sales and see what to reorder before it runs out.",
    screens: [
      {
        type: "table",
        title: "Inventory",
        columns: ["Product", "Stock", "Price"],
        rows: [
          ["Item A", "42", "₱65"],
          ["Item B", "7", "₱180"],
          ["Item C", "120", "₱20"],
          ["Item D", "15", "₱95"],
        ],
      },
      {
        type: "form",
        title: "Record a sale",
        fields: [
          { label: "Product", kind: "select", options: ["Item A", "Item B", "Item C"] },
          { label: "Quantity", kind: "number" },
          { label: "Date", kind: "date" },
        ],
        submitLabel: "Save sale",
      },
      {
        type: "dashboard",
        title: "This week",
        kpis: [
          { label: "Sales", value: "₱108,500" },
          { label: "Low stock", value: "4 items" },
          { label: "Top seller", value: "Item C" },
        ],
        chart: { label: "Daily sales", points: [260, 310, 280, 350, 420, 380, 150] },
      },
    ],
  },
  services: {
    business: "Sample Service Studio",
    spec: "Capture client requests, schedule work and follow each job to done.",
    screens: [
      {
        type: "form",
        title: "New client request",
        fields: [
          { label: "Client name", kind: "text" },
          { label: "Service", kind: "select", options: ["Consultation", "Project", "Follow-up"] },
          { label: "Preferred date", kind: "date" },
        ],
        submitLabel: "Send request",
      },
      {
        type: "kanban",
        title: "Job pipeline",
        columns: [
          { name: "Inquiry", cards: ["Client A", "Client B"] },
          { name: "In progress", cards: ["Client C", "Client D"] },
          { name: "Done", cards: ["Client E"] },
        ],
      },
      {
        type: "booking",
        title: "Book a call",
        service: "Intro consultation",
        slots: [
          { day: "Mon", times: ["10:00", "14:00"] },
          { day: "Wed", times: ["11:00", "15:00", "16:00"] },
          { day: "Fri", times: ["9:30", "13:30"] },
        ],
      },
    ],
  },
} satisfies Record<string, Prototype>;

type Key = keyof typeof FALLBACKS;

const KEYWORDS: [Exclude<Key, "services">, string[]][] = [
  // Dental goes first: "dental clinic" must not fall through to clinic.
  ["dental", ["dental", "dentist", "dentista", "ngipin", "orthodont"]],
  ["clinic", ["clinic", "doctor", "patient", "klinika", "derma", "vet"]],
  ["restaurant", ["restaurant", "cafe", "coffee", "food", "kain", "karinderya", "catering", "bakery"]],
  ["logistics", ["delivery", "logistics", "courier", "rider", "padala", "trucking", "warehouse"]],
  ["retail", ["store", "shop", "tindahan", "sari-sari", "inventory", "retail", "boutique"]],
];

const NOUNS: Record<Key, string> = {
  clinic: "clinic",
  dental: "dental clinic",
  restaurant: "restaurant",
  logistics: "delivery business",
  retail: "shop",
  services: "service business",
};

export function pickFallback(text: string): { key: Key; label: string; prototype: Prototype } {
  const t = text.toLowerCase();
  const key: Key = KEYWORDS.find(([, ws]) => ws.some((w) => t.includes(w)))?.[0] ?? "services";
  return {
    key,
    label: `Here's an example for a ${NOUNS[key]}. My builder is resting right now; book a call and I'll build yours.`,
    prototype: FALLBACKS[key],
  };
}

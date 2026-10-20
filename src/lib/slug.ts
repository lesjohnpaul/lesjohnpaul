/** URL slug for a project title: "WeCare: Pharmacy POS" → "wecare-pharmacy-pos". */
export const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

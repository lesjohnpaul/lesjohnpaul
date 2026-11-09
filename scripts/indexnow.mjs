// Tells Bing (and every IndexNow engine: Yandex, Seznam, Naver) that the site's URLs exist
// or changed. ChatGPT search leans on Bing's index, so this is how new pages reach it.
// Run AFTER a production deploy: the engines fetch the key file from the live site.
//   npm run indexnow
const HOST = "lesjohnpauloliver.dev";
const KEY = "a5edb11c8cd66caabe0a128fcf7c8712"; // must match public/<KEY>.txt

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => {
  if (!r.ok) throw new Error(`sitemap.xml returned ${r.status}`);
  return r.text();
});
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error("No <loc> entries found in sitemap.xml");

const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  throw new Error("Key file is not live yet. Deploy first, then run this again.");
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted, key validation pending. Anything else is a real failure.
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}

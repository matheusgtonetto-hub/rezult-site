const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const tracking = fs.readFileSync(path.join(root, "rastreio.js"), "utf8");

function simulateClick({ variant, search = "", initialHref = "https://app.rezultcrm.com/register", storage = new Map() }) {
  const events = [];
  let listener;
  const anchor = {
    href: initialHref,
    getAttribute: () => initialHref,
    closest: (selector) => selector === "section[id], header[id]" ? { id: "hero" } : null,
  };
  const document = {
    documentElement: { getAttribute: () => variant },
    addEventListener: (_event, callback) => { listener = callback; },
  };
  const sessionStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  };
  const window = {
    location: { search, href: variant === "ab2" ? "https://rezultcrm.com/ab2" : "https://rezultcrm.com/" },
  };
  const fbq = (...args) => events.push(args);

  vm.runInNewContext(tracking, { document, sessionStorage, window, fbq, URL, URLSearchParams });
  listener({
    target: {
      closest: (selector) => selector.startsWith('a[href^=') ? anchor : { id: "hero" },
    },
  });
  return { url: new URL(anchor.href), events };
}

test("/ab2 preserva UTMs e identifica a variante no cadastro", () => {
  const { url, events } = simulateClick({
    variant: "ab2",
    search: "?utm_campaign=promessa&utm_content=criativo42&fbclid=abc123",
  });
  assert.equal(url.searchParams.get("utm_campaign"), "promessa");
  assert.equal(url.searchParams.get("utm_content"), "criativo42__ab2");
  assert.equal(url.searchParams.get("fbclid"), "abc123");
  assert.equal(url.searchParams.get("rz_secao"), "hero");
  assert.equal(events[0][2].variant, "ab2");
});

test("/ab2 sem UTM recebe marcador de variante", () => {
  const { url } = simulateClick({ variant: "ab2" });
  assert.equal(url.searchParams.get("utm_content"), "ab2");
});

test("home A mantém utm_content original", () => {
  const { url, events } = simulateClick({ variant: null, search: "?utm_content=criativo42" });
  assert.equal(url.searchParams.get("utm_content"), "criativo42");
  assert.equal(events[0][2].variant, "a");
});

test("exposição em /ab2 continua atribuída após visitar outra página", () => {
  const storage = new Map();
  simulateClick({ variant: "ab2", search: "?utm_content=criativo42", storage });
  const { url } = simulateClick({ variant: null, storage });
  assert.equal(url.searchParams.get("utm_content"), "criativo42__ab2");
});

test("slug e metadados da variante estão declarados", () => {
  const page = fs.readFileSync(path.join(root, "ab2.html"), "utf8");
  const vercel = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  assert.equal(vercel.cleanUrls, true);
  assert.match(page, /data-rz-variant="ab2"/);
  assert.match(page, /Atendimento, qualificação e follow-up já vêm feitos/);
  assert.match(page, /<meta name="robots" content="index, follow"/);
  assert.match(page, /<link rel="canonical" href="https:\/\/rezultcrm\.com\/"/);
});

---
title: Bindings from anywhere
theme: uncover
class: invert
---

# Bindings from anywhere

2023/12/15 Cloudflare Workers Tech Talks #2

---

## About me 😉

---

### Yuji Sugiura

- 👨‍👩‍👧
- Works at PixelGrid Inc.
- +Side works

![bg right:45%](../public/img/prof-2.jpg)

---

### りぃ / @leaysgur

- Twitter: [@leaysgur](https://twitter.com/leaysgur)
- GitHub: [leaysgur](https://github.com/leaysgur/)
- Blog: [Memory ice cubes](https://leaysgur.github.io/posts/)

![bg left:45% contain](./img/prof.png)

---

## Today's theme...

---

### Workers Bindings

> Bindings allow your Workers to interact with **resources on the Cloudflare Developer Platform**.
> https://developers.cloudflare.com/workers/configuration/bindings/

---

### For example...

- KV: Global, low-latency, key-value data storage
- R2: AWS S3 compat, 0 egress fee object storage
- D1: SQLite database running on the CDN edge
- Queues, Email, AI, Browser, Hyperdrive, etc...
- 14? bindings are available for now
  - Includes beta, excludes `workerd` internals 🙈

Variety and convenience! 🤩
You want to use it in different ways, don't you?

---

### How to use?

```js
export default {
  // Through the handler `Env` parameter
  async fetch(req, env, ctx) {
    const value = await env.MY_KV.get("hello");

    const stmt = env.MY_DB.prepare("INSERT INTO logs VALUES (?, ?)");
    const rows = await stmt.bind(value, 42).run();

    // ...
  },
};
```

Create worker and invoke from handler(`fetch`, `scheduled`, `tail`, etc...).

---

### Other options(programmable)

- REST API
  - https://developers.cloudflare.com/api
- `wrangler xxx` CLI commands
  - https://developers.cloudflare.com/workers/wrangler/commands

Available bindings and features are very limited.

---

## DX and Challenges 💪

---

## 1️⃣ Building a simple web APIs

---

### Web APIs w/ bindings

- Like REST API, tRPC endpoint
- No front-end assets(HTML, CSS, JS, etc...)

---

### Excellent ✨

- `wrangler dev` & `wrangler deploy`
  - Bindings are automatically setup
  - Built-in TypeScript, `esbuild` support
  - Chrome DevTools integration
- Fast deployment cycle
- `--remote` is supported

---

## 2️⃣ Using Vite based front-end frameworks

---

### e.g. Using SvelteKit + Cloudflare Pages

- https://vitejs.dev
  - Core infrastructure for modern front-end frameworks™
  - Astro, Nuxt, SvelteKit, SolidStart, QwikCity, etc...
- https://kit.svelte.dev
  - `@sveltejs/adapter-cloudflare` 👀
- Not just a SPA, using SSR altogether

Let's use `platform.env.MY_DB` inside `load` functions!

---

### 💥 TypeError: Cannot read properties of undefined (reading 'env')

- `vite dev` is running on Node.js
- Bindings are not available at all...
  - Cloudflare adapter do nothing on development

(BTW, Cloudflare Pages requires us to setup bindings manually. 🤨)

---

### Workaround for local development

- 🅰️ Some of frameworks have their own Vite plugin
  - But [e](https://github.com/withastro/adapters/blob/main/packages/cloudflare/src/index.ts)-[a](https://github.com/solidjs/solid-start/blob/main/packages/start-cloudflare-pages/dev-server.js)-[c](https://github.com/cloudflare/next-on-pages/tree/main/internal-packages/next-dev)-[h](https://github.com/honojs/vite-plugins/blob/main/packages/dev-server/src/dev-server.ts) of them has its own, different implementation+behavior for the same goal... 🙃
- 🅱️ Mock `env` by yourself at runtime w/ `miniflare`
  - Intutive, less LoC
  - But `miniflare` requires `await` to setup and `dispose()` to shutdown, `env.XXX` itself is a sync API though

---

### Thanks `miniflare`(+`workerd`) but,

- Currently a few of bindings are not supported
  - https://github.com/cloudflare/workers-sdk/issues/4360
  - https://github.com/cloudflare/workers-sdk/pull/4522
- No way to debug with remote data effectively
  - `wragnler pages dev -- vite build --watch` takes tooooooooo much to reload

How to fight bugs only occur in production? 🫠

---

## 3️⃣ Interact with remote data

---

### Misc daily operations

- D1 data aggregation for stats, by user inquiry, etc...
- Update remote D1 data from GUI
- Download KV, R2 assets for debugging
- Batch updates for storaged data all at once
- etc...

---

### `wrangler xxx` is the only way but,

- I/O is not typed and need to be parsed by scripts
- Need to spawn and manage child processes
  - Although `zx` can make things a little easier
- Unfamiliar CLI arguments
  - `kv:bulk` only supports JSON format
  - etc...

Or https://dash.cloudflare.com ...? 🙈

---

## \*️⃣ More and more

---

### How to...

- Set up local environment to develop with large amount of binary data in KV?
- Use D1 as source for Static Sites Generator?
- Try AI bindings before acutual deployment?
- Mix service bindings provided by other team?
  - https://github.com/cloudflare/workers-sdk/issues/1182

These DXs can be better?

---

### Summary

- Want unified(local+remote) way to access bindings
- JavaScript API for Workers looks good
- It is nice to be run on especially Node.js, Bun etc...
- `wrangler dev --remote` is the only way to access all bindings and features

What if Workers **Bindings** API running **from anywhere**...?

---

## [cfw-bindings-wrangler-bridge](https://github.com/leaysgur/cfw-bindings-wrangler-bridge)

`npm install -D cfw-bindings-wrangler-bridge`

---

### 🌉 Bridge = Module + Worker

- Module
  - To be `import`ed into your application
  - Written as pure ESM, run on any environment
  - Workers Bindings API compatible
- Worker
  - Proxy worker to be invoked by the bridge module
  - Hosted by `wrangler dev` or `unstable_dev()` in advance

---

### 1. Worker usage

```sh
wrangler dev ./path/to/node_modules/cfw-bindings-wrangler-bridge/worker/index.js --remote
# Worker will be running on `http://127.0.0.1:8787` by default
```

👆 Universal or Node.js only 👇

```js
import { unstable_dev } from "wrangler";

const worker = await unstable_dev(
  "./path/to/node_modules/cfw-bindings-wrangler-bridge/worker/index.js",
  {
    local: false,
    experimental: { disableExperimentalWarning: true },
  },
);
// Worker will be running on `http://${worker.address}:${worker.port}`,
```

---

### 2. Module usage

```js
import { KVNamespace$ } from "cfw-bindings-wrangler-bridge";

const MY_KV = new KVNamespace$("MY_KV", {
  // bridgeWorkerOrigin: `http://${worker.address}:${worker.port}`,
});

await MY_KV.put("foo", "bar");
await MY_KV.get("foo"); // "bar"
```

That's all! 🎉

---

### How it works(simplified)

```js
// App
MY_KV.list({ prefix: "xyz" });

// Module
fetch(bridgeWorkerOrigin, {
  headers: { CMD: "MY_KV.list" },
  body: stringify([{ prefix: "xyz" }]),
});

// =========== ↓ HTTP Request ↑ Response ===========

// Worker
const [NAME, METHOD] = req.headers.get("CMD").split(".");
const res = await env[NAME][METHOD](...parse(req.body));
```

---

### Unique points

- Remote bindings access from local runtime
  - Includes AI bindings ✌️
- Remote and local bindings can be mixed
  - At any kinds
- Module is universal
  - Just a `fetch` client
  - May be portable to language other than JavaScript 🙄
- 💯 compatible API with Workers Bindings API
  - Supports non-POJO arguments

---

### Not perfect, but may be reasonable

- Supported bindings are limited
  - KV, R2, D1, Queue(producer), Service, Vectorize
- Many Cloudflare specific things are still missing
  - `req.cf`, `ctx.waitUntil`, `caches`, `crypto.subtle.timingSafeEqual`, `HTMLRewriter`, etc...

But for limited purposes, at least for me, it just works™ and makes my life easier. 😎

---

### Demo

- https://github.com/leaysgur/sveltekit-d1-drizzle-template
- https://github.com/leaysgur/cfw-storage-bindings-studio

---

### Bright future?

- Also created an issue about this, but...
  - https://github.com/cloudflare/workers-sdk/issues/3632
- Although no roadmap has been published, it seems that team is WIP to support Vite
  - https://github.com/vitejs/vite/discussions/14288
  - But remote access will be still missing

---

### Active development 🚧

- `startDevWorker()`
  - https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler/src/api/startDevWorker
- `getBindingsProxy()`
  - https://github.com/cloudflare/workers-sdk/pull/4523
- Winter CG 👀
  - https://github.com/wintercg
  - Maybe out of scope...?

---

## Thank you! 👋

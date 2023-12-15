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

### Workers [Bindings](https://developers.cloudflare.com/workers/configuration/bindings)

> Bindings allow your Workers to interact with **resources on the Cloudflare Developer Platform**.

---

### For example...

- KV: Global, low-latency, key-value data storage
- R2: AWS S3 compat, 0 egress fee object storage
- D1: SQLite database running on the CDN edge
- Queues, Email, AI, Browser, Hyperdrive, etc...

14? bindings are available for now! 🤩
(Includes beta, excludes `workerd` internals)

---

### Basic usage

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

Create worker and invoke from its handler(`fetch`, `scheduled`, `tail`, etc...).

---

### Other options(programmable)

- REST API
  - https://developers.cloudflare.com/api
- `wrangler xxx` CLI commands
  - https://developers.cloudflare.com/workers/wrangler/commands

Simple but available bindings and features are limited.

---

## Bindings and challenges ⚔️

---

## 1️⃣  Using Vite based frameworks

---

### e.g. SvelteKit + Cloudflare Pages

- https://vitejs.dev
  - Core infra for modern front-end frameworks™
  - Astro, Nuxt, SvelteKit, SolidStart, QwikCity, etc...
- https://kit.svelte.dev
  - With `@sveltejs/adapter-cloudflare` 👀
- Not just a SPA, using SSR altogether

Let's use `platform.env.MY_DB` inside `load` functions!

---

### 💥 TypeError: Cannot read properties of undefined (reading 'env')

- `vite dev` is running on Node.js
- Bindings are not available at all...
  - Cloudflare adapter do nothing on development

(BTW, Cloudflare Pages deployment requires us to setup bindings manually via Dashboard... Consider [Workers Sites](https://developers.cloudflare.com/workers/configuration/sites/) again? 🤪)

---

### Workaround for `vite dev`

- 🅰️ Some of frameworks have their own Vite plugin
  - But [e](https://github.com/withastro/adapters/blob/main/packages/cloudflare/src/index.ts)-[a](https://github.com/solidjs/solid-start/blob/main/packages/start-cloudflare-pages/dev-server.js)-[c](https://github.com/cloudflare/next-on-pages/tree/main/internal-packages/next-dev)-[h](https://github.com/honojs/vite-plugins/blob/main/packages/dev-server/src/dev-server.ts) of them has its own, different implementation+behavior for the same goal... 🙃
- 🅱️ Mock specific `env` by yourself at runtime
  - Intutive, less LoC

Be careful that `miniflare` requires `await` to setup and `dispose()` to shutdown. `env.XXX` itself is a sync API though.

---

### Thanks `miniflare`(+`workerd`) but,

- Not all bindings support local mode
  - https://github.com/cloudflare/workers-sdk/issues/4360
- Some bindings use remote API even in local mode(!)
  - https://github.com/cloudflare/workers-sdk/pull/4522
- No way to debug with remote data effectively
  - `wragnler pages dev -- vite build --watch` takes too much time to reload

How to fight bugs only occur in production? 🫠

---

## 2️⃣ Develop environment setup

---

## Hard to clone environment

- You cannot use remote bindings with `miniflare`
- Need to (up|down)load large amount of assets
  - Share `.wrangler/state`...?

Just for simple API development, `wrangler dev --remote` will save you. 🤤

---

## No way to mix remote + local

- `wrangler dev --remote` forces all bindings to run in remote mode too
  - Vice versa for `--local`
- Some bindings only work with `--remote`
- How to use service bindings provided by other team?
  - https://github.com/cloudflare/workers-sdk/issues/1182

No way to use local for write, remote for read, etc...

---

## 3️⃣ In daily operations

---

### Remote data is critical

- Aggregate data for stats, by user inquiry, etc...
- Want to update remote data from nice GUI
- Use as source for Static site generation?
- etc...

How to cope with these?

---

### CLI, API or Dashboard...

- Limited, unfamiliar
  - `r2 object` does not have `list`
  - `kv:bulk` only supports JSON format
  - etc...
- I/O is not typed and need to be parsed by scripts
  - Performance is also not good
- Need to spawn and manage child processes
  - Although `zx` can make things a little easier
- You may use `unstable_dev()` for 1-shot script

Remote data feels far away. 🍃

---

### IMO: Summary

- `wrangler dev --remote` is the only way to access all bindings and features
- Need unified API to access bindings
- I want to
  - select remote and/or local in bindings level
  - be run on especially Node.js, Bun

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
  // This origin determines remote or local
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

- All remote bindings are available from local runtime
  - Includes Vectorize bindings ✌️
- Remote and local bindings can be mixed
  - At any kinds, any combination
- 💯 compatible API with Workers Bindings API
  - Supports non-POJO arguments
- Module is universal, just a `fetch` client

May be portable to language other than JavaScript. 😆

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

## Appendix 🍬

---

### Bright future?

- Also created an issue about this, but...
  - https://github.com/cloudflare/workers-sdk/issues/3632
- Although no roadmap has been published, it seems that team is WIP to support Vite
  - https://github.com/vitejs/vite/discussions/14288
  - But remote access, mixing will be still missing

---

### Active development 🚧

- `startDevWorker()`
  - https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler/src/api/startDevWorker
- `getBindingsProxy()`
  - https://github.com/cloudflare/workers-sdk/pull/4523
- `getRequestExecutionContext()`
  - https://github.com/cloudflare/workerd/pull/1213
- `wrangler cloudchamber`
  - https://github.com/cloudflare/workers-sdk/pull/4310

---

## Thank you! 👋

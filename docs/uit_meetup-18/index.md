---
title: 10 ways to reduce your JS
class: invert
theme: gaia
---

# 10 ways to reduce your JS
2022/12/14 UIT Meetup #18

---

# About me 👋

---

## Yuji Sugiura

- PixelGrid Inc.
  - Senior Engineer
- 👨‍👩‍👧

![bg right](../public/img/prof-2.jpg)

---

## りぃ / @leader22

- Twitter: [@leader22](https://twitter.com/leader22)
- GitHub: [leader22](https://github.com/leader22/)
- Blog: [console.lealog();](https://lealog.hateblo.jp/)

![bg left](../public/img/doseisan-2.jpg)

---

# Today's theme

---

# Reduce your JavaScript!

![bg opacity:.6](./img/bf-cat.jpg)

---

## The numbers are increasing

From [State of JS | httparchive.org](https://httparchive.org/reports/state-of-javascript?lens=top1k&start=2017_12_15&end=latest&view=grid)

- Top 1,000 sites
- 2017/12/15 - 2022/10/01

![bg right:45% contain](./img/js-size.png)

---

## But...

From [Web Almanac | httparchive.org](https://almanac.httparchive.org/en/2022/javascript#how-much-javascript-do-we-load)

- 30 - 40% are unused 🥺
  - https://web.dev/unused-javascript/

![bg right:40% contain](./img/js-bytes-unused.png)

---

## The problems

Too much, unused JS,

- Slow down entire page loading
  - whether blocking or not
- Consume extra network bandwith, waste mobile data costs

This trend makes the Web slower... 🐌

---

### Even worse

If DOM is rendered dynamically(≒ SPA) _for no reason_,

- Require more time and resource **after** JS are loaded
- May be less accessible on slow network, low-spec device
- Even with SSR, still cause UI jank
- Open in new tab run the same process again

Is your JS really needed...?

---

## JavaScript bloat 😬

> JavaScript bloat refers to a website that relies on too much JavaScript to function at peak speed and capacity.
>
> A feature-rich, complex website is naturally going to have more JavaScript, and that’s OK.
> The problem happens when **a simple site has a large amount of JavaScript** that the user must download.

https://builtin.com/software-engineering-perspectives/fix-javascript-bloat

---

# Let's reduce JS!

For better UX, faster Web ✨

![bg opacity:.6](./img/md-cat.jpg)

---

## 1. Use HTML elements properly

- `<details>` + `<summary>` for (open|close) toggle menu
- `<dialog>` for (modal|modeless) dialog
  - a11y support included 🤩
- `<datalist>` for incremental search
- `<form>`
  - with `<input type="range|color|date|month|...">`
  - and attrs like `required`, `pattern`, ...

See also https://developer.mozilla.org/docs/Web/HTML/Element

---

## 2. Use Web Standard APIs

- The same as https://youmightnotneedjquery.com
- Instead of `EventEmitter`
  - `MessageChannel`, `EventTarget`
- Instead of Luxon, Day.js
  - `Intl.DateTimeFormat`
- Instead of clipboard.js
  - `navigator.clipboard`

See also https://developer.mozilla.org/docs/Web/API

---

## 3. Misc

- USE! CSS! FIRST!
  - for spacing
  - for transition, animation
  - for smooth scroll
  - for variables, constants
  - etc...
- FYI: View Transitions API
  - https://github.com/WICG/view-transitions/blob/main/explainer.md#mpa-vs-spa-solutions

---

## 4. Optimize build

- Refine build target
  - defined in `.babelrc`, `tsconfig.json`, `vite.config.js`, etc...
  - ~~IE? still alive?~~
- Do not forget to minify
- Reconsider, optimize CSS-in-JS solutions
  - to extract `.css` files
  - you might not need Autoprefixer anymore
- Move `<svg>` icons out from JS
  - use `<defs>` + `<use>`

---

## 5. Try precompiled disappearing FWs

- Like [Svelte](https://svelte.dev/)([Kit](https://kit.svelte.dev/)), [Solid](https://www.solidjs.com/)([Start](https://start.solidjs.com/))
- Declarative components as usual turn into optimized runtime! 👻
  - (relatively) small and efficient
  - no V-DOM overhead

From [TodoMVC size comparison](https://dev.to/this-is-learning/javascript-framework-todomvc-size-comparison-504f)

![bg right:45% contain](./img/todomvc-1.png)

---

### Inflection points

- (N * TodoMVC) + vendor size(↑)
- Inflection points(↓)

>  From 0-3 TodoMVCs, Svelte is the smallest. From 3 to 10 Solid is the smallest. 10-113 TodoMVCs Preact is. And more than 113 TodoMVC's Vue is.

(Just for reference. 🙈)

![bg right:45% contain](./img/todomvc-2.png)

---

## 6. Consider pre-rendering

- Use SSG(static site generator), instead of CSR(+SSR)
  - ≠ `next export`[!!](https://leader22.github.io/slides/techfeed_experts_night-4/#10)
- Render every pages and contents beforehand
- A.k.a. [Jamstack(-y)](https://almanac.httparchive.org/en/2022/jamstack#jamstack-y-a-disclaimer) approach
- Suitable for blog, document, company site, etc...

Base line is 0 JS!

---

## 7. Stick with Server rendering

- Use classic web server and templates
  - ≠ SSR
- Render every pages and contents on the fly
  - authenticate, personalize
- CDN Edge Workers are also available in these days
  - e.g. Cloudflare Workers

Base line is also 0 JS!

---

## 8. Adopt MPA style

- Separate page(app)s by use-case
  - e.g. (Login app | Main app), (User app | Admin app)
  - as you do dynamic `import()`, async routes
- Separete truly static pages
  - not to be bundled together

Separation of concerns! ✂️

---

## 9. Visit islands architecture

- Like [Astro](https://astro.build/), [Marko](https://markojs.com/)
- Pre-rendering static contents
  - or streaming SSR(in-order)
- Lazy load+hydrate dynamic component JS

See also [The islands architecture recap](https://leader22.github.io/slides/techfeed_experts_night-4/)

![bg right:40% contain](./img/islands.png)

---

### Full hydration

```html
<!-- React component code example.
     All components are loaded, parsed, hydrated on page load -->
<Layout>
  <Header />
  <Carousel speed={500} />
  <Details>
    <Popup />
  </Details>
  <!-- ... -->
  <Media>
    <RichVideoPlayer src="https://..." />
  </Media>
  <Footer />
</Layout>
```

Maximum size of JS are always loaded, parsed, and executed regardless of its usage.

![bg right:40% contain](./img/full-hydration.png)

---

### Partial hydration

```html
<!-- Astro component code example.
     Components w/ `client:*` are islands, otherwize statically pre-rendered -->
<Layout>
  <Header />
  <!-- JS loaded+hydrated on page load -->
  <Carousel speed={500} client:load />
  <Details>
    <!-- Same as above but with `requestIdleCallback()` -->
    <Popup client:idle />
  </Details>
  <!-- ... -->
  <Media>
    <!-- JS loaded+hydrated when entering a viewport -->
    <RichVideoPlayer src="https://..." client:visible />
  </Media>
  <Footer />
</Layout>
```

Minimum size of JS are used and only when it's needed. 🏝

![bg right:40% contain](./img/partial-hydration.png)

---

### Astro client directives

- `client:load`: Immediate
- `client:idle`: With `requestIdleCallback()` (= lower priority)
- `client:visible`: With `IntersectionObserver`
- `client:media`: With `MediaQueryList` by `matchMedia()`
- `client:only`: Immediate but skip SSR

https://docs.astro.build/en/reference/directives-reference/#client-directives

---

## 10. No hydration, resume it quickly

- [Qwik](https://qwik.builder.io/)([City](https://qwik.builder.io/qwikcity/overview/))
  - reached beta at 2022/09/19
- Everything is lazy loadable
  - even at event handler level!
  - PH can only perform at component(and its whole children) level
- Simply **resume** the flow that done on server
  - (P)H **repeat** the flow that done on server

Base line is close to 0 JS, order is _N(1)_ constantly. 🤯

---

### Qwik in action

- 0 JS on initial load
  - bootstraps are inlined in HTML
- Load minimum chunks progressively by user action

https://todo-cloudflare-misko.sethealth.workers.dev

![bg right contain](./img/qwik-todo.png)

---

### Qwik component code

```jsx
const Counter = component$(async () => {
  const state = useStore({ count: 0 });

  return (
    <button onClick$={() => { state.count++; }}>
      {state.count}
    </button>
  );
});
```

- JSX as you have seen in React, Solid
- [`$`](https://qwik.builder.io/docs/advanced/dollar/) means _boundary_ as a qwik symbol
  - can be extracted for lazy, progressive loading

---

# Summary

![bg opacity:.6](./img/af-cat.jpg)

---

## Smaller is better

> A feature-rich, complex website is naturally going to have more JavaScript, and that’s OK.

Of course it depends, but ship less code is always better.

> The problem happens when **a simple site has a large amount of JavaScript** that the user must download.

Let's make the Web faster! 😌

---

## Everything is a trade-off

Size is not the only aspect to determine UX.

- Performance is also indispensable
- DX, eco-systems affect iteration cycles

Seeking for a better UX, that is what front-end development is all about. 🐈

---

# Thank you!

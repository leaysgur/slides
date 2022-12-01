---
title: X ways to reduce your JS
class: invert
theme: gaia
---

# X ways to reduce your JS
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

# Reduce JS!

![bg right](./img/TODO:bloat.jpg)

---

## The numbers are increasing

- Top 1,000 sites
- 2017/12/15 - 2022/10/01

From [httparchive.org](https://httparchive.org/reports/state-of-javascript?lens=top1k&start=2017_12_15&end=latest&view=grid)

![bg right:45% contain](./img/js-size.png)

---

## But...

- 30 - 40% are unused 🥺
  - https://web.dev/unused-javascript/

From [Web Almanac](https://almanac.httparchive.org/en/2022/javascript#how-much-javascript-do-we-load)

![bg right contain](./img/js-bytes-unused.png)

---

## The problems

Too much, unused JS,

- slow down entire page loading
  - whether blocking or not
- consume extra network bandwith, waste mobile data costs

It makes the Web slower... 🐌

---

### Even worse

If DOM is rendered dynamically(CSR) for no reason,

- require more time and resource **after** JS are loaded
- may be less accessible on slow network, low-spec device
- even with SSR, still cause UI jank
- open in new tab run the same process again

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

for better UX, faster Web ✨

![bg right](./img/TODO:better.jpg)

---

## X. Use HTML elements properly

- `<details>` + `<summary>` for (open|close) toggle menu
- `<dialog>` for (modal|modeless) dialog
  - a11y support included 🤩
- `<datalist>` for incremental search
- `<form>`
  - with `<input type="range|color|date|month|...">`
  - and attrs like `required`, `pattern`, ...

See also https://developer.mozilla.org/docs/Web/HTML/Element

---

## X. Use Web Standard APIs

- The same as https://youmightnotneedjquery.com
- Instead of `EventEmitter`
  - `MessageChannel`, `EventTarget`
- Instead of Luxon, Day.js
  - `Intl.DateTimeFormat`
- Instead of clipboard.js
  - `navigator.clipboard`

See also https://developer.mozilla.org/docs/Web/API

---

## X. Misc

- USE! CSS! FIRST!
  - for spacing
  - for transition, animation
  - for smooth scroll
  - for variables, constants
  - etc...
- FYI: View Transitions API
  - https://github.com/WICG/view-transitions/blob/main/explainer.md#mpa-vs-spa-solutions

---

## X. Optimize build

- Refine build target defined in `.babelrc`, `tsconfig.json`
  - ~~IE? still alive?~~
- Reconsider, optimize CSSinJS solutions
  - to extract `.css`
  - you might not need Autoprefixer anymore
- Move `<svg>` icons out from JS
  - use `<defs>` + `<use>`

---

## X. Try precompiled disappearing FWs

- Like [Svelte](https://svelte.dev/)([Kit](https://kit.svelte.dev/)), [Solid](https://www.solidjs.com/)([Start](https://start.solidjs.com/))
- Declarative component as usual
- It turns into compiled and optimized code! 👻
  - no V-DOM overhead, tiny and efficient runtime

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

## X. Consider pre-rendering

- Use SSG(static site generator), instead of CSR(+SSR)
  - ≠ `next export`
- Render every pages and contents beforehand
- A.k.a. Jamstack(-y) approach
  - https://almanac.httparchive.org/en/2022/jamstack#jamstack-y-a-disclaimer
- Suitable for blog, document, company site, etc...

Base line is 0 JS!

---

## X. Stick with Server rendering

- Use classic web server and templates
  - ≠ SSR
- Render every pages and contents on the fly
  - authenticate, personalize
- CDN Edge Workers are also available
  - e.g. Cloudflare Workers

Base line is also 0 JS!

---

## X. Adopt MPA style

- Separate page(app)s by use-case
  - e.g. (Login app | Main app), (User app | Admin app)
  - As you do dynamic `import()`, async routes
- Separete truly static pages
  - ≠ `next export`

Separation of concerns! ✂️

---

## X. Visit islands architecture

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

Maximum size of JS are always used regardless of its usage.

![bg right:40% contain](./img/full-hydration.png)

---

### Partial hydration

```html
<!-- Astro component code example.
     Components w/o `client:*` are statically pre-rendered -->
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

## X. No hydration, resume it quickly

- [Qwik](https://qwik.builder.io/)([City](https://qwik.builder.io/qwikcity/overview/))
- Lazy loading everything by nature
  - PH requires marking like `client:visible`
- Even at event handler level!
  - PH can only perform at component(and its whole children) level
- Simply resume the flow that done on server
  - (P)H repeat the flow that done on server

Base line is close to 0 JS, order is _N(1)_ constantly. 🤯

---

### Qwik in action

- 0 JS on initial load
  - bootstraps are inlined in HTML
- Load minimum chunks by user action

https://todo-cloudflare-misko.sethealth.workers.dev

![bg right:40% contain](./img/qwik-todo.png)


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
- [`$`](https://qwik.builder.io/docs/advanced/dollar/) means _boundary_ as a symbol
  - can be extracted for lazy, progressive loading

---

# Summary

---

## 再掲

- もちろん要件次第であり、全てに当てはまるわけではない
- JSが本当に必要で、使ってるならいい
- ただし、妥協があったり、自信がないなら見直すべき
- そのための知識を得たはず

---

## Smaller is better

- サイズがすべてではないが、少ないにこしたことはない
- 用法用量を守って正しく使いましょう
- DXとUXのバランスを取りながら

---

# Thank you!

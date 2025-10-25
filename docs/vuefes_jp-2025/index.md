---
title: Contributing to OSS, Reflecting on OXC
---

<style>
:root {
  /* # H1 */
  --h1-color: #2c3e50;
  --heading-strong-color: #27ae60;
  /* Normal block */
  --bgColor-default: #fafafa;
  --fgColor-default: #2c3e50;
  --fgColor-accent: #27ae60;
  /* Code block */
  --borderColor-default: #007f62;
  --bgColor-muted: #f5f5f5;
  --fgColor-muted: var(--color, --fgColor-default);
  /* Misc. */
  ::selection {
    background-color: #3498db;
    color: #ffffff;
  }
}
</style>

# Contributing to **OSS**, Reflecting on **OXC**

2025/10/25 VueFes Japan 2025

---

## Hello! 👋🏻

---

### Today's theme

Personal reflection as an **open source** contributor to the **Oxc** project:

- What kind of contributions have I made?
  - Especially, what's it like to be involved with JS tooling
- What was I thinking while contributing?
  - General advice for OSS contributions

I'll touch on technical aspects, but also other topics. 

Between 2024/01/01~2025/08/31, submitted approximately [200 PRs](https://github.com/pulls?page=1&q=is%3Apr+author%3Aleaysgur+org%3Aoxc-project+created%3A%3C2025-09-01+sort%3Aupdated-desc+is%3Aclosed). 👀

---

### What is Oxc?

> The JavaScript Oxidation Compiler ⚓️
> https://oxc.rs

A set of tools for JS/TS written in **Rust** 🦀.

- https://crates.io/crates/oxc
- https://crates.io/crates/oxc_parser
- https://crates.io/crates/oxc_transformer
- https://crates.io/crates/oxc_resolver
- etc...

It covers almost [everything](https://crates.io/users/Boshen?sort=recent-updates)!

![bg right:40% contain](./img/oxc.webp)

---

### You may know...

More broadly, provided as various tools that leverage its performance:

- [`oxc-parser`](https://www.npmjs.com/package/oxc-parser): 3x faster than SWC (which is already considered fast)
  - See https://github.com/oxc-project/bench-javascript-parser-written-in-rust
  - (TS)ESTree AST compatible!
- [`oxlint`](https://www.npmjs.com/package/oxlint): 50-100x faster than ESLint
  - See https://github.com/oxc-project/bench-javascript-linter
  - 🆕 Now supports [`--type-aware`](https://oxc.rs/blog/2025-08-17-oxlint-type-aware.html) linting
  - 🆕🆕 Finally supports [`jsPlugins`](https://oxc.rs/blog/2025-10-09-oxlint-js-plugins.html)
- And more!

It's also used internally by [Rolldown](https://github.com/rolldown/rolldown), which is the core of the next version of [Vite](https://github.com/vitejs/rolldown-vite).

---

### PROTIP 💡

![bg right:66% contain](./img/protip.webp)

---

## Before and after my first PR 🌅

---

### Me and Rust 🦀

- As a front-end engineer, I **never** use Rust at work
  - Started learning with expectations (~~or hopes~~) that I might use it with WASM
- Only used for [LeetCode](https://leetcode.com) in my free time and [Advent of Code](https://adventofcode.com) at the end of each year
  - Repeating the cycle of learning <-> forgetting for 3 years!

In the fall of 2023, finally I realized.
Is that contributing to OSS might be the best way to learn it? 🤔

---

### Me and OSS

- Fortunately, I'm not a total newbie 😀
- Occasionally submit PRs to major OSS, participate in discussions on issues
- I also publish and maintain my own projects

But I've never been deeply involved in a specific project.

---

### a.k.a. "半年ROMれ"

- I knew about Oxc's momentum and was interested
  - But didn't know where to start
  - And wasn't particularly skilled in Rust
- So I watched ALL Commits/Issues/PRs, just observing for a while
- Wrote code without submitting PRs, comparing with others' merged PRs

> Lurk Moar | Know Your Meme
> https://knowyourmeme.com/memes/lurk-moar

---

### Don't want to bother maintainers 😓

To follow the norms, start by understanding first.

- Check almost all issues
  - Context and reasons for closed and also duplicated
  - Which issues have higher priority
- Who's active (their areas, timezones, etc.)
- Learn conventions for code and beyond
  - Labels like `Good first issue` and `Help wanted`
  - Performance-focused (benchmarks run per PR!) project
  - Current limitations, difficulties (e.g., no TS type info available)

㊗️ 2023/12: `oxlint` GA [announced](https://oxc.rs/blog/2023-12-12-announcing-oxlint.html)

---

### 2024/01: My first PR

> feat(tasks): Add eslint-plugin-jsdoc rulegen by leaysgur · Pull Request #1965 · oxc-project/oxc
> https://github.com/oxc-project/oxc/pull/1965

Just added a template generation command for linter rule implementation. 😅

(I found that I'd given up on implementing `eslint-plugin-jsdoc` rules at this time...)

---

### `tasks/lint_rules` CI

- CI task to [visualize](https://github.com/oxc-project/oxc/issues/684) rule implementation progress per plugin
  - GHA that installs ESLint plugins locally and compares with Rust code string parsing results
- Written in JS, not Rust
  - A certain plugin dynamically defined rule lists in JS, which Rust couldn't parse

![bg right:45% contain](./img/lint_rules.webp)

---

### Coding is just one way to contribute

- You can contribute to Rust projects without writing Rust
- Actually, such opportunities are everywhere
  - Playground: https://github.com/oxc-project/playground
  - Docs: https://github.com/oxc-project/oxc-project.github.io

Just commenting on issues, chatting on [Discord](https://discord.com/invite/9uXCAwqQZW), or sharing usage insights, reproduction and research results - all are OSS contributions!

---

## VS JSDoc 🏺

---

### Pandora's box

> feat(ast,parser): parse jsdoc · Issue #168 · oxc-project/oxc
> https://github.com/oxc-project/oxc/issues/168

- Issue left untouched since 2023/03
  - Buried at the bottom of the issue list for a long time!
- Initially opened it light-heartedly
  - Nobody doing it = good chance to learn Rust thoroughly?
  - Revenge for the `eslint-plugin-jsdoc` I gave up on
  - Used JSDoc TS often at work, felt somehow doable

Soon learned why nobody touched it... 😇

---

### What is JSDoc?

```js
/**
 * @param {string} somebody - Somebody's name.
 */
function sayHello(somebody) {
  alert("Hello " + somebody);
}
```

---

### What is JSDoc?? 🤔

```ts
/**
 * Code blocks are great for *examples*
 *
 * ```ts
 * // run typedoc --help for a list of supported languages
 * const instance = new MyClass();
 * ```
 */
export class MyClass {}
```

---

### All about JSDoc

```js
/************************************
 * @you    @also       @your    @tag
 *     @can     @create     @own

   @omg
*************************************/
```

- Multi-line comments starting with `*`
- Can write `@tag` to freely assign meaning
- No spec defined

＼NO SPEC DEFINED!／

---

### Who owns comments?

They can be written anywhere, requires considering newlines and also spaces.

```js
/** `const`, `x` or arrow function? */
const x = () => {};

// Do you remember Flow?
function method(param /*: string */) /*: number */ {
  return 1;
}
```

Comment-to-AST mapping is a tricky topic, not standardized area.

> Standardize Comment Types · Issue #201 · estree/estree
> https://github.com/estree/estree/issues/201

---

### `eslint-plugin-jsdoc`: `tagNamePreference` option

```json
"jsdoc": {
  "tagNamePreference": {
    "param": "arg",
    "returns": "return"
  }
}
```

- [Option](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/settings.md#alias-preference) to alias tags with arbitrary names!
- Means parser can't statically parse without knowing ESLint config

In this case, must handle everything dynamically at runtime...

---

## And time passed...

---

### Managed it somehow

- Landed as an implementation specialized for `eslint-plugin-jsdoc`
  - [`get_function_nearest_jsdoc_node()`](https://github.com/oxc-project/oxc/blob/498814c659f6fd7f0fec4e25f3b5537bf54aeb94/crates/oxc_linter/src/utils/jsdoc.rs#L58)
  - Provide several runtime methods per use case
- Burned out after implementing 18 rules... 😶‍🌫️
  - [☂️ eslint-plugin-jsdoc · Issue #1170 · oxc-project/oxc](https://github.com/oxc-project/oxc/issues/1170)

IMPORTANT: After that, my use of JSDoc TS drastically decreased.

---

### As much history, as many circumstances

- For JSDoc, everything depends on use case
  - Who owns the comments
  - What syntax is available
- Everyone has their own implementation
  - Original [JSDoc](https://jsdoc.app), [TypeDoc](https://typedoc.org), [JSDoc TS](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html), [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc), etc...

Comments are a constant headache in JS tooling. 👹

---

### Further reading 🫠

- [JavaScriptのASTにおける、コメントの扱いについて | Memory ice cubes](https://leaysgur.github.io/posts/2024/01/30/132331/)
- [gajus/eslint-plugin-jsdocのコードを読む Part 1 | Memory ice cubes](https://leaysgur.github.io/posts/2024/02/22/133316/)
- [gajus/eslint-plugin-jsdocのコードを読む Part 2 | Memory ice cubes](https://leaysgur.github.io/posts/2024/02/22/140322/)
- [gajus/eslint-plugin-jsdocのコードを読む Part 3 | Memory ice cubes](https://leaysgur.github.io/posts/2024/02/22/143218/)
- [TypeScriptのASTにおける、JSDocの扱いについて | Memory ice cubes](https://leaysgur.github.io/posts/2024/02/28/162354/)
- [現存するJSDocタグのまとめ | Memory ice cubes](https://leaysgur.github.io/posts/2024/03/18/093214/)
- [JSDocをサポートするということ Parse編 | Memory ice cubes](https://leaysgur.github.io/posts/2024/04/26/145407/)
- [JSDocをサポートするということ Attach & Find編 | Memory ice cubes](https://leaysgur.github.io/posts/2024/06/11/155339/)

---

## Road to the `eslint/no-invalid-regexp` 🗻

---

### `/Hello,? [rR]egular(_|-)expression/v`

If an invalid `RegExp` literal exists, it is invalid JS code!

![Lone "{" is invalid regexp with "v" flag](./img/regexp.webp)

- Parser want to detect this
  - [feat(linter): regex parser · Issue #1164 · oxc-project/oxc](https://github.com/oxc-project/oxc/issues/1164)
- Also want to implement related ESLint rules with parsed results
  - [no-invalid-regexp - ESLint - Pluggable JavaScript Linter](https://eslint.org/docs/latest/rules/no-invalid-regexp)

Several brave souls tried, but the path remained unfinished. 🫡

---

### A journey of a thousand miles

- (~~Unlike JSDoc~~) RegExp has a [spec](https://tc39.es/ecma262/2025/multipage/text-processing.html#sec-regexp-regular-expression-objects) ✨
- However, didn't know how to read BNF
  - Did a bit of packet parsing when working on WebRTC
- Started by studying prior arts
  - `oxc_parser` itself
  - https://github.com/jviereck/regjsparser
  - https://github.com/eslint-community/regexpp

![bg right:40% contain](./img/bnf.webp)

---

### How to proceed when you don't know

- [Visualize](https://github.com/oxc-project/oxc/pull/3824) tasks
  - List even research plans as tasks
- Share progress and concerns frequently
- Ask immediately when stuck

Communication matters in both work and OSS.

![bg right:40% contain](./img/regex_progress.webp)

---

## And time passed...

---

### Did it! ✌🏼

- First implementation took ~1.5 months
  - Rewrote several times along the way
  - At that time, AI was not good
- Initially, I didn't make any progress at all 🍃
  - But kept going step by step, understanding deepened daily
- Handling bug fixes and edge cases, everything settled after ~3 months

Also implemented proposals that were still Stage 3.

---

### About parsing ECMAScript

- Don't necessarily need to parse in spec order
  - OK as long as it parses correctly
  - `oxc_parser` is prime example, heavily tuned 🏎️
  - Though new syntax additions can be tricky
- There's a legacy called Annex B
  - Loose syntax kept for web backwards compatibility
  - Had to rewrite because of this, code increased +30%

---

### About parsing `RegExp`

- [30 Minutes to Understand All of `RegExp` Syntax](https://leaysgur.github.io/slides/jsconf_jp-2024/)(en)
  - My talk slide at JSConf JP 2024
- Supporting not just `/a'b"c/` but also `new RegExp("a'b\"c")` was hard
  - In JS, escapes are automatically resolved: `"\"".length === 1`
  - Must consider escapes when reporting positions in source
    - And also surrogate pairs...

---

### Further reading 🔖

- [@eslint-community/regexpp のコードを読む | Memory ice cubes](https://leaysgur.github.io/posts/2024/06/19/114102/)
- [ECMAScriptのRegExpに関するプロポーザルのまとめ | Memory ice cubes](https://leaysgur.github.io/posts/2024/07/12/101358/)
- [JSで書かれたECMAScript RegExpパーサーの比較 | Memory ice cubes](https://leaysgur.github.io/posts/2024/08/05/143855/)
- [ECMAScript `RegExp`パーサー実装の手引き Part 1 | Memory ice cubes](https://leaysgur.github.io/posts/2024/08/27/092541/)
- [ECMAScript `RegExp`パーサー実装の手引き Part 2 | Memory ice cubes](https://leaysgur.github.io/posts/2024/08/27/093543/)
- [ECMAScript `RegExp`パーサー実装の手引き Part 3 | Memory ice cubes](https://leaysgur.github.io/posts/2024/08/27/095042/)
- [Rustで正規表現パーサーを実装していたら、なぜか文字列リテラルパーサーを実装していた | Memory ice cubes](https://leaysgur.github.io/posts/2024/10/23/124919/)
- [文字エンコーディングについてのざっくりまとめ | Memory ice cubes](https://leaysgur.github.io/posts/2024/07/19/112121/)

---

## First Half Summary ☕️

---

### JUST DO IT.

- Even without experience, you can do more than you think
  - Takes time, but consistency is key 🐢
- Communication skills needed everywhere
  - Can learn in OSS and apply to work or vice versa
- In the AI era, even people with less coding skills can contribute
  - But don't forget about reviewers...

---

### My motivation back then

> https://x.com/lukeed05/status/1829527267162345651

OSS maintenance is hard, hoped my small contribution could help. 🙏

![bg right contain](./img/boshen2.webp)
![bg right contain](./img/boshen1.webp)

---

### 2024/10: void(0) announcement

> Announcing VoidZero - Next Generation Toolchain for JavaScript | VoidZero
> https://voidzero.dev/posts/announcing-voidzero-inc

Relief. ☺️

Thought casually "more OSS becomes actual work"?

![bg right:40% contain](./img/vz.webp)

---

### Achievements unlocked 🔓

- Became OSS core member
  - [Meet the Team | The JavaScript Oxidation Compiler](https://oxc.rs/team)
- Got paid for OSS work
  - [[$50 Opire Bounty] feat(linter): eslint/no-invalid-regexp · Issue #611 · oxc-project/oxc](https://github.com/oxc-project/oxc/issues/611)
- Got GitHub sponsors
  - Thank you very much for the past and current sponsors 💖

---

## To the second half 🚀

---

## The Art; Prettier formatter 🖨️

---

### Rewrite Prettier in Rust!

> Rework `oxc_prettier` · Issue #5068 · oxc-project/oxc
> https://github.com/oxc-project/oxc/issues/5068

Like already did with ESLint -> `oxlint`.

This time, started with ~40% already implemented.
Should've just needed to keep improving coverage.

![bg right:35% contain](./img/prettier.webp)

---

### Steady work again... 🏃🏻

- Read and summarized Prettier code
  - [Prettier のコードを読む Part 1 | Memory ice cubes](https://leaysgur.github.io/posts/2024/09/02/103846/)
  - ...(omitted)
  - [Prettier のコードを読む Part 10 | Memory ice cubes](https://leaysgur.github.io/posts/2024/10/08/132257/)
- [Visualized progress and organized TODOs](https://github.com/oxc-project/oxc/issues/5068#issuecomment-2507272735)

The more I learned, the less I felt I could do it alone.

Didn't need to do it all alone, wanted anyone to join. 🙌🏻

---

## And time passed...

---

### However...

A few months spent, ~30 PRs done, but progress was... 😵‍💫

- Not many people joined, and my availability was also fragmented
- Tracing dynamic JS code is hard
  - How do we get this into completely static Rust world?
  - BTW, `debugger` in DevTools is really great
- Different AST structure, concerns everywhere
  - Comments headache again and again
  - Especially complex, requiring per-location, per-node, per-use-case handling

After consideration, decided to abandon direct Prettier port approach.

---

### Fork `biome_formatter`

Instead, decided to fork  Biome's Formatter infrastructure.

- [`biome_formatter`](https://github.com/biomejs/biome/tree/main/crates/biome_formatter) crate
  - On top of this, `biome_js_formatter` and `biome_xxx_formatter` are built
- Still needs modification
  - To work with Oxc AST, from Biome CST

It's good that working code can be reused.

![bg right:40% contain](./img/biome.webp)

---

## And time passed...

---

### However...

Eventually gave up and handed it off... 😢

- Oxc's performance relies on strict memory handling and lifetime annotations
- Biome's code is polished, heavily uses traits and macros
  - IR is also different, more sophisticated structure than Prettier

When these are combined, I got completely lost.

Entirely due to my lack of Rust skills, truly frustrated...

---

## And time passed...

---

### THIS IS VoidZero 🔥

- Implementation progressed rapidly, now 90%+ coverage
  - Different league... 😂
- Will be available as `oxfmt` soon!
  - [RFC: Formatter · oxc-project/oxc · Discussion #13608](https://github.com/oxc-project/oxc/discussions/13608)

![bg right:45% contain](./img/dq.webp)

---

### Learned my limits

- Even with motivation, impossible is impossible
  - Time is finite, businesss constraints also exist
- But feedback from research and insights has value (I hope)
  - Capable people make good use of it
- Felt like one of the hardest parts of Rust

Both Prettier and Biome, everyone are great.
Me: Hang in there!

🎂 [Vjeux » Birth of Prettier](https://blog.vjeux.com/2025/javascript/birth-of-prettier.html)

---

## ESTree compatible AST 🌲

---

### What is Abstract Syntax Tree?

```js
hello (
  "VueFes"
  );
```

It's a tree-like data structure that represents the syntactic structure of source code.

![bg right:33% contain](./img/ast.webp)

---

### What is ESTree?

> estree/estree: The ESTree Spec
> https://github.com/estree/estree

The de facto standard AST structure for JavaScript.

- Many parsers produce ESTree compatible AST
- Some parsers use their own ASTs
  - Babel, TypeScript Compiler, SWC, etc...

Essential to support for existing ecosystem.

---

### ESTree support for `oxc-parser`

- `oxc_parser`(Rust) also has its own AST structure
  - Somewhat similar to Babel, but different
- `oxc-parser`(JS) should produce ESTree AST though

👉🏻 Task: Somehow map and convert structures.

> [Align JS-side AST with standard for JSX · Issue #9703 · oxc-project/oxc](https://github.com/oxc-project/oxc/issues/9703)
> [Align JS-side AST with standard for TypeScript · Issue #9705 · oxc-project/oxc](https://github.com/oxc-project/oxc/issues/9705)

JS was already done, but JSX and TS were WIP.

---

### Though it's de facto

ESTree only specifies pure JS; JSX and TS are out of scope.

So, follow well-known parsers as prior implementations.

- JSX: [`acorn`](https://github.com/acornjs/acorn) + [`acorn-jsx`](https://github.com/acornjs/acorn-jsx)
- TS, TSX: [`@typescript-eslint/typescript-estree`](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/typescript-estree)

---

### Simple as a task

```js
// 1. Prepare sample code
const INPUT = `class X {}`;

// 2. Output AST with prior implementation
// 3. Output AST with Oxc too
const [theirsAst, oursAst] = [parseTheirs(INPUT), parseOurs(INPUT)];

// 4. Compare both ASTs
const diff = diffAst(therisAst, oursAst);

// 5. If there's a diff, write conversion code
if (diff) {
  console.log("TODO: Mismatch!");
}
```

Easy, right? 🫣

---

### Wrote JS here too

[![](./img/estree_diff.avif)](https://github.com/leaysgur/oxc_estree_ts-ast-diff-viewer)

---

### Difficulty: Easy 😄

- Just rename
  - `(String|Boolean|...)Literal` > `Literal`
  - `XxxExpression.(expression|field)` > `.property`
- Just skip unnecessary fields
- Flatten nesting: spread, append, prepend
- Just add fixed value fields
- `None` to `[]` or `false`
- etc...

Just add custom attribute macro `#[estree(...)]` to `struct` fields, then implementation auto-generated at [build](https://github.com/oxc-project/oxc/blob/main/tasks/ast_tools/src/derives/estree.rs) time. Beautiful!

---

### Difficulty: Medium 🤨

```ts
class X {
  constructor(
    // type: Identifier
    name: string,
    // type: TSParameterProperty 👈🏻
    private age: number,
  ) {}
}
```

Need to manually add logic to convert AST to desired structure.

```js
// Simplified ver.
if (param.has_modifier()) {
  return { type: "TSParameterProperty", ... };
}

return { type: "Identifier", ... };
```

---

### Difficulty: Hard 🤯

```ts
module X.Y.Z {}
```

- Oxc AST: Nested `TSModuleDeclaration` x3
- TS-ESTree: Single `TSModuleDeclaration` and nested `TSQualifiedName` x3

AST structures can be completely different!

---

## And time passed...

---

### We did it!

- Reached 100% compatibility for JS, JSX, and TSX! 🎉
- Strictly speaking, some differences still remain
  - Missing [`loc`](https://github.com/oxc-project/oxc/issues/10307), JSX [HTML Entities](https://github.com/oxc-project/oxc/issues/9667) differences, etc.

As a result of compatibility:

- Prettier can now use oxc parser
  - [`@prettier/plugin-oxc`](https://github.com/prettier/prettier/tree/main/packages/plugin-oxc)
- A necessary step for `oxlint` JS plugins

---

### ESTree Tips

- Not spec-driven, just a "result" of historical evolution
  - Properties like `raw` are common but not in spec
    - [ESTreeの`Literal`ノードの`raw`プロパティ | Memory ice cubes](https://leaysgur.github.io/posts/2025/03/11/124250/)
- No AST node representing `(`...`)`
  - Essential for `/** @type */(foo)`, `(1 + 2) * 3`
  - May change code behavior
    - `fn.name`: `(fn) = function () {}` vs `fn = function () {}`
  - Some parsers have option to preserve it
- Both are called TS-ESTree with different AST structure...
  - `@typescript-eslint/typescript-estree`
  - `@sveltejs/acorn-typescript`

---

### Even for JS diffs...

- 👈🏻 JS: `acorn`
- 👉🏻 TS: `@typescript-eslint/typescript-estree`

Even between TS's JS and JS's JS, many subtle differences exist.

> JS Multi AST Viewer
> https://leaysgur.github.io/js-multi-ast-viewer/

![bg right:50% contain](./img/estree.webp)

Where is your ESTree from?

---

## Best TS parser without type check 🚨

---

### More strict, more reliable

> parser: Improve TS error story · Issue #11582 · oxc-project/oxc
> https://github.com/oxc-project/oxc/issues/11582

- There is a coverage to verify TS syntax support
  - 🅰️ Expect to parse (without syntax errors)
  - 🅱️ Expect to fail (with syntax errors)
- Currently, 🅰️ is high (99%) but 🅱️ is low (40%)
  - Errors requiring type info, dragging it down

Too many false positive logs, might be missing things we should catch.

👉🏻 Task: Identify errors for exclusion.

---

### TSC baseline test fixtures

> https://github.com/microsoft/TypeScript/tree/main/tests

- This is snapshot collection for TSC: parser/checker/bundler/etc
  - Type errors, config errors, errors only in old ES versions, etc...
  - Contains `.css`, `.map`, `.md`, even invalid `.ts` file

Need to filter out what `oxc_parser` doesn't care about.

![bg right:45% contain](./img/ts_snap.webp)

---

### TSC Diagnostics

> error TS2322: Type 'number' is not assignable to type 'string'.

- Error codes are separated, but can't judge mechanically
- APIs are separate too, but...
  - `tsProgram.getSyntacticDiagnostics()`
  - `tsProgram.getSemanticDiagnostics()`
    - Some mixed in that seem like syntax errors

In conclusion, there's no other way but to check each item one by one. 😬

Want to let AI judge everything, but effort to review 🆚 do it myself...

---

### Yet another (vibed) viewer...

[![](./img/tsc_err.webp)](https://github.com/leaysgur/tsc-error_diagnostic_codes-viewer/)

---

### Can't read TSC

- Can't read in TypeScript
- Can't read even in Go

Just wish AI (or someone with AI) would rewrite it in Rust soon. 🙏

---

### Further reading 🙂

- [TypeScriptのテストファイルの読み方 | Memory ice cubes](https://leaysgur.github.io/posts/2025/04/30/110214/)
- [TypeScriptの`Diagnostics`について | Memory ice cubes](https://leaysgur.github.io/posts/2025/06/13/131109/)
- [続・TypeScriptの`Diagnostics`について | Memory ice cubes](https://leaysgur.github.io/posts/2025/06/18/130151/)
- [TypeScriptCompilerのベースラインとテストの仕組み | Memory ice cubes](https://leaysgur.github.io/posts/2025/06/16/103331/)

---

## Summary 🍵

---

### Why contribute to OSS?

- Fun, can do things contrasting with routine work
  - Senior at work, junior in OSS
  - Every day brings new discoveries (both good and bad)
- Meet various people in the world
  - Even unreachable people in the clouds
  - (When do these people sleep or rest? 🤔)
- Also a form of social contribution
  - Can get paid or turn into work
- Can write lots of blog posts ✌🏼
  - AI can write technical docs, but not personal writing

---

### There's always something to do

- Just not visible yet
  - Not everyone likes TODO lists, so organizing issues may help
- You can start from today:
  - Handle duplicate issues, comment on discussions, help with repros
  - Add missing docs, or just fix typos, make logs more readable, perf improvement
  - etc...
- Just post your feedback!
  - Especially positive, it helps us a lot! 🥰

Still, I recommend to understand the project culture (at least `CONTRIBUTING.md`) before jumping in. Some are welcoming, others have (occasionally high) standards.

---

### Now, with AI

- Less to do, but not gone
  - Easy, quick tasks will disappear
  - Easy but tedious work will disappear
- AI is impressive, but it still has limitations (for now)
  - It heavily depends on the person who controls
- On the flip side, AI lets you explore new domains!

Just be careful for AI slop... 🤖

---

### With love and respect ❤️

- It's free to use, we should express our gratitude
- Don't forget that there are people behind it
- It's even better if you can contribute in some way!

---

## About me 🙏

---

### Yuji Sugiura

- Software Engineer at [VoidZero Inc.](https://voidzero.dev)
  - 🆕 2025/09/01~
- [Oxc](https://oxc.rs) ⚓️ Core team
  - Working on `oxfmt`

Father, husband, living in Shiga pref.

![bg right:45%](../public/img/prof-2.jpg)

---

### @leaysgur

- X(Twitter): [@leaysgur](https://x.com/leaysgur)
- GitHub: [leaysgur](https://github.com/leaysgur/)
- Blog: [Memory ice cubes](https://leaysgur.github.io/posts/)

![bg right:45%](../public/img/doseisan-2.jpg)

---

### [PR] Let's communicate!

- X(Twitter): https://x.com/OxcProject
- GitHub: https://github.com/oxc-project/oxc
- Discord: https://discord.com/invite/9uXCAwqQZW

私にはもちろん日本語で大丈夫です 👋🏻

![bg right:40% contain](./img/oxc.webp)

---

# Thank you!

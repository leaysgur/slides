title: 0からはじめるFlow
controls: false
--

# 0からはじめる<a>Flow</a>

## &nbsp;
## 2016/06/29 Node学園 21時限目

--

### はじめまして

- Yuji Sugiura / [@leader22](https://twitter.com/leader22)
- フロントエンド・エンジニア at PixelGrid Inc.
- 前々回にイカの話してたやつです
- 最近は仕事でなぜかコードゴルフしてます

![leader22](./img/doseisan.jpg)

--

![Flow](./img/flow.png)
## 本日のお題

--

# 1.名前を知ってる人！

--

# 2.さわったことが<br>ある人！！

--

# 3.TodoApp相当より<br>大きいもの or 実務で<br>使ってる人！！！

--

### 3の人へ

- 知ってることばっかりかも
- なんか間違ってたら教えてください！
- というか聞きたいことがあります！！

後の懇親会では是非ともよろしくお願いします！！！

--

### あらためまして
「0からはじめる」というタイトルですが、正確には、

- 型とは無縁なJSerが
- Flowで型のある世界に飛び込んで
- 案の定いろいろハマって
- あれこれ<s>もがき苦しんだ</s>学んだことを

これからはじめる1, 2の人に伝えたい10分間です。

--

### そんな汗と涙の結晶

- \#スーパーイカメーカー
- https://github.com/leader22/ika-maker
- DAU: 1000ちょい
- アプリとしての規模は大きくない

![](./img/ika.png)

--

# というわけで
## \#スーパーイカメーカーに<br>後からFlowを導入して<br>その過程でハマったことと学びについて

--

# 準備編

--

### 必要なもの

- `flow-bin`
  - Flow本体
- `babel-plugin-transform-flow-strip-types`
  - 型の定義(!== js)をはずすやつ
- `babel-plugin-transform-class-properties`
  - https://github.com/jeffmo/es-class-fields-and-static-properties 

最後のやつが地味に重要。

--

### というのも

`transform-class-properties`を使ってない場合、<br>
公式に言われるがままにClassに型をつけた瞬間、<br>Babelのコンパイルがコケる！

```ts
// 問題のコード
class C {
  x: string; // <- コレ
  y: number;

  constructor(x) { this.x = x; }
  foo() { return this.x; }
  bar(y) { this.y = y; }
}
```

アプリのコードで一切使ってなくてもコケます。

--

### モジュールの方式別の回避策

- CommonJS
  - `passPerPreset`（後述）で先に`transform-flow-strip-types`する
  - OR おとなしく `transform-class-properties`足す
- ES Modules
  - `transform-class-properties`するしかない
  - `passPerPreset`で先に`transform-flow-strip-types`してもダメ

環境整備の段階でコケられると心がまじで折れる・・。

--

### `passPerPreset`

Babel 6.5から入ったプラグイン、プリセットの処理順を指定できる機能。

```javascript
// .babelrc
{
  passPerPreset: true,
  presets: [
    {
      plugins: [ "babel-plugin-transform-flow-strip-types" ]
    },
    "es2015",
    "react"
  ]
}
```

Stage1の機能なんか使いたくないなーと思ったけど、結局コレもEXPERIMENTALな機能やので、<br>おとなしく`transform-class-properties`！！！

--

# 導入編

--

### 作業の流れ

やるからにはきっちり型つけたい！

- 1ファイルずつ、`@flow`コメントをいれる
- Flowに怒られる部分があるので、そこをなおす
- 手当たり次第に型をつけていく

しかしそれが地味に大変で・・。

--

### 既存コードに後から型付けるの is 面倒

```javascript
// 元コード
const FOO = {
  1: 'foo',
  2: 'bar',
};

// なおした
const FOO = {
  '1': 'foo',
  '2': 'bar',
};
```

オブジェクトに数値キーがダメやったり。

--

### 既存コードに後から型付けるの is 大変

```ts
// 元コード
function foo(val) {
  val = val|0;
  // ...
}

// 型付けた（ら怒られた）
function foo(_val: string) {
  const val: number = _val|0;
  // ...
}

// なおした
function foo(_val: string) {
  let val: number = parseInt(_val, 10);
  val = isNaN(val) ? 0 : val;
}
```

ビット演算子でキャストするのもダメ。<br>
気付けば息を吸う用に使ってたので大打撃・・。

--

### 既存コードに ...

```html
<input type="text" onChange={this.onChangeInput} />
```

```ts
onChangeInput(ev: Event) {
  const action = {
    target: this.props.partsName,
    text:   ev.target.value // ココでエラー
  };
  this.dispatch('set:text', action);
}
```

`EventTarget`に`value`なんかねえよ！って言われる。

--

### 面倒くささが勝ってくる

```ts
// ev.targetはEventTargetであると同時にHTMLInputElement
// そして`value`プロパティがあるのはそっちなので、Dynamic Type Testsして回避する
onChangeInput(ev: Event) {
  if (ev.target instanceof HTMLInputElement) {
    const action: SetTextAction = {
      target: this.props.partsName,
      text:   ev.target.value
    };
    this.dispatch('set:text', action);
  }
}
```

他にも似たようなのが色々出てくるが、面倒くさいと思ってはいけない・・(˘ω˘ )

--

### 困ったときのコメント

```sh
# .flowconfig
[options]
suppress_comment= \\(.\\|\n\\)*\\flow-disable-line
```

こう書いておくと、

```ts
// flow-disable-line
const str: string = 1;
```

その行のエラーを無視できる・・・！

--

# なにかに困ったら

--

### 必読ドキュメント

#### [Flow | Quick Reference](https://flowtype.org/docs/quick-reference.html)
<s>だいたいのこと書いてるけど困った時は助けてくれない</s>

#### [flow/lib at master · facebook/flow · GitHub](https://github.com/facebook/flow/tree/master/lib)
Flow側で定義済みの型が置いてあるディレクトリ

- core.js
- dom.js
- cssom.js
- react.js <- 身内やん

--

### 余力あれば

#### [Advanced features in Flow - sitr.us](http://sitr.us/2015/05/31/advanced-features-in-flow.html)

ドキュメントに載ってない記法が紹介されてる（ただし1年前の記事）

#### [flow/type_annotation.ml at master · facebook/flow · GitHub](https://github.com/facebook/flow/blob/master/src/typing/type_annotation.ml#L147-L328)

そのドキュメントに載ってない記法が実装されてるぽい箇所（OCaml読めません）

--

# 続・導入編

--

### Destructuringに型

```ts
const A = { a: '1', b: 2, c: true };
const { a, b, c, }: { a: string, b: number, c: boolean } = A;

// コレはダメ
const { a: string, b: number, c: boolean, } = A;
```

公式のDestructuringのページに書いてないからねコレ！

#### 普通のオブジェクトに型

```ts
const A: {
  a: string, b: number, c: boolean,
} = { a: '1', b: 2, c: true };
```

さっきとは逆で、型 > 値の順。

--

### Typeエイリアス便利
ビルトインの型以外に、自分で型を作れる機能。

```ts
// 文字列か数値
type StrOrNum = string | number;

// 'A'という文字列 || 'B'という文字列
type AorB = 'A' | 'B';

// これらの型を持つObject
type TabItem = {
  id:    string,
  order: number,
  name:  string,
};

// そんなObjectの配列
type TabItems = TabItem[];
// 違う書き方
type TabItems = Array<TabItem>;
```

FluxのActionとかをまとめたり。

--

### $Keys&lt;T&gt;（元 $Enum&lt;T&gt;）

ドキュメントに載ってない記法シリーズ。

```ts
const CARD_TYPES = {
  "Diamonds": "Diamonds",
  "Clubs":    "Clubs",
  "Hearts":   "Hearts",
  "Spades":   "Spades"
};

type CardTypes = $Keys<typeof CARD_TYPES>;
```

としておいて、

```ts
const type1: CardTypes = 'Diamonds'; // ok
const type2: CardTypes = 'Fooo'; // error
```

まぁもちろんEXPERIMENTALなんでしょうね。

--

### 続きはWebで

0からはじめるFlow Part.1<br>http://lealog.hateblo.jp/entry/2016/06/21/104558

0からはじめるFlow Part.2<br>http://lealog.hateblo.jp/entry/2016/06/21/104558

--

# まとめ

--

### やってみてよかった

- 謎の安心感
- 型推論すごい便利
- typoとかもすぐわかる <- 重要
- W3Cの仕様書とかも読みやすくなる
- 変数名から型を匂わせる記載も消えてすっきり

コスパの良いツールだと思うので、Babelれる新規プロジェクトでは前向きに使っていきたい所存。

--

### でもあんまり流行ってない・・？

- 検索しても全然引っかからん
- 日本語の記事は全部読んだ感ある
- TodoApp以上のサンプルがほぼない
- 公式のExampleがしょぼい気が・・

使われてないのか、みんな内緒にしてるのか！

--

### flow-typedさん...
#### https://github.com/flowtype/flow-typed

- Flow版の[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- まだ44コしか登録されてない（2016/06/24時点）

`tsc`がもっと速くなったら・・TypeScriptに・・

--

### 型付けのベストプラクティス知りたい

- 効率的な・より的確な型の付け方とは・・
- 型を定義するファイルをどこに置くべきとか
- ジェネリクスとかいつ使うの

型々してる人！ぜひこのあと教えてください！

--

# Thank you!

<script>
// 時間管理するの面倒なので経過時間をこっそり出す
(function(global) {
  const timer = document.createElement('div');
  timer.textContent = '0';
  timer.id = 'timer';
  document.body.appendChild(timer); 

  setInterval(function() {
    const now = timer.textContent|0;
    timer.textContent = '' + (now + 1);
  }, 1000 * 1);
}(this));

// モバイルでcontrolsない場合に詰むので
(function(global) {
  const isMobile = 'ontouchstart' in global;
  if (isMobile === false) return;
  
  document.body.addEventListener('click', (ev) => {
    const isRight = (global.innerWidth / 2) < ev.clientX;
    const dir = isRight ? 1 : -1;
    global.navigate(dir);
  }, false);
}(this));
</script>

<style>
:root {
  --bg-color: #FAF2E6;
  --bar-color: #D68B00;
  --em-color: #D68B00;
}

#timer {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;
  color: inherit;
  font-size: 10%;
  padding: 5px;
}

.progress {
  z-index: 1;
}

.progress-bar {
  background-color: var(--bar-color);
}


a,
a:hover {
  color: var(--em-color);!important;
}

h1 {
  font-size: 220%;
}

h3 {
  border-color: var(--bar-color);
}

pre,
code {
  background-color: #fff;
}
pre {
  padding: 2%;
}
code {
  padding: 0 2%;
}
pre > code {
  padding: 0;
}

ul {
  padding: 10px 0 10px 60px;
}

.slide {
  background-color: var(--bg-color);
}

.slide-content {
  overflow: scroll;
}

.slide-content img {
  display: block;
  margin: 0 auto;
  max-width: 50%;
}
</style>
title: MobXではじめるReactiveアーキテクチャ
controls: false
--

# <a>MobX</a>ではじめる<a>Reactive</a>アーキテクチャ

## &nbsp;
## 2017/06/21 Frontend de KANPAI!

--

### はじめまして

- Yuji Sugiura / [@leader22](https://twitter.com/leader22)
- フロントエンド・エンジニア at [PixelGrid Inc.](https://www.pxgrid.com/)
  - そういえばDeNAで働いてた頃もありました
- 最近はWebでリアルタイムな動画とかWebRTCとかやってます
- ブログにもいろいろ書いてます -> [console.lealog();](http://lealog.hateblo.jp/)

![leader22](../public/img/doseisan.jpg)

--

### [PR] 技術メディアやってます（有料）
![CodeGrid](./img/cg.png)

## [CodeGrid - フロントエンドに関わる人々のガイド](https://www.codegrid.net/)

--

# 本日のテーマ

--

![mobx](./img/mobx.png)
## MobX

--

### お品書き
- <a>MobX</a>とは
  - どんなライブラリなのか
  - どんな感じのコードになるか
  - どういう考え方で使うと良さそうか
- MobXを使った<a>Reactive</a>なアーキテクチャの例
  - 作者直々のサンプルコードより

いちおうContributorもやってるので、なにか質問等あれば、この後の懇親会でもTwitterとかでもお気軽に！

--

### これからのフロントエンドに求められ(略
- なのかと言われると・・
- 世に星の数ほどあるただのライブラリの紹介です
  - 既に知ってたら聞き流してください

必要なものを自分で見て「選択」する力を試すということで・・(˘ω˘ )

--

# <a>MobX</a>とは

--

### MobXとは

- Webアプリケーションにおける状態（`state`）を管理するためのライブラリ
- https://github.com/mobxjs/mobx
  - 現在の最新バージョンは`3.1.16`
  - GitHubのスターは9.6k↑
  - TypeScript製（Flowの型定義も一応あるよ）
  - 0 Dependencies！
- 作者は[@mweststrate](https://twitter.com/mweststrate)氏

Reactと相性がよいのであわせて使われることが多いけど、別に依存関係はないです。

--

### MobXよもやま

- 各ライブラリのの公式ページでも言及されてたり
  - [Context - React](https://facebook.github.io/react/docs/context.html#why-not-to-use-context)
  - [他のフレームワークとの比較 - Vue.js](https://jp.vuejs.org/v2/guide/comparison.html#MobX-%E3%81%A8%E7%94%A8%E3%81%84%E3%81%9F%E5%A0%B4%E5%90%88)
- reactjs/reduxとの比較
  - [Dan Abramovさんのツイート](https://twitter.com/dan_abramov/status/720219615041859584)
  - [React Amsterdam Conference 2017 - YouTube](https://www.youtube.com/watch?v=m_vUUgI0bo8&feature=youtu.be&t=8h29m30s)
- ついにヨーロッパ最大のReactカンファレンスでも
  - [ReactEurope 2017 Day 2 AM - YouTube](https://youtu.be/nhNiKel6U9Y?t=1h8m33s)

海外では既にそれなりに、日本でも少しずつ認知されてきた感がある今日このごろ。

--

# MobXの基本

--

### 3つの概念

![idea](./img/idea.png)

- Actions: Stateを変更すること
- State: 状態それ自体
- Reactions: 状態を使って何かすること全般
  - Views: 状態を使って、画面を表示する

`Actions`により`State`を変更する。
`State`が変更されると、<a>自動的</a>に`Reactions`が発火する。（= `Views`も更新される。`view = f(state)`）

--

### APIでみると

![idea](./img/idea.png)

- Actions: `mobx.action`
- State: `mobx.observable`, `mobx.computed`
- Reactions: `mobx.reaction`, `mobx.autorun`
  - Views: `mobx-react.observer`

他にもAPIは色々ありますが、最低限これだけ覚えれば十分です。

--

### 最低限のコード例

```js
const { autorun, observable } = require('mobx');

// State
const state = observable({
  count: 1,
});

// Reaction(Views)
autorun(() => {
  console.log(`Count is ${state.count}!`); // Count is 1!
});

// Actions
function increment() { state.count++; }
function decrement() { state.count--; }

increment(); // Count is 2!
increment(); // Count is 3!
decrement(); // Count is 2!
```

`State`を定義して、使用して、変更するだけ。これが全て。

--

### 自動的 = Reactive
- `State`が変更されると<a>自動的</a>に
  - その値を使用している関数が呼ばれる
  - その値を使用しているプロパティが更新される
    - その値を表示しているViewsがre-renderされる
- <a>宣言的</a>に記述できる
  - 書き漏らしとかない
  - コードの見通しもよくなる

ただのオブジェクトで管理するよりも圧倒的にわかりやすいです。

--

### もう少し長いコード例 w/ React

```java
const { action, computed, observable } = require('mobx');

// ObservableなStateと、Stateを変更するAction
// Decoratorsは必須ではなくOptionalな選択肢
class Store {
  @observable count = 1;

  // ObservableなStateに更新があった時"だけ"、自動的に更新されるプロパティ
  @computed get isOdd() {
    return !!(this.count % 2);
  }

  @action increment() {
    this.count++;
  }
  @action decrement() {
    this.count--;
  }
}
```
```js
// ViewからStoreのActionを呼ぶための・View以外の用途にStoreを使う層
// 別にViewから直接Storeを叩いてもいいけど
function createEvent(store) {
  return {
    increment() {
      store.increment();
    },
    decrement() {
      store.decrement();
    }
  };
}
```
```js
const React, { Component } = require('react');
const { observer } = require('mobx-react');

// ObservableなStateに更新があった時"だけ"、自動的にrenderされるコンポーネント
@observer
class View extends Component {
  render() {
    const { store, event } = this.props;
    return (
      <div>
        <div>{store.count}</div>
        <button onClick={event.increment}>+</button>
        <button onClick={event.decrement}>-</button>
      </div>
    );
  }
}
```
```js
const ReactDOM = require('react-dom');
const { useStrict, reaction } = require('mobx');

// @acitonからしかStateが変更できないように
useStrict(true);

const store = new Store();

// Stateの用途1
// ObservableなStateに更新があった時"だけ"、自動的に呼ばれる関数
reaction(
  () => store.isOdd,
  isOdd => {
    console.log(isOdd ? 'odd' : 'even');
  }
);

// Stateの用途2
ReactDOM.render(
  <View store={store} event={createEvent(store)} />,
  document.getElementById('app')
);
```

MobX自身はアーキテクチャは規定しないので、Fluxぽくするもよし、MVCぽくするもよし、MVVMぽくするもよし。

--

### MobXを使うとどうなるか

- Observableな`State`をどう定義するかが最大の関心事になる
- そしてその`State`を用途に応じてリンクさせていく
- あとは`State`を更新すれば、「変更が必要なものだけ」が<a>自動的</a>にアップデートされる
  - AしたらB、BしたらCするみたいな手続き的コードは消える
  - `shouldComponentUpdate`的なチューニングも不要になる

とにかく、`State`を中心に考えてコードを書く！
全て<a>自動的</a>に（= <a>Reactive</a>に）処理されるように！

--

### MobXではじめるReactiveアーキテクチャ

つまり`State`を更新するだけで、

- 画面の描画が更新される
- ページが遷移（URLを変更）する
- データがキャッシュされる
- etc...

そんな思想を体現したDEMOのご紹介。

--

# DEMO

--

### react-mobx-shop
- React Amsterdamでの作者のプレゼンで紹介されてたもの
  - https://youtu.be/m_vUUgI0bo8?t=8h29m23s
  - [mweststrate/react-mobx-shop at react-amsterdam-2017](https://github.com/mweststrate/react-mobx-shop/tree/react-amsterdam-2017)
- 本屋のECサイトの例
  - 定期的に最新の在庫（商品）をサーバーから取得し一覧表示
  - 商品の一覧/詳細/カートの3画面のルーティングあり
  - カートへの商品追加・購入ができる
  - カートの内容はLocalStroageで永続化

トーク自体もおもしろいのでおすすめです。

--

### 注意
- 別にMobXじゃなくてもReactiveな感じにはできます
- そしてMobX使うならすべからくこうしろ！というコードでもないです

やや作者のクセが感じられると個人的には思ってたりする・・(˘ω˘ )

--

### DEMOすること

- 普通に画面見せて動かす
- コンソールで↓のコード実行してみても動く
- `ReactDOM.render()`をソースから消してみた状態でも動く

```js
// Viewですら副作用であり必須ではない
shop.cart.checkout()
shop.cart.clear()

// URLでさえも
shop.view.openCartPage()
shop.view.openBooksPage()

// 全ての機能が動く
shop.books.keys()
shop.cart.addBook(shop.books.get('978-1423103349'))
shop.cart.addBook(shop.books.get('978-1423103349'), 2, false)
shop.cart.checkout()
```

--

# コードの見どころ

--

### Stateの使い道

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/index.js#L13-L40

- `State`の更新によって反映されるべきものを紐付け
  - `React`を使った画面表示
  - URLとの対応
- あとは`State`を更新すればすべて自動で反映

--

### Storeと子Store

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/stores/ShopStore.js#L14-L16

- ドメインごとに`Store`を用意してまとめる
  - 「オブジェクトのツリー」ではなく、「モデルのグラフ」をどう構成するかで考える
- 子Storeに親Storeの参照を渡すことで、グローバルな状態を表現している


--

### Storeで扱うモデル

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/stores/CartStore.js#L3-L25

- ただのオブジェクトではないので、任意の抽象化が可能
  - `Backbone`の`Model`と`Collection`の関係のような
- 小分けにしたObservableなモデルを協調させていくのがMobX-Way

--

### Viewにまつわる汎用Store

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/stores/ViewStore.js

- ドメイン用とView用の最低2つからが推奨されてたりする
- View用の汎用的な状態
  - ページURLの代わりとなるプロパティ
  - ローディング状態など

--

### Storeの永続化

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/stores/CartStore.js#L35-L46

- 初回ロードが終わった時に一度だけ復元
- カートの内容に変更があったら即座にLocalStorageへ保存

--

### MobX w/ React

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/index.js#L17-L22
> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/components/Books.js#L4

- React用のバインディング
  - [mobxjs/mobx-react: React bindings for MobX](https://github.com/mobxjs/mobx-react)
- `Provider`でContextに注入して`inject()`で取り出せる
- `observer()`は、そのコンポーネントが使用している値に更新があった時のみ`render()`してくれる
--

# まとめ

--

### MobXとは

- Observableな`State`を定義する仕組み
  - ドメインの状態はすべて<a>宣言的</a>に表す
  - ちゃんとモデルとして抽象化できる
- その`State`の変更を検知し<a>自動的</a>に発火・フックできる仕組み

この2つの仕組みを備えたライブラリです。

--

### お気持ち
- 個人的にはMobX推しです
  - が、Reduxはオワコン！とかでは決してない
- 覚えるものという意味での学習コストはすごく低い
  - が、使いこなすための学習コストはそれなり
  - いつ・どうやって使うんなAPIもいっぱいある
  - コンポーネントの粒度、ストアの配分は慣れるまで悩むと思う
- アーキテクチャが自由（フリーダム）なので、そこは頑張りましょう

ちゃんと自分の目で見て試して「選択」してください・・・！

--

### 時間があれば話したかったこと
- MobXのベストプラクティス
- 個人的なおすすめアーキテクチャの例
- 内部実装のさわり
- <s>不満</s>惜しいと思うところ
- イミュータブル vs ミュータブル問題
- Vueとの違い
- etc...

需要があれば、またの機会にどこかで！

--

### 参考リンク
- [MobX カテゴリーの記事一覧 - console.lealog();](http://lealog.hateblo.jp/archive/category/MobX)
- [おすすめライブラリつまみ食い - MobX | CodeGrid](https://app.codegrid.net/entry/mobx)
- [API overview | MobX](https://mobx.js.org/refguide/api.html)
- [#9 - MobX over Redux - YouTube](https://www.youtube.com/watch?v=qcp1IGFmlI0)

--

# Thank you!

<style>
:root {
  --bg-color: #f8fdf7;
  --bar-color: #0f726d;
  --em-color: #5bbbb7;
}
</style>
<link rel="stylesheet" href="../public/base.css">
<link rel="stylesheet" href="../public/timer.css">
<script src="../public/timer.js"></script>
<script src="../public/mobile-controls.js"></script>

title: MobXではじめるReactiveアーキテクチャ
controls: false
--

# <a>MobX</a>ではじめるReactiveアーキテクチャ

## &nbsp;
## 2017/06/21 Frontend de KANPAI!

--

### はじめまして

- Yuji Sugiura / [@leader22](https://twitter.com/leader22)
- フロントエンド・エンジニア at PixelGrid Inc.
  - DeNAで働いてた頃もありました
- 最近はWebの動画とかReactNativeとかやってます
- ブログにもいろいろ書いてます -> [console.lealog();](http://lealog.hateblo.jp/)

![leader22](../public/img/doseisan.jpg)

--

# 本日のテーマ

--

![mobx](./img/mobx.png)
## MobX

--

### お品書き
- <a>MobX</a>とは
  - どんな感じのAPIでどんな感じのコードか
  - どういう考え方で使うと良さそうか
- Reactiveなアーキテクチャの例
  - 作者直々のサンプルコードより

いちおうContributorもやってるので、なにか質問等あれば、この後の懇親会でもTwitterとかでもお気軽に！

--

# <a>MobX</a>とは

--

### MobXとは

- Webアプリケーションにおける状態（`state`）を管理するためのライブラリ
- https://github.com/mobxjs/mobx
  - 現在の最新バージョンは`3.1.10`
  - GitHubのスターは9k↑
  - TypeScript製（Flowの型定義もあるよ）
- 作者は[@mweststrate](https://twitter.com/mweststrate)氏

Reactとあわせて使われることが多いけど、別に依存関係はないです。

--

### MobXよもやま

- 各ライブラリのの公式ページでも言及されてたり
  - [Context - React](https://facebook.github.io/react/docs/context.html#why-not-to-use-context)
  - [他のフレームワークとの比較 - Vue.js](https://jp.vuejs.org/v2/guide/comparison.html#MobX-%E3%81%A8%E7%94%A8%E3%81%84%E3%81%9F%E5%A0%B4%E5%90%88)
- Reduxとの比較
  - [Dan Abramovさんのツイート](https://twitter.com/dan_abramov/status/720219615041859584)
  - [React Amsterdam Conference 2017 - YouTube](https://www.youtube.com/watch?v=m_vUUgI0bo8&feature=youtu.be&t=8h29m30s)
- ついにヨーロッパ最大のReactカンファレンスでも
  - [ReactEurope 2017 Day 2 AM - YouTube](https://youtu.be/nhNiKel6U9Y?t=1h8m33s)

日本でも少しずつ認知されてきた感がある今日このごろ。

--

### 蛇足: ReactならRedux一択じゃないの？

- 唯一解なんかあれば誰も苦労しない
- 自分の目で見て試して「選択」すべき
  - プロジェクトの用途・個人の信条に応じて
- 個人的にはMobX推しです
  - が、Reduxはオワコン！とかでは決してない

この資料もそんな「選択」の一助になればというお気持ちをはじめに置いておきます(˘ω˘ )

--

# MobXのコア

--

### 核となる3本柱

![idea](./img/idea.png)

- Actions: Stateを変更すること
- State: 状態それ自体
- Reactions: 状態の変更に起因するあれこれ
  - Views: 状態に応じて描画されるもの

`Actions`により`State`を変更すると、<a>自動的</a>に`Reactions`が発火する。（`Views`も更新される
 = `view = f(state)`）

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

`State`を定義して、変更するだけ。

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
const { reaction } = require('mobx');

// ViewからStoreのActionを呼ぶための・View以外の用途にStoreを使う層
// 別にViewから直接Storeを叩いてもいいけど
function Event(store) {

  // ObservableなStateに更新があった時"だけ"、自動的に呼ばれる関数
  reaction(
    () => store.isOdd,
    isOdd => {
      console.log(isOdd ? 'odd' : 'even');
    }
  );

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
// さよならshouldComponentUpdate
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
const { useStrict } = require('mobx');

// @acitonからしかStateが変更できないように
useStrict(true);

const store = new Store();
const event = new Event(store);

ReactDOM.render(
  <View store={store} event={event} />,
  document.getElementById('app')
);
```

アーキテクチャは規定しないので、Fluxぽくするもよし、MVCぽくするもよし、MVVMぽくするもよし。

--

### MobXを使うとどうなるか

- Observableな`State`をどう定義するかが最大の関心事
- あとはその`State`を更新しさえすればよい
- AしたらB、BしたらCするみたいな手続きコードが消える

とにかく、`State`を中心に考えてコードを書く！
全て<a>自動的</a>に（= Reactiveに）処理されるように！

--

### MobXではじめるReactiveアーキテクチャ

つまり`State`を更新すれば<a>自動的</a>に、

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
  - 商品の一覧・詳細・カートの3画面のルーティングあり
  - カートへの商品追加・購入ができる
  - カートの内容はLocalStroageで永続化

トーク自体もおもしろいのでおすすめです。

--

### 注意
- 別にMobXじゃなくてもReactiveにはできます
- MobX使うならすべからくこうしろ！というコードでもないです

やや作者のクセが感じられると個人的には思ってたりする・・(˘ω˘ )

--

### DEMOすること

- 普通に画面見せて動かす
- コンソールで↓のコード実行してみても動く
- `render()`をソースから消してみた状態でも動く

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

- ドメインごとに`Store`を用意しまとめる
  - プレーンObjectのツリーではなく、Modelのグラフをどう構成するかを考える
- 子Storeに親Storeの参照を渡すことで、グローバルな`Store`を表現している


--

### Storeで扱うモデル

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/stores/CartStore.js#L3-L25

- プレーンオブジェクトではないので、任意の抽象化が可能
  - `Backbone`の`Model`と`Collection`の関係のような
- ObservableなモデルをカスケードさせていくのがMobX-Way

--

### Viewにまつわる汎用Store

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/stores/ViewStore.js

- 最低限ドメイン用とView用の最低2つが推奨されてたりする
- View用の汎用的な状態
  - ページURLの代わりとなるプロパティ
  - ローディング状態など

--

### 全てを宣言的に

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/stores/CartStore.js#L35-L46

- 初回ロードが終わった時に一度だけ復元
- カートの内容に変更があったら即座にLocalStorageへ保存

--

### MobX w/ React

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/index.js#L17-L22

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/components/Books.js#L4

- React用のバインディング
  - [mobxjs/mobx-react: React bindings for MobX](https://github.com/mobxjs/mobx-react)
- `Provider`でContextに注入して`inject()`で取り出す

--

# まとめ

--

### MobXとはなんだったのか

- Observableな`State`を定義する仕組み
  - ドメインの状態を<a>宣言的</a>に表す
- その`State`の変更を検知し<a>自動的</a>に発火、フックできる仕組み

この2つを備えたライブラリ。

--

### 参考リンク
- [MobX カテゴリーの記事一覧 - console.lealog();](http://lealog.hateblo.jp/archive/category/MobX)
- [API overview | MobX](https://mobx.js.org/refguide/api.html)
- [mobxjs/mobx-state-tree: Opinionated, transactional, MobX powered state container](https://github.com/mobxjs/mobx-state-tree)

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

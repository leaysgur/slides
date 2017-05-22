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
  - 最近はHLSとかReactNativeとか
- ブログも書いてます -> [console.lealog();](http://lealog.hateblo.jp/)

![leader22](../public/img/doseisan.jpg)

--

# 本日のテーマ

--

![mobx](./img/mobx.png)
## MobX

--

### 目次
- MobXとはどんなものか
  - 別資料にて
- どういう考え方で使うと良さそうか
- コードがどんな感じになるのか

質問等あれば、この後でも、Twitterとかでも。

--

# [Hello, MobX!](http://leader22.github.io/slides/node_gakuen-25#5)
## （※概要説明のための別資料）

--

# おさらい

--

### MobXを使うとどうなるか

- <a>State</a>のことだけ考えればよい
  - 必要最低限にして必要十分
- その<a>State</a>を更新しさえすればよい
  - 後は全てよしなにしてくれる

とにかく、<a>State</a>を中心に考える！コードを書く！

--

### = Stateを中心に考えたアーキテクチャ

<a>State</a>を更新すれば勝手に、

- 画面の描画が更新される
- ページが遷移（URLを変更）する
- キャッシュされる
- etc...

= Reactiveアーキテクチャ・・！

--

# DEMO

--

### DEMOについて
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

### DEMOすること

- 普通に画面見せる
- コンソールで↓のコード実行しても動く
- `render()`を消してみた状態でも↓のコードが動く

```js
shop.cart.checkout()
shop.cart.clear()

shop.view.openCartPage()
shop.view.openBooksPage()

shop.books.keys()

shop.cart.addBook(shop.books.get('978-1423103349'))
shop.cart.addBook(shop.books.get('978-1423103349'), 2, false)
shop.cart.checkout()
```

--

# コードの見どころ紹介

--

### Stateの使い道

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/index.js#L13-L40

- Stateの更新によって反映されるべきものを紐付け
  - `React`を使った画面表示
  - URLとの対応
- あとはStateを更新すればすべて自動で反映

--

### Storeと子Store

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/stores/ShopStore.js#L14-L16

- ドメインごとに`Store`を用意しまとめる
  - そういう意味ではシングルストア
- 子Storeに親Storeの参照を渡すことで、グローバルな`Store`を表現

--

### Storeで扱うモデル

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/stores/CartStore.js#L3-L25

- プレーンオブジェクトではないので、任意の抽象化が可能
  - `Backbone`の`Model`と`Collection`の関係のような
- ObservableなモデルをカスケードしてスケールさせるMobX-Way

--

### Viewにまつわる汎用Store

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/stores/ViewStore.js

- ページURLの代わりとなるプロパティ
- ページ自体のローディング状態など

--

### 全てがReaction

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/stores/CartStore.js#L39-L43

- カートの内容に変更があったら即座にLocalStorageへ

--

### React x MobX

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/index.js#L17-L22

> https://github.com/mweststrate/react-mobx-shop/blob/react-amsterdam-2017/src/components/Books.js

- React用のバインディング
  - [mobxjs/mobx-react: React bindings for MobX](https://github.com/mobxjs/mobx-react)
- `Provider`で注入して`inject()`で取り出す

--

### 注意
- 別にMobXじゃなくてもできます
- MobX使うならこうしろ！でもないです
  - やや作者のクセが感じられるコードかも

MobX自体がアーキテクチャを規定しないので、Fluxぽくするもよし、MVCぽくするもよし、MVVMぽくするもよし。

--

# まとめ

--

### MobXでリアクティブに

- Observableな<a>State</a>を中心に設計する
  - それがキモでありすべて
- Stateの変更による副作用は、すべて<a>自動で</a>成される
  - そうすることで宣言的 & テスタブルなコードに

Do You Believe in Magic?

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

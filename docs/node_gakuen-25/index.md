title: Hello, MobX!
controls: false
--

# Hello, <a>MobX</a>!

## &nbsp;
## 2017/04/24 Node学園 25時限目

--

### はじめまして

- Yuji Sugiura / [@leader22](https://twitter.com/leader22)
- フロントエンド・エンジニア at PixelGrid Inc.
- [console.lealog();](http://lealog.hateblo.jp/)
- 最近はWebRTCとかReactNativeとか

![leader22](../public/img/doseisan.jpg)

--

# 本日のテーマ

--

![mobx](./img/mobx.png)
## MobX

--

### MobXとは

- Webアプリケーションにおける状態（`state`）を管理するためのライブラリ
- https://github.com/mobxjs/mobx
  - 現在の最新バージョンは`3.1.9`
  - GitHubのスターは8.5k↑
  - TypeScript製（Flowの型定義もあるよ）
- 作者は[@mweststrate](https://twitter.com/mweststrate)氏

--

### 色々なところで言及はされてる
- [Context - React](https://facebook.github.io/react/docs/context.html#why-not-to-use-context)
- [他のフレームワークとの比較 - Vue.js](https://jp.vuejs.org/v2/guide/comparison.html#MobX-%E3%81%A8%E7%94%A8%E3%81%84%E3%81%9F%E5%A0%B4%E5%90%88)
- [redux/Performance.md at master · reactjs/redux](https://github.com/reactjs/redux/blob/master/docs/faq/Performance.md)


ちなみに先日の[React Amsterdam](https://react.amsterdam/)でも話されてます。
- https://youtu.be/m_vUUgI0bo8?t=8h29m30s

--

### MobXと私
- かれこれ半年以上使ってることに
  - 実務からプライベートまで
  - 小さいものからそれなりに大きいものまで
  - Webから（React）Nativeまで
- いちおうContributerもやってます

なので国内では割と使い込んでる側な気がする・・？

--

### 話したいこと
- MobXのコンセプト
- どんな感じのコードになるか
- いまのお気持ち
- FAQ

--

### 話さないこと
- ○○はオワコン、これからはMobX！
- あのライブラリに比べてここが良い悪い・・・
- MobXの内部はこうなってる
- APIの詳細、便利APIの解説
- いわゆるベストプラクティス
- etc...

時間が足りないので、拙ブログを読む or 6月くらいの某勉強会（予）にくる or 懇親会で話しかけてください🍕

--

# MobXのコンセプト

--

### Automatic derivation

> Anything that can be derived from the application state, should be derived. Automatically.

意訳: アプリの状態に関するすべての事柄は、その状態変更に呼応して<a>自動的に</a>成されるべき。

--

### 昨今のアーキテクチャのトレンド

![data flow](./img/flow.png)

- 関心の分離
- <a>一方向</a>のデータフロー
  - `view = fn(state)`
  - まぁどのライブラリもだいたいそう

図の通り、Stateを変更（Action）さえすれば、後の更新はMobXが<a>自動的に</a>やってくれる。

--

# どんなコードになるか

--

### 必要なのは3ステップ

- 1\. Stateを定義すること
- 2\. そのStateを使って関数を実行すること
  - `view.render()`とか
- 3\. Stateを変更すること

--

### 1. ObservableなStateを用意

```js
const { observable } = require('mobx');

const state = observable({
  count: 1,
});
```

> https://mobx.js.org/refguide/api.html#creating-observables

※Rxとかの`Observable`ではないのでご注意。

--

### 2. Stateでなんかする

```js
const { autorun } = require('mobx');

autorun(() => {
  // いわゆる`render()`的なこと
  console.log(`Count is ${state.count}!`);
});
```

> https://mobx.js.org/refguide/autorun.html

--

### 3. Stateを更新

```js
state.count = 2;
```

これだけで、<a>自動的に</a>さっきの関数が呼ばれます。

--

### 1 + 2 + 3なコード

```js
const { autorun, observable } = require('mobx');

// state
const state = observable({
  count: 1,
});

// view
autorun(() => {
  console.log(`Count is ${state.count}!`); // Count is 1!
});

// action
state.count = 2; // Count is 2!
state.count = 3; // Count is 3!
```

おどろきの簡単さ・・！

--

### 簡単 = わかりやすい
![data flow](./img/flow.png)

- State: `mobx.observable()`
- Action?: Stateに対する変更（任意
- View?: Stateの変更に対するリアクション（任意

表示を更新したいから値を更新する、その<a>思考の流れがそのままコードになる</a>のが重要。

--

# もう少しだけコード

--

### State: Classで書く
```js
class Store {
  constructor() {
    extendObservable(this, {
      items: [],
    }),
  }
}
```

or

```java
class Store {
  @observable items = [];
}
```

Decoratorsの使用はマストではないが、使えるなら使いたくなると思う・・！

--

### State: Computed value

```java
class Ticket {
  @observable price = 1000;
  @observable amount = 1;

  @computed get total() {
    return this.price * this.amount;
  }
}
```
```js
const ticket = new Ticket();
console.log(ticket.total); // 1000
ticket.amount = 2;
console.log(ticket.total); // 2000
```

<a>特定の状態に由来する状態</a>を`computed`で宣言的に。

- いちいち手動で更新しなくていいので事故らない
- 扱うべきStateを限定・集中できる
  - Stateの概観がブレない

--

### View: w/ React

```js
const React = require('react');
const { observer } = require('mobx-react');

const View = ({ todoStore }) => (
  <div>
    残TODO数: {todoStore.unfinishedCount}
    <ul>
      { todoStore.items.map(todo => (
      <li key={todo.id}
        <Todo item={todo} />
      </li>
      )) }
    </ul>
  </div>
);

// いるのココだけ
module.exports = observer(View);
```

`mobx-react`という別パッケージがあり、`observer`はさっきの`autorun`のラッパー。

必要なStateに更新があった時<a>だけ</a>、自動で`render()`されるように。

--

### View: 以外の更新も

```js
// for rendering views
ReactDOM.render(<View todoStore={store} />, $el);
```
```js
// for others
reaction(
  () => store.unfinishedCount,
  count => {
    if (count > 10) {
      askColleagueToHelp(store.items);
    }
    if (count > 100) {
      reportToBoss(store.items);
    }
  }
)
```

`observable`な値の変化に対する`reaction`を指定することで、Viewの表示に関することも、それ以外のことも、State由来の事柄は全てを<a>宣言的・リアクティブ</a>に書ける。

--

### Action: 変更に制限を

```js
const { useStrict, action } = requre('mobx');

useStrict(true);

state.count = 10; // Error!
```

```js
const modCount = action(() => {
  state.count = 10;
});

modCount(); // Ok!
```

`action()`でラップすることで、その関数からしかStateが変更できないようにできる。

--

### Action: 非同期もそのまま

```js
uiStore.setLoading(true);

fetch('/api/my/todos/')
  .then(items => {
    todoStore.init(items);
    uiStore.setLoading(false);
  })
  .catch(err => {
    uiStore.showError(err);
  });
```

非同期だからといって特殊なことをする必要はない。
直感的に、ただStateを更新するだけ。

--

### 最低限のコードの組合せ

```java
// Store(State + Action)
class TodoStore {
  @observable items = [];

  @action
  addTodo(title) {
    this.items.push(new Todo(title));
  }
}
```
```html
<!-- View -->
<input type="text" /><button onClick={() => addTodo($input.value)}>ADD</button>
```
```js
// Event
function addToto(title) {
  if (title.trim().length === 0) { return; }
  store.addTodo(title);
}
```

※コードはイメージです

--

# お気持ち

--

### 個人的には「推し」です
- 「顧客が本当に必要だったもの」感
  - 書き味・取り回しの軽さ
- それなりのものは、さくっと作れる
  - 最低限の部品とその役割分担が妥当
  - コード・ファイルが少ない = 楽

ちょうどいい上に賢い・・これが魔法・・

--

### アーキテクチャを規定しない
- MVCでもFluxでも好きなのを
- このライブラリではどう書けばいい・・？がない
  - 本当に無駄な時間、そういうレビューもいらない
- 他人のルールに「無理やり納得」しなくていい
  - そもそもマッチしない設計に乗る必要性 is ...
- ある程度の自由を許容した「遊びをもたせた設計」も
  - NoMore隙のないカチカチな設計のフリをした泥沼コード

○○uxのActionオブジェクトは未だに謎・・。一方向フローは良いとしても`type`て・・タイムトラベルとかしねーし・・


--

### なのでもちろん
- 最低限の線引はマスト
  - 己の力量が試される
  - 自信がないなら、Opinionatedなものを
  - エンジニアの本来の仕事なんですけど・・
- どんなライブラリも慣れは必要

Flux一派に疲れた貴方に送るリーズナブルな選択肢として。

--

# FAQ

--

### その1
- Vue for React？
  - 基本的なアイデアは同じと思ってOK
  - ただ特化してる分だけ強いし、他の部分は選べる
- ObservableってRxのアレ？
  - No
  - そういうスライドちょっとバズってたけど違う
- イミュータブル？
  - No
  - だからこその楽さ・パフォーマンス

--

### その2
- 勝手に色々やられるの怖くない？
  - 手動でやるほうが怖くない？面倒じゃない？
  - いわゆるトレードオフなので選択して
  - 大人しく魔法にかけられたくないならオススメはしない
- `Single source of truth`したいんですが？
- ○○みたいにしたいんですが？
  - あなた次第なのでどうぞご自由に
  - てか無理して使わんでいい

ライブラリは必要になって初めていれるもの。

--

### 興味をもったら参考リンク

- [API overview | MobX](https://mobx.js.org/refguide/api.html)
- [MobX カテゴリーの記事一覧 - console.lealog();](http://lealog.hateblo.jp/archive/category/MobX)
- [おすすめライブラリつまみ食い - MobX | CodeGrid](https://app.codegrid.net/entry/mobx)
- [mobxjs/mobx-utils: Utility functions and common patterns for MobX](https://github.com/mobxjs/mobx-utils)
- [mobxjs/mobx-state-tree: WIP - Opinionated, transactional, MobX powered state container](https://github.com/mobxjs/mobx-state-tree)

何かあればメンションください or この後の🍕で！

--

# Thank you!

<style>
:root {
  --bg-color: #fffcff;
  --bar-color: #e43980;
  --em-color: #e6489c;
}
</style>
<link rel="stylesheet" href="../public/base.css">
<link rel="stylesheet" href="../public/timer.css">
<style>
pre, code {
  background-color: #eee;
}
</style>
<script src="../public/timer.js"></script>
<script src="../public/mobile-controls.js"></script>

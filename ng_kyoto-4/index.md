title: "今からはじめるVanilla JS"
controls: false
--

# 今からはじめる<br>Vanilla JS

## &nbsp;
## 2016/04/30 ng-kyoto Angular Meetup #4

--

### はじめまして

- Yuji Sugiura / [@leader22](https://twitter.com/leader22)
- PixelGrid Inc.
- フロントエンド・エンジニア
- 京都生まれ -> 大阪育ち -> 神奈川(ほぼ東京)在住

![leader22](./img/doseisan.jpg)

--

# 今日はなすこと

--

![Vanilla JS](./img/vanilla.png)

--

### ご存じですかVanilla JS

- まーた新しい○○.jsか！
  - 違います
- Angular.jsとかReact.jsの仲間ではない
  - jQueryみたいなライブラリでもない

--

### Vanilla JSとは
- バニラ ≒ プレーン = 素のJavaScriptのこと
- HTML5 / ブラウザネイティブのAPIのみを使う
- FWやライブラリを使わずに目的を達成する

--

# こんな経験ありませんか

--

### 例1: リリース前のパフォーマンス対応

- どうも重いページがあるらしい
- この謎のdirectiveが原因っぽいのはわかったが
- ところがそれは外部のライブラリで
- コード読んでもさっぱりわからん！

チューニングできない＼(^o^)／

--

### 例2: ページに新たなUIを追加したい

- ちょっとしたタブとかアコーディオンとか
- でも自前で実装するのは大変な気がするな・・
- よーし、UI Bootstrap使っちゃうぞー
- 中身はちゃんと見てないけど動いた！おｋ！

そこには・・<br>タブだけで良かったのに、気付けば大量の使われてない機能と依存モジュールたちの姿が・・！＼(^o^)／

--

### 例3: 続・ページに新たなUIを

- [jzaefferer/jquery-validation](https://github.com/jzaefferer/jquery-validation)みたいなことしたい
- でもjQueryは入れたくない
- けど、どう書けば良いかはわからない・・
- 他のライブラリも見つからない

もうjQueryいれるしかない＼(^o^)／

--

# ＼(^o^)／

--

### この例の何がダメか

フルスタックなAngular.jsも、中身はただのJavaScript！

- 生きてれば生jsでのチューニングが必要になる時が
- 他人(ライブラリ)頼みでは、いざという時に困る
- 1ヶのために使わない機能が10ヶあるとか無駄

これはReact.jsでも何でも同じ、基礎が大事。

--

### Vanilla JS力が高まると

- 依存が無いため最速・最軽量のコードが書ける
- 得体のしれないライブラリを使わなくて済む
- ライブラリが抽象化してる内容を推測できる
  - 拡張やFolkも容易
  - バグ対応でも原因の予想がつきやすい
- 案件の枠を越えてつぶしがきく人材に
- Angular2の理解にもつながる！はず！

--

### 今からはじめるVanilla JS

モダンブラウザ最新版は、ほぼ違いを意識しないでおｋ

- Chrome / FireFox / Edge

そして今や、

- レガシーIEのサポート終了
- iOSも9.x / Androidも5.x

ブラウザ間の実装差異を埋めるPolyfillの出番も、着実に減少中。

--

### お断り

- ライブラリを使うこと = 悪ではない
- 要件や環境に応じて「選択」が必要
- 正しく判断をするために、きちんと見極める力と
- いざという時に戦える力を

昨今のイケイケなWebアプリをVanilla JSでやるのは相当大変やし・・`_(:3」∠)_`

--

# Vanilla JS事例

--

### PixelGrid Inc.

![PixelGrid](./img/pxg.png)

## http://www.pxgrid.com

--

### jsでやってること

- 各ページURLで必要な関数を実行(= ルーター)
- タブ / 開閉パネル
- ページ内SmoothScroll
- SVGのアクセスマップ制御
- お問い合わせ・採用応募フォーム
  - フォームバリデーション
  - Ajaxでのフォーム送信

依存ライブラリなしなので容量わずか`3.8KB`！

--

### そんなコードを紹介します

- [基本] 要素の取得
- [基本] クラス名の操作
- [基本] Ajax
- [基本] イベント発火
- [基本] オフライン検知
- [発展] EventEmitter
- [発展] FormValidation
- [発展] SmoothScroll

ぜんぶ数行 ~ 数十行で実装できます！

--

### 要素の取得

--

### クラス名の操作

--

### Ajax

--

### イベント発火

--

### オフライン検知

--

### EventEmitter

--

### SmoothScroll

--

### FormValidation

-- 

# おわりに

--

### まとめ

- aa

--

### 宣伝: そんなPixelGridといえば

![CodeGrid](./img/cg.png)

## https://app.codegrid.net/
## ＼Angular記事もReact記事もあるよ！／

--

### Links

このスライド<br/>
http://leader22.github.io/slides/ng_kyoto-4/

--

# Finish!

<script>
var timer = document.createElement('div');
timer.textContent = '0';
timer.id = 'timer';
document.body.appendChild(timer); 

setInterval(function() {
  var now = timer.textContent|0;
  timer.textContent = '' + (now + 1);
}, 1000 * 1);
</script>

<style>
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
  background-color: #792362;
}

a {
  color: #792362!important;
}

h1 {
  font-size: 220%;
}

h3 {
  border-color: #792362;
}

pre {
  border: 1px solid #792362;
  padding: 2%;
}

ul {
  padding: 10px 0 10px 60px;
}

.slide-content img {
  display: block;
  margin: 0 auto;
  max-width: 80%;
}
</style>
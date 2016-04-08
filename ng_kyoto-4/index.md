title: 知ってて得するVanilla JS
controls: false
--

# 知ってて得する<br><s>Angular2</s><br>Vanilla JS

## &nbsp;
## 2016/04/30 ng-kyoto Angular Meetup #4

--

### はじめまして

- Yuji Sugiura / [@leader22](https://twitter.com/leader22)
- フロントエンド・エンジニア at PixelGrid Inc.
- 京都生まれ -> 大阪育ち -> 神奈川(ほぼ東京)在住
- Angular歴3ヶ月(最近はReactばっかり)

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
- HTML5 / ブラウザネイティブのAPIを使い倒す
- FWやライブラリを使わず自分で全部書く

要するに、JavaScriptの基礎です。

--

# こんな経験ありませんか

--

### 例1: リリース前のパフォーマンス対応

- なんか重いページがあるらしい
- この謎のdirectiveが原因っぽいのはわかったが
- ところがそれは外部のライブラリで
- コード読んでもさっぱりわからん！

チューニングできない＼(^o^)／

--

### 例2: ページに新たなUIを追加したい

- ちょっとしたタブとかアコーディオンとか
- でも自前で実装するのは大変な気がするな・・
- よーし、UI Bootstrap使っちゃうぞー
- 中身ちゃんと見てへんけど動いたしおｋ！

そこには・・<br>タブだけで良かったのに、気付けば大量の使われてない機能と依存モジュールたちの姿が・・！＼(^o^)／

--

### 例3: 続・ページに新たなUIを

- [jzaefferer/jquery-validation](https://github.com/jzaefferer/jquery-validation)みたいなことしたい
- でもjQueryは入れたくない
- けど、どう書けば良いかよーわからん・・
- 他のライブラリも見つからん！

もうjQueryいれるしかないじゃない＼(^o^)／

--

# ＼(^o^)／

--

### この例の何がダメか

- 生きてれば生jsでのチューニングが必要になる時が
  - ループ x メソッドコールとか
- 1機能のために使わない機能が10あるとか無駄
- 他人(ライブラリ)頼みでは、いざという時に困る


フルスタックなAngularも今話題のReactも、<br>中身はただのJavaScript！<br>
基礎もできないのにAngularがどうとか(ry

--

### Vanilla JS力が高まると

- 依存なしで最速・最軽量・無駄のないコードが書ける
  - 得体のしれないライブラリを使わなくて済む
  - メンテも楽
- ライブラリが抽象化してる内容を推測できる
  - 不要なら不要と判断できる
  - 拡張やFolkも容易
  - バグ対応でも原因の予想がつきやすい
- Angular2の理解にもつながる！はず！

--

### 今からはじめるVanilla JS

最新のモダンブラウザは違いをほぼ意識しないでOK

- Chrome / FireFox / Edge

そして今や、

- レガシーIEのサポート終了
- iOSも9.x / Androidも5.x

ブラウザ間の差を埋めるPolyfillの出番も、着実に減少中。

--

### ⚠お断り

- ライブラリを使うこと = 悪ではない
- 要件や環境に応じて「選択」がもちろん必要
- その正しい「選択」をするために、
  - きちんと見極める力と
  - いざという時に戦える力を
- やってることを理解した上で楽を

昨今のイケイケなWebアプリをVanilla JSでやるのつらい`_(:3」∠)_`

--

# Vanilla JS事例

--

### PixelGrid Inc.

![PixelGrid](./img/pxg.png)

## https://www.pxgrid.com

--

### jsでやってること

- 各ページURLで必要な関数を実行(= ルーター)
- タブ / 開閉パネル
- ページ内SmoothScroll
- SVGのアクセスマップ制御
- お問い合わせ・採用応募フォーム
  - フォームバリデーション
  - Ajaxでのフォーム送信
- etc..

依存ライブラリなしなので容量わずか`4.1KB`(gzip)！<br>
ちなみにjQuery@2.2は`34.6KB`

--

# Vanillaなコードの紹介

--

### DOMの取得

```javascript
// jQuery
$('#el');
$('.els');

// Vanilla
document.getElementById('el');
document.getElementsByClassName('.els');

// Easy but..
document.querySelector('#el');
document.querySelectorAll('.els');
```

便利な`qS`と`qSA`ですが、一部レガシーな環境でパフォーマンスが落ちるので注意(体験談)

--

### DOMの操作

```javascript
// jQuery
$('.els').each(function() {
  this.text('Angular!');
});

// Vanilla
var $els = [].slice.call(document.getElementsByClassName('.els'));
$els.forEach(function(el) {
  el.textContent = 'Angular!';
});

[].forEach.call(document.getElementsByClassName('.els'), function(el) {
  el.textContent = 'Angular!';
});

// ES 2015
var $els = Array.from(document.getElementsByClassName('.els'));

Array.from(document.getElementsByClassName('.els'), function(el) {
  el.textContent = 'Angular!';
});
```

--

### 配列

```javascript
var array = ['A', 'n', 'g', 'u', 'l', 'a', 'r', '2'];

// _
_.each(array, fn);
_.map, _.filter, _.some, _.every;
_.contains(array, 'A');

// Vanilla
array.forEach(function(item, idx, arr) {});
array.map, array.filter, array.some, array.every;

// ES Next
array.includes('A');
```

他にもいろいろある + ちょっと組み合わせればだいたい書ける。

-- 

### オブジェクト操作

```javascript
// _
_.extend({ name: 'leader22' }, { age: 29 });

// ES 2015
Object.assign({ name: 'leader22' }, { age: 29 });
```

`Object.freeze()`, `seal()`, `preventExtension()`とかも便利。

--

### クラス名の操作

```javascript
// jQuery
var $el = $('#el');
$el.addClass('is-selected');
$el.removeClass('is-selected');
$el.toggleClass('is-selected');
$el.hasClass('is-selected');

// Vanilla
var $el = document.querySelector('#el');
$el.classList.add('is-selected');
$el.classList.remove('is-selected');
$el.classList.toggle('is-selected');
$el.classList.contains('is-selected');
```

脱jQueryの一大要因なのでは？

--

### Ajax

```javascript
// jQuery
$.ajax({
  url: '/foo',
  method: 'POST',
  dataType: 'json',
  data: { a: 1 }
})
.then(fn);

// Vanilla
var xhr = new XMLHttpRequest();
xhr.open('POST', '/foo', true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.responseType = 'json';
xhr.onload = fn;
xhr.send(JSON.stringify({ a: 1 }));

// Near future
fetch('/foo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ a: 1 })
})
.then(fn);
```

--

### CSS

```javascript
// jQuery
$(el).css('display');

// Vanilla
getComputedStyle(el)['display'];
```

そもそも使う機会あんまりないけど・・・。

--

### イベント発火

```javascript
// jQuery
var $btn = $('#button');
$btn.trigger('click');

// Vanilla
var $btn = document.getElementById('button');
$btn.dispatchEvent(new Event('click'));
```

昔は`createEvent()`とか`initEvent()`とか面倒やったけど、今は昔だ！

--

### EventEmitter

```javascript
var EE = require('events').EventEmitter;
var ev = new EE();

ev.on('foo', function() { console.log('foo'); });
ev.emit('foo'); // "foo"
```

いつもだいたい`on()`と`emit()`くらいしか使ってないそこのあなた！

--

### EventEmitter

```javascript
function EE() {
  this._events = {};
  return this;
}

EE.prototype = {
  constructor: EE,
  emit: function(ev) {
    var args = [].slice.call(arguments, 1),
        handler = this._events[ev] || [];
    
    for (var i = 0, l = handler.length; i < l; i++) {
      handler[i].apply(this, args);
    }
  },
  on: function(ev, handler) {
    var events = this._events;
    (events[ev] || (events[ev] = [])).push(handler);
  }
}

return EE;
```

たった20行です。

--

### EventEmitter

```javascript
window.addEventListener('message', handleMsg, false);

function handleMsg(ev) {
  if (ev.origin !== location.origin) { return; }
  var msg = ev.data;

  var type = msg.type; // "foo"
  var data = msg.data; // {}
}

window.postMessage({ type: 'foo', data: {} }, location.origin);
```

だいたいコレで事足りると思いません？

--

### FormValidation

<form id="myForm">
  <input name="name" type="text" required>
  <input name="email" type="email" required>
  <button type="submit">Send</button>
</form>

```html
<form id="myForm">
  <input name="name" type="text" required>
  <input name="email" type="email" required>
  <button type="submit">Send</button>
</form>
```

```javascript
var $form = document.getElementById('myForm');

// form全体
$form.checkValidity();

// email
$form.email.checkValidity();
```

正規表現とか書かんでも良い！<br>
(おすすめせんけど)厳密にチェックしたいならがんばって・・

--

### オフライン検知

```javascript
window.addEventListener('online',  handleNWChange, false);
window.addEventListener('offline', handleNWChange, false);

function handleNWChange() {
  // navigator.onLine
}
```

他にもバッテリー状況とか取れる。

```javascript
// Chromeならもう使える
navigator.getBattery().then((battery) => {
  // battery
})
```

そのうち回線種別とか照度まで取れるようになるらしい！

--

# おわりに

--

### まとめ

- ライブラリ無しでもできることは多いことを知ろう
- 基礎を大事にした上で、他人の知恵をありがたく
- 脱「あの○○よーわからんけどすごい！」

あらためて、Angularの偉大さを感じてください(˘ω˘ )

--

### 宣伝: そんなPixelGridといえば

![CodeGrid](./img/cg.png)

## https://app.codegrid.net/
## ＼Vanillaはもちろん、Angular記事もReact記事も！／

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
  background-color: #fff;
}

ul {
  padding: 10px 0 10px 60px;
}

.slide-content {
  overflow: scroll;
}

.slide-content img {
  display: block;
  margin: 0 auto;
  max-width: 80%;
}
</style>
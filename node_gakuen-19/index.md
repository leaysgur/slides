title: "#スーパーイカメーカー について"
controls: false
--

# #スーパーイカメーカー
## を支える技術

<img src="./img/loading.gif">

## 2016/02/09 Node学園 19時限目

--

### はじめまして

- Yuji Sugiura / @leader22
- PixelGrid Inc.
- フロントエンド・エンジニア


<img src="./img/doseisan.jpg">

--

### 宣伝: PixelGridといえば

<img src="./img/cg.png">

## ＼デザインリニューアル／

--

### #スーパーイカメーカー とは

<img src="./img/01.png">

- 某ゲームの某キャラ風のかわいいアイコンが作れちゃうWebサービス
- **@jenga_ink**さんによる手書き画像400枚以上！

--

### お手元のスマホでもPCでも

<img src="./img/icon.png">

## http://ikasu.lealog.net/

--

### なんと

<img src="./img/02.png">

まじか( 01/21 15:00リリース -> 6時間経ったころ )

--

### なんと！

<img src="./img/03.png">

これが・・バズるということか・・

--

### なんと！！

- GIGAZINE
- AppBank
- NAVERまとめ
- Reddit
- その他の海外SNS
- たくさんの個人ブログ
- たくさんのツイート
- etc...

--

### なんと！！！

<img src="./img/04.png">

世界中116/196カ国からアクセスが！

--

### なんと！！！！
Google Analytics曰く、

- 累計ユーザー: 約280,000
- 累計ページビュー: 約860,000
- DAU: 約5,000
- 今は落ち着いてて、リアルタイムで50人ほど

最近はすごく平和です。

--

### 今日はそんなサービスの裏側を？

Node学園で話すということは。

- そんなトラフィックをNode.jsで捌いたとか？
- 画像生成のバックエンドがNode.jsとか？？

そう思うかもしれませんが・・・！

--

# Node.jsで動いて・・

<img src="./img/loading.gif">

--

# ません！

## (ちょっとだけ使ってるよ)

--

### 苦情はこちら

<img src="./img/05.png">

まぁみんな大好きWebネタということでひとつ。

--

# #スーパーイカメーカー
## を支える技術

--

### サーバーサイド

- さくらVPS [ CPU3コア / メモリ2GB ]
- Nginx
  - worker_processes: 3
  - worker_connections: 1024
  - worker_cpu_affinity: 01 10 11;
  - worker_rlimit_nofile: 4096;
  - gzip

クライアントにファイルを返すだけ。<br>
CDNとか、オートスケールとか、そんなのないです。

--

### クライアントサイド

- HTML
- CSS
  - postcss
- JavaScript
  - ES2015 [ Babel ]
  - React
  - flumpt [ Flux impl by @mizch ]

画像の合成もすべてクライアントで。

--

### だいたい4日くらいで作った

- 構造考えるのに2日
- コード書くのに1日
- 見た目調整したりリファクタしたり1日

※ガール版のみの初期リリースまでで、もちろん絵は別です。<br>
※ちゃんと本業をこなした後ですよ！ <- 重要

--

### 下準備

- 画像を用意
- 存在する画像から、パーツリスト用オブジェクトの生成スクリプトを実行( ココがNode.js！ )
- build

```
# css
postcss -c ./.postcssrc.json

# js
browserify ./src/script/main.js -t babelify -t uglifyify -o ./dist/script.js
```

--

### 仕組み(Flux)

- パーツをポチっと
- "設定変えたよ"Actionが発行され
- Stateにある設定データを更新
  - 更新されたStateを元に、
  - 裏でCanvasに`drawImage()` -> `toDataURL()`
- Viewが更新

全て同サイズの画像を重ねて、Canvasで描画するだけ

--

### FluxやるならRedux？
- という世間の風潮に乗ろうとした
- りでゅーさー、すとあー、でぃすぱっちゃー、みどるうぇあ、あくしょんくりえいたー・・
  - よーわからん
- そもそもFluxってそんなに大きいものなの

MVC後期のUIイベントとデータを分離していたあの頃と何が変わってしまったの・・

--

### そんなあなたにflumpt
https://github.com/mizchi/flumpt/

- `this.dispatch('EVENT')`できる`flumpt.Component`
- それを受けてStateを更新する根本の`flumpt.Flux`
- 提供されるのはこの2つだけ
- (細かい機能は他にもあるけど使ってない)
- Flux入門にも良さげ

**S+**のイカが作ったライブラリなら安心！(適当)

--

### コードの詳細

https://github.com/leader22/ika-maker

- 規模が小さいので特筆すべき点がない
- 1ソースで全解像度対応
- OGPやらピン留めやら対応済み

画像を差し替えれば、誰でもスーパーxxメーカーが！

--

# 悩んだこと

--

### 200リクエストを待つかどうか問題
- 200枚のパーツ画像を全て読み込んでから起動
  - 随時読み込みでもよかった
- けど変更はその場で即反映されて欲しい！
  - 最初は待つけど...使わないのも多いけど...
- いっぱい選べる感が楽しいので致し方無し

HTTP/2？知らない子ですね...

--

### 色変えならSVGでいいのでは問題
- 髪色が違うだけで画像20枚
- SVGにすれば画像は減らせる
  - 一理ある
- しかし作るコストがかかりそうで踏み込めず

とりあえずリリース優先のため見送り

--

### どこまで本家に忠実にするのか問題
- 本家の細かさ
  - 髪色とマユ色が連動するとか
  - ボーイの"マゲ"がギアによって隠れるとか
- いや、もっとオシャレしたい！

全て選べる夢のイカメーカーに

--

# 困ったこと

--

### 無限に通知くる問題

- &lt;meta name="twitter:site" content="@leader22"&gt;
- Twitter for Android限定
- サイトリンク入りの自分の発言にセルフリプ
  - なぜか @leader22 がテキストに自動挿入
- それに気付かなかった世界中のAndroidユーザーから日中夜問わず無限にメンションが

通知OFFったー(˘ω˘ )

--

### 現代っ子再読み込み知らない問題

- バグ修正 || アップデートする -> すぐ撒く
  - これがWebの利点ですよ(はっはっは
  - ページを再読み込みして更新して欲しい
- 現代っ子たち < 再読み込みってなんですか？自動じゃないの？
  - キャッシュなどもちろん理解されない
- しかしユーザー問い合わせの9割はコレ・・

WebView キャッシュ消す どうやる(^ω^#)

--

# さいごに

--

### 1円も儲かってません
- むしろVPSとドメイン費を含めれば赤字
- 自分が使いたいサービスに広告あったらウザい
- なにより作る過程が好き

🍣おごってくれてもいいんですよ！

--

### NNID: leader22

<img src="./img/nnid.png">

--

### Links

\#スーパーイカメーカー を支える技術  | console.lealog();<br/>
http://lealog.hateblo.jp/entry/2016/01/22/115913

このスライド<br/>
http://leader22.github.io/slides/node_gakuen-19/

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
  color: #fff;
  font-size: 10%;
  padding: 5px;
}
.progress {
  z-index: 1;
}

.progress-bar {
  background-color: #ff6e00;
}

.slide {
  background-color: #000;
  color: #fff;
}

a {
  color: #ff6e00!important;
}

h3 {
  border-color: #ff6e00;
}

pre {
  border: 1px solid #ff6e00;
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

#slide-1 h1,
#slide-12 h1,
#slide-13 h1,
#slide-15 h1 {
  font-size: 230%;
}
</style>
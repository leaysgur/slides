title: "#スーパーイカメーカー について"
controls: false
--

# #スーパーイカメーカー
## を支える技術

<img src="./img/loading.gif">

## 2016/02/09 Node学園 19時限目

--

### はじめまして

- Yuji Sugiura
- @leader22
- PixelGrid Inc.

<img src="./img/doseisan.jpg">

--

### 宣伝

<img src="./img/cg.png">

## ＼デザインリニューアル／

--

### #スーパーイカメーカー とは

<img src="./img/01.png">

- 某ゲームの某キャラ風のかわいいアイコンが作れちゃうWebサービス
- @jenga_inkさんによる手書き画像が400枚以上！

--

### お手元のスマホでもPCでも

<img src="./img/icon.png">

## http://ikasu.lealog.net/

--

### おかげさまで

<img src="./img/02.png">

ひいた(リリースして6時間経ったころ

--

### おかげさまで！

<img src="./img/03.png">

これが・・バズるということか・・

--

### おかげさまで！！

- GIGAZINE
- AppBank
- NAVERまとめ
- Reddit
- その他の海外SNS
- たくさんの個人ブログ
- etc...

--

### おかげさまで！！！

<img src="./img/04.png">

世界中からアクセスが！

--

### おかげさまで！！！！
Google Analytics曰く、

- 累計ユーザー: 280,000
- 累計ページビュー: 860,000
- DAU: 5,089
- 今は落ち着いてて、リアルタイムで50人ほど

今はすーごく平和です。

--

### 今日はそんなサービスの裏側を？

Node学園で話すということは。

- そんなトラフィックをNode.jsで捌いたとか？
- 画像生成のバックエンドがNode.jsとか？？

そう思うかもしれませんが・・・！

--

# Node使ってません

<img src="./img/loading.gif">

## に"っ(ちょっとだけ使ってるけど)

--

### 黒幕

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
CDNとか、オートスケールとか、一切なし。

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

※ガール版のみの初期リリースまで。

- 構造考えるのに2日
- コード書くのに1日
- 見た目調整したりリファクタしたり1日

もちろん絵は別で、1週間くらいかかってそう。<br>
ちゃんと本業をこなした後ですよ！

--

### 下準備

- 画像を用意
- 存在する画像から、パーツリスト用オブジェクトの生成スクリプトを実行( ココがNode.js！ )
- build

```
postcss -c ./.postcssrc.json
browserify ./src/script/main.js -t babelify -t uglifyify -o ./dist/script.js
```

--

### 仕組み(Flux)

- パーツをポチっと
- "設定変えたよ"Actionを発行
- Stateの設定データが更新
  - 更新されたStateを元に、
  - 裏でCanvasに`drawImage()` -> `toDataURL()`[*1]
- Viewが更新

> [*1] 全て同サイズの画像を重ねて、Canvasで描画

--

### FluxやるならRedux？
- という世間の風潮ありませんか
- りでゅーさー、でぃすぱっちゃー、みどるうぇあ、あくしょんくりえいたー・・
  - 心折れた
- そもそもFluxってそんなに大きいものなの

MVCでも綺麗にUIイベントとデータを分離していたあの頃と何が変わってしまったの・・

--

### そんなあなたにflumpt
https://github.com/mizchi/flumpt/

- `this.dispatch('EVENT')`できる`flumpt.Component`
- それを受けてStateを更新する根本の`flumpt.Flux`
- 提供されるのはこの2つだけなのでとっつきやすい
- (細かい機能は他にもあるけど使ってない)

S+のイカが作ったライブラリなら安心！(適当)

--

### コードの詳細

https://github.com/leader22/ika-maker

- 1ソースで全解像度対応
- 規模が小さいので特筆すべき点がない
- OGPやらピン留めやら対応済み

画像さえ用意すれば、誰でもスーパーxxメーカーが！

--

# 悩んだこと

--

### 200リクエストを待つかどうか問題
- 200枚のパーツ画像を全て読み込んでから起動
  - 随時読み込みでもよかった
- けど変更はその場で即反映されて欲しい！
  - 最初は待つけど、使わないものも多いけど・・
- なによりいっぱい選べる感は楽しい

--

### 色変えならSVGでいいのでは問題
- 髪色が違うだけで画像20枚
- SVGにすれば画像は減らせる
  - 一理ある
- しかしコストがかかりそうで踏み込めず
- リリース優先

--

### どこまで本家に忠実にするのか問題
- 本家の細かさ
  - 髪色とマユ色が連動するとか
  - ボーイの"マゲ"がギアによって隠れるとか
- いや、もっとオシャレしたい！

--

# 困ったこと

--

### 無限に通知くる問題

- Twitter for Android限定
- サイトリンク入りの自分の発言にセルフリプ
  - なぜか @leader22 がテキストに自動挿入される
- 気付かなかった世界中のAndroidユーザーが、日中夜問わず無限にマイイカをメンションしてくる
  - 通知きりました(˘ω˘ )

--

### 再読み込み？なにそれおいしいの問題

- バグ修正する or アップデートする
  - これがWebの利点ですよ(はっはっは
  - ページを再読み込みして更新して欲しい
- 現代っ子たち < 再読み込みってなんですか？自動じゃないの？
  - キャッシュなどもちろん理解されない
- しかしユーザー問い合わせの9割はコレ・・

--

# さいごに

--

### 1円も儲かってません
- むしろVPSとドメイン費を含めれば赤字
- 自分が使いたいサービスに広告あったらウザい
- 作る過程が好き

おごってくれてもいいんですよ！

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
console.log('TODO: 残り時間わかるように');
</script>

<style>
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
#slide-14 h1 {
  font-size: 230%;
}
</style>
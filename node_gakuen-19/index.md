title: "#スーパーイカメーカー について"
author:
  name: Yuji Sugiura
  twitter: leader22
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
- \#ウデマエアーカイブ

<img src="./img/doseisan.jpg">

--

### 宣伝

<img src="./img/cg.png">

## ＼デザインリニューアル／

-- 

### #スーパーイカメーカー とは

<img src="./img/01.png">

- 某ゲームの某キャラ風のかわいいアイコンが作れちゃうWebサービス
- @jenga_inkさんによる手書きの画像が400枚以上

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

Twitterのトレンドってすごい！

--

### おかげさまで！！

- GIGAZINE
- AppBank
- Reddit
- NAVERまとめ
- etc...

--

### おかげさまで！！！

<img src="./img/04.png">

世界中からアクセスが！

--

### おかげさまで！！！！
Google Analytics曰く、

- 累計28万ユーザー
- 累計86万ページビュー
- DAU 5,089
- 今は落ち着いてて、リアルタイムで50人ほど

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

### とある一幕

<img src="./img/05.png">

まぁみんな大好きWebネタということで

--

### サーバーサイド

- さくらVPS [ CPU3コア / メモリ2GB ]
- Nginx
  - worker_processes: 3
  - worker_connections: 1024
  - worker_cpu_affinity: 01 10 11;
  - worker_rlimit_nofile: 4096;

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
  - Flux [ flumpt by @mizch ]

画像の合成もすべてクライアントで。

--

### 下準備

- 画像を用意
- 存在する画像から、パーツリスト用オブジェクトの生成スクリプトを実行( ココがNode.js )
- build

```
postcss -c ./.postcssrc.json
browserify ./src/script/main.js -t babelify -t uglifyify -o ./dist/script.js
```

--

### 仕組み

- パーツをポチ
- "設定変えたよ"Actionを発行
- Storeの設定データが更新
  - 更新されたデータを元に、
  - 裏でCanvasにdrawImage -> toDataURL
- Viewが更新

全て同じサイズの画像を重ねて、Canvasで描画してるだけ。

--

### Flux

--

### ちなみに1円も儲かってません

- 自分が使いたいものに広告あったらうざい
- 作る過程が好きなので
- おごってくれてもいいんですよ

--

### TODO
- ika-makerのREADMEなおす
- リファクタとかできれば

--

### NNID: leader22
<img src="./img/nnid.png">

<script>
console.log('nyan');
</script>

<style>
.slide {
  background-color: #000;
  color: #fff;
}

a {
  color: #ff6e00;
}

h3 {
  border-color: #ff6e00;
}

pre {
  border: 1px solid #ff6e00;
  padding: 2%;
}

.slide-content img {
  display: block;
  margin: 0 auto;
  max-width: 80%;
}

#slide-1 h1,
#slide-12 h1 {
  font-size: 230%;
}
</style>
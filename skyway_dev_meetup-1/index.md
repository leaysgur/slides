title: SkyWay JS SDKの歩き方
controls: false
--

# <a>SkyWay JS SDK</a>の歩き方

## &nbsp;
## 2017/09/29 SkyWay Developer Meetup #1

--

### はじめまして

- Yuji Sugiura / [@leader22](https://twitter.com/leader22)
- フロントエンド・エンジニア at PixelGrid Inc.
- ブログもよろしく
  - [console.lealog();](http://lealog.hateblo.jp/)

![leader22](../public/img/doseisan.jpg)

--

### SkyWayの中の人？です

https://github.com/skyway/skyway-js-sdk/graphs/contributors

![https://github.com/skyway/skyway-js-sdk/graphs/contributors](./img/contrib.png)

※訳: （お忙しい）中の（人に代わってがっつりコードを書いてる）人です

--

### やったこと

- 既存APIを壊さない範囲でのリファクタ
- ビルド / 開発環境の整理
- ES Modules化
- Safari / Edge対応（一部）
- ブラウザの謎挙動の調査
- etc..

感想: これがかの有名なWebRTC沼かー😇

--

# ＼ 祝・商用リリース🎉 ／

--

# SkyWay JS SDKの歩き方

--

# SkyWay JS SDKの歩き方
## もとい、5分でわかるSkyWay JS SDK

--

### ライブラリの構造

```js
/src
├── peer.js
├── peer
│   ├── connection.js
│   ├── dataConnection.js
│   ├── mediaConnection.js
│   ├── room.js
│   ├── meshRoom.js
│   ├── sfuRoom.js
│   ├── negotiator.js
│   └── socket.js
└── shared
    ├── config.js
    ├── logger.js
    ├── sdpUtil.js
    └── util.js
```

2017/09/11時点です。

https://github.com/skyway/skyway-js-sdk/tree/master/src

--

### ざっくり簡略化すると

- Peer: 親玉であるメインのオブジェクト
  - peer/
    - Connection: Media or Data
    - Room: Mesh or SFU
    - 実際にP2P通信を行うためのコア（ユーザーは触らない）
  - shared/
    - ただの関数やら定数やら（ユーザーは触らない）

https://webrtc.ecl.ntt.com/js-reference/ もチェック！

--

### コードを読むなら

- とりあえず読むなら
  - peer.js
- そこから返るクラス
  - peer/mediaConnection.js
  - peer/dataConnection.js
  - peer/meshRoom.js
  - peer/sfuRoom.js
- WebRTCのコアなことなら
  - peer/negotiator.js

--

# このSDKのココが○○

--

### すごい: OSSである

- コードが読める
- コードが<s>パクれる</s>参考にできる
- 自分で機能追加PRも出せる

WatchしてるだけでWebRTC界隈全体の動きもわかるかも？

--

### すごい: これがほとんど無料

> https://webrtc.ecl.ntt.com/pricing.html

- 普通に個人で利用するならまず問題ない
- シグナリングサーバー用意しなくていい・・神・・
- SFUも無料で使える・・神・・

神・・ 🙏

--

### xxx: 懇親会で！

もう時間もないので気になる方は後で個別にどうぞ・・😇

--

### Thank you!

- [このスライド](https://leader22.github.io/slides/skyway_dev_meetup-1)
- [skyway/skyway-js-sdk: JavaScript SDK for SkyWay](https://github.com/skyway/skyway-js-sdk)

<style>
:root {
  --bg-color: #fcfdff;
  --bar-color: #003B7B;
  --em-color: #4780FF;
}
</style>
<link rel="stylesheet" href="../public/base.css">
<link rel="stylesheet" href="../public/timer.css">
<script src="../public/timer.js"></script>
<script src="../public/mobile-controls.js"></script>

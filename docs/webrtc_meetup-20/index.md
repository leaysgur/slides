title: NodeJS(TypeScript)でSTUN(RFC5389)(の一部)を実装した
controls: false
--

# <a>NodeJS</a>(TypeScript)で<br><a>STUN</a>(RFC5389)(の一部)を<br>実装した

## &nbsp;
## 2019/02/06 WebRTC Meetup Tokyo #20

--

### はじめまして

- Yuji Sugiura
- NTTコミュニケーションズ株式会社
  - ex-株式会社PixelGrid
- SkyWayの中の人やってます
- WebRTC Meetupは2度目の登壇

![leader22](../public/img/prof.jpg)

--

### はじめまして

- [@leader22](https://twitter.com/leader22)
- 技術ブログも書いてます
  - [console.lealog();](http://lealog.hateblo.jp/)
  - 今日の発表の元ネタ記事もあります

![leader22](../public/img/doseisan.jpg)

--

# 今日話すこと

--

### 目次

- STUNとはなにか
- STUNの使用例 w/ デモ
- 実装の詳細
- NodeJS(TypeScript)でこういうことをやっての学び

半分くらいはこの記事に書いてあります・・！

> [NodeJSでSTUN(RFC5389)(の一部)を実装した - console.lealog();](https://lealog.hateblo.jp/entry/2018/12/28/184909)

--

# <a>STUN</a>とはなにか

--

### STUN is プロトコル

- <a>NAT</a>を越えて通信するためのユーティリティ
  - の作り方が書いてあるRFCがある
- [RFC 5389 - Session Traversal Utilities for NAT (STUN)](https://tools.ietf.org/html/rfc5389)
- Obsoletes RFC 3489
  - [RFC 3489 - STUN - Simple Traversal of User Datagram Protocol (UDP) Through Network Address Translators (NATs)](https://tools.ietf.org/html/rfc3489)
  - いろいろやってみたら考慮が足らんかったらしい

このRFC5389についての話をします。

--

### NATとは

<a>N</a>etwork <a>A</a>ddress <a>T</a>ranslationの略

> インターネットプロトコルによって構築されたコンピュータネットワークにおいて、パケットヘッダに含まれるIPアドレスを、別のIPアドレスに変換する技術である。

from https://ja.wikipedia.org/wiki/ネットワークアドレス変換

もっと詳しく知りたい人へ👇

> [WebRTCの裏側にあるNATの話 - A talk on NAT behind WebRTC](https://www.slideshare.net/iwashi86/webrtcnat-a-talk-on-nat-behind-webrtc)

--

### なぜSTUN

- WebRTCで通信するために、相手のピアに自分のNW情報を知らせる必要がある
  - IPとかPortとか
  - `icecandidate`というやつ
- ただし、<a>外部のNWから見た</a>自分のIP/Portはわからない
  - わからないと知らせることができない
- 知らせることができないと、もちろんつながらない
  - ＼(^o^)／

もっと詳しく（ｒｙ

> [WebRTCのICEについて知る](https://www.slideshare.net/iwashi86/webrtcice)

--

### そこでSTUN

![STUNサーバーにSTUNクライアントから問い合わせる](./img/stun.png)

これで自分のNW情報がわかるので、それを送ればOK！

--

### 他にもいろいろ使われてる

- 他にもSTUNのWebRTC的なユースケースはある
  - ユースケース = STUNというコンポーネントを使ってなんかすること
- RFC5389よりも、他のRFCで言及されてたりする
  - [RFC 8445 - Interactive Connectivity Establishment (ICE): A Protocol for Network Address Translator (NAT) Traversal](https://tools.ietf.org/html/rfc8445)
  - [RFC 5766 - Traversal Using Relays around NAT (TURN): Relay Extensions to Session Traversal Utilities for NAT (STUN)](https://tools.ietf.org/html/rfc5766)
  - [RFC 7350 - Datagram Transport Layer Security (DTLS) as Transport for Session Traversal Utilities for NAT (STUN)](https://tools.ietf.org/html/rfc7350)
  - etc...

発表タイトルの(一部)とはそういう意味で、今日はさっきの図の範囲の話しかしません！

--

# STUNの詳細

--

# その前にデモ
## さっきの図の挙動を実際に見てみる

--

### 挙動の確認

```javascript
const pc = new RTCPeerConnection({
  sdpSemantics: 'unified-plan',
  // コレを指定すると
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
});

pc.createDataChannel('');
pc.createOffer()
  .then(s => pc.setLocalDescription(s));

// ココが多く発火する
pc.onicecandidate = ev => {
  if (ev.candidate !== null) {
    console.log(ev.candidate.candidate);
  } else {
    console.warn(pc.localDescription.sdp);
  }
}
```

この時、ブラウザが内部的にSTUNを使ってます。
candidateやSDPを読めば使われてるかどうかがわかります。

その内部的な挙動を切り出して実装したのが、今回のやつです。

--

### STUNの実装

- <a>STUNメッセージ</a>💌をやり取りする決まり
  - フォーマットが決まってる
- これをUDPやTCPのペイロードに載せて送りあう
  - どっちを使ってもよい

つまり実装 = このメッセージの組み上げ・読み取りを抽象化してコードにすること。

--

# まずはリクエスト

--

### リクエスト（パケット）

```
0000000000000001000000000000000000100001000100101010010001000010100111110111001000010100010000101100101101111000011111100010110001011110000000001111011000111111
```

お、おう・・。

読めないし、理解できない・・。

--

### リクエスト（Octet Stream）

```
000100002112a4429f721442cb787e2c5e00f63f
```

だいぶマシになったけど、16進数を脳内変換する能力が必要。

```
00 01 00 00 21 12 a4 42 9f 72 14 42 cb 78 7e 2c 5e 00 f6 3f
```

少しだけ読みやすく区切るとこうなる。（プログラムで扱うのはほとんどこっちなはず）

この数字の並びにはどういう意味が・・？

--

### メッセージフォーマット

- ヘッダ
  - 20byte固定
- アトリビュート
  - 任意の数
  - RFC5389では11種類

このフォーマットに沿って、さっきの数字を当てはめていけばOK！

--

### STUN Header

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|0 0|     STUN Message Type     |         Message Length        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         Magic Cookie                          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
|                     Transaction ID (96 bits)                  |
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

先頭から、

- 16bit =  2byte: STUN Message Type
- 16bit =  2byte: Message Length
- 32bit =  4byte: Magic Cookie
- 96bit = 12byte: Transaction ID

この合計160bit = 20byte固定なのがヘッダ。

> [6. STUN Message Structure](https://tools.ietf.org/html/rfc5389#section-6)

--

### さっきのパケットを当てはめる

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|0 0|0 0 0 0 0 0 0 0 0 0 0 0 0 1|0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|0 0 1 0 0 0 0 1 0 0 0 1 0 0 1 0 1 0 1 0 0 1 0 0 0 1 0 0 0 0 1 0|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|1 0 0 1 1 1 1 1 0 1 1 1 0 0 1 0 0 0 0 1 0 1 0 0 0 1 0 0 0 0 1 0|
|1 1 0 0 1 0 1 1 0 1 1 1 1 0 0 0 0 1 1 1 1 1 1 0 0 0 1 0 1 1 0 0|
|0 1 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1 1 1 1 0 1 1 0 0 0 1 1 1 1 1 1|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

ね？簡単でしょう？

--

### 16進数で当てはめる

```
+-+-+-+-+-+-+
|00 01|00 00|
+-+-+-+-+-+-+
|21 12 a4 42|
+-+-+-+-+-+-+
|9f 72 14 42|
|cb 78 7e 2c|
|5e 00 f6 3f|
+-+-+-+-+-+-+
```

これなら読めそうな気がする！

--

### STUN Headerを読み解く

```
+-+-+-+-+-+-+      +-+-+-+-+-+-++-+-+-+-+-+-++-+-+-+-+-+-+
|00 01|00 00|      |   Message Type  |  Message Length   |
+-+-+-+-+-+-+      +-+-+-+-+-+-++-+-+-+-+-+-++-+-+-+-+-+-+
|21 12 a4 42|      |             MagicCookie             |
+-+-+-+-+-+-+  =>  +-+-+-+-+-+-++-+-+-+-+-+-++-+-+-+-+-+-+
|9f 72 14 42|      |                                     |
|cb 78 7e 2c|      |             Transaction ID          |
|5e 00 f6 3f|      |                                     |
+-+-+-+-+-+-+      +-+-+-+-+-+-++-+-+-+-+-+-++-+-+-+-+-+-+
```

先頭から、

- MessageTypeが`0001` as 16進数
  - Typeは4種類あって、これは`BINDING-REQUEST`
- Message Lengthは`0`
  - 任意の数のアトリビュートはついてないとわかる
- MagicCookieは固定値
  - `2112a442` as 16進数
- Transaction IDはランダム

つまり、アトリビュートなしの`BINDING-REQUEST`を送信していた！

--

# つづいてレスポンス

--

### レスポンス（Octet Stream）

```
+-+-+-+-+-+-+
|01 01|00 0c|
+-+-+-+-+-+-+
|21 12 a4 42|
+-+-+-+-+-+-+
|9f 72 14 42|
|cb 78 7e 2c|
|5e 00 f6 3f|
+-+-+-+-+-+-+
|00 20 00 08|
|00 01 c3 f7|
|a2 81 ee fd|
+-+-+-+-+-+-+
```


- Typeは`0101` as 16進数 = `257` as 10進数
- Lengthは`000c` as 16進数 = `12` as 10進数
  - 12byte分のアトリビュートがついてる
- MagicCookieは固定値
  - なのでリクエストと同じ
- Transaction IDはリクエストのIDと同じ
  - これでReq/ResのTransactionを表す決まり

なんらかのアトリビュートがついてる！

--

### STUN Attribute

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Type                  |            Length             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         Value (variable)                   ....
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

先頭から、

- 16bit = 2byte: STUN Attribute Type
- 16bit = 2byte: Attribute Length
- Nbit = Nbyte: Value
  - これが任意の数だけついてくる

このアトリビュートは、32bit = 4byte区切りと決まっており、余った部分は適当に埋める決まり。

> [15. STUN Attributes](https://tools.ietf.org/html/rfc5389#section-15)

--

### STUN Attribute Types

```
Comprehension-required range (0x0000-0x7FFF):
 0x0000: (Reserved)
 0x0001: MAPPED-ADDRESS
 0x0002: (Reserved; was RESPONSE-ADDRESS)
 0x0003: (Reserved; was CHANGE-ADDRESS)
 0x0004: (Reserved; was SOURCE-ADDRESS)
 0x0005: (Reserved; was CHANGED-ADDRESS)
 0x0006: USERNAME
 0x0007: (Reserved; was PASSWORD)
 0x0008: MESSAGE-INTEGRITY
 0x0009: ERROR-CODE
 0x000A: UNKNOWN-ATTRIBUTES
 0x000B: (Reserved; was REFLECTED-FROM)
 0x0014: REALM
 0x0015: NONCE
 0x0020: XOR-MAPPED-ADDRESS

Comprehension-optional range (0x8000-0xFFFF)
 0x8022: SOFTWARE
 0x8023: ALTERNATE-SERVER
 0x8028: FINGERPRINT
```

- RFC5389では11種類定義されてる
- 各Typeごとに、Valueを紐解けばよい

さっきのアトリビュートのTypeは・・？

> [18.2.  STUN Attribute Registry](https://tools.ietf.org/html/rfc5389#section-18.2)

--

### レスポンスのattribute

```
+-+-+-+-+-+-+
|00 20|00 08|
+-+-+-+-+-+-+
|00 01 c3 f7|
|a2 81 ee fd|
+-+-+-+-+-+-+
```

- Type: `0020` as 16進数
- Length: `8` as 10進数
- Value: `0001c3f7a281eefd` as 16進数

このアトリビュートは`0x0020: XOR-MAPPED-ADDRESS`だ！

--

### XOR-MAPPED-ADDRESS attribute

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|x x x x x x x x|    Family     |         X-Port                |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                X-Address (Variable)                         ...
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

先頭から、

- 8bit = 1byte: 使わないので`0`埋め
- 8bit = 1byte: Family
  - IPv4: `0x01` OR IPv6: `0x02`
- 16bit = 2byte: X-ポート
- Nbit = Nbyte: X-アドレス
  - Familyで長さが変わる
  - IPv4: 32bit = 4byte OR IPv6: 128bit = 16byte

ポートとアドレスが`XOR`演算されてるのが特徴。（ロジックは割愛）

> [15.2.  XOR-MAPPED-ADDRESS](https://tools.ietf.org/html/rfc5389#section-15.2)

--

### レスポンスのattribute（再掲）

```
+-+-+-+-+-+-+
|00|01|c3 f7|
+-+-+-+-+-+-+
|a2 81 ee fd|
+-+-+-+-+-+-+
```

Valueのみ抜粋し先頭から、

- 8bit: 無視
- 8bit = 1byte: `01` as 16進数
  - なのでIPv4
- 16bit: 2byte: `c3f7` as 16進数
  - RFCに記載のあるロジックで`XOR`演算するとポート`58085`に
- 32bit: 4byte: `a281eefd` as 16進数
  - RFCに記載のあるロジックで`XOR`演算
  - それをIPv4らしく4つに区切るとIPアドレス`131.147.74.191`に

これで読めた！

--

### レスポンスを読み解く

```
+-+-+-+-+-+-+      +-+-+-+-+-+-++-+-+-+-+-+-++-+-+-+-+-+-+
|01 01|00 0c|      |   Message Type  |  Message Length   |
+-+-+-+-+-+-+      +-+-+-+-+-+-++-+-+-+-+-+-++-+-+-+-+-+-+
|21 12 a4 42|      |             MagicCookie             |
+-+-+-+-+-+-+      +-+-+-+-+-+-++-+-+-+-+-+-++-+-+-+-+-+-+
|9f 72 14 42|      |                                     |
|cb 78 7e 2c|      |             Transaction ID          |
|5e 00 f6 3f|  =>  |                                     |
+-+-+-+-+-+-+      +-+-+-+-+-+-++-+-+-+-+-+-++-+-+-+-+-+-+
|00 20|00 08|      | AttrType(XOR-MA) |    Attr Length   |
+-+-+-+-+-+-+      +-+-+-+-+-+-++-+-+-+-+-+-++-+-+-+-+-+-+
|00|01|c3 f7|      |  ----  | Family  |       X-Port     |
+-+-+-+-+-+-+      +-+-+-+-+-+-++-+-+-+-+-+-++-+-+-+-+-+-+
|a2 81 ee fd|      |           X-Address                 |
+-+-+-+-+-+-+      +-+-+-+-+-+-++-+-+-+-+-+-++-+-+-+-+-+-+
```

元はといえば、

```
01 01 00 0c 21 12 a4 42 9f 72 14 42 cb 78 7e 2c 5e 00 f6 3f 00 20 00 08 00 01 c3 f7 a2 81 ee fd
```

今なら読める🤩

--

# NodeJS(TypeScript)で<br>これを実装

--

### しました

> [leader22/webrtc-stun: 100% TypeScript STUN implementation for WebRTC.](https://github.com/leader22/webrtc-stun)

- 100% TypeScript
  - 型定義いれて1000行くらい
- RFC5389の一部のみ
  - 6/11ヶのattributeを実装
- だいたい1ヶ月くらい
  - こういうことするの初なので遠回りした感

--

### リクエストの送信

```typescript
import * as dgram from 'dgram';
import * as stun from 'webrtc-stun';

// communicate on UDP
const socket = dgram.createSocket({ type: 'udp4' });

// use this id for transaction
const tid = stun.generateTransactionId();

// send BINDING-REQUEST
const req = stun.createBindingRequest(tid);
socket.send(req.toBuffer(), 19302, 'stun.l.google.com');

// ...
```

さっきのデモで使ったコードと同一のもの。

--

### レスポンスの受信
```typescript
// ...

socket.on('message', msg => {
  const res = stun.createBlank();

  // if msg is valid STUN message
  if (res.loadBuffer(msg)) {
    // if msg is BINDING_RESPONSE_SUCCESS and valid content
    if (res.isBindingResponseSuccess({ transactionId: tid })) {
      const attr = res.getXorMappedAddressAttribute();
      // if msg includes attr
      if (attr) {
        console.log('my rinfo', attr);
      }
    }
  }
});
```

自作WebRTCスタックの第一歩・・・！

--

# 実装してみての学び

--

### JavaScriptでプロトコル実装

- つらい🤮と思われがち + 思ってた
- が、トータルで省みると、思ってたよりつらくなかった
  - フロントエンドエンジニア補正はありそう
- 勝手がわかるまではもちろん大変だった
  - 主にNodeJSの`Buffer`の使い方
  - と、さっきのビット列のマッピングなど
- 型はあったほうが嬉しい
  - こんなにI/Fが単純な要件でも

--

### 前提知識が多い🤯

- プロトコル実装特有の前提知識（頻出語彙）
  - bit / byte
  - 2進数 / 10進数 / 16進数
  - BE / LE
  - NBO / HBO
  - MSB / LSB
  - etc...
- ビット演算のための筋肉
  - 回避した結果、一部は冗長なコードに・・・

--

### ビット単位の処理は面倒

- そんなに頻繁ではないけど
- 直接ビット列にアクセスする手段がない
  - 例えば、先頭2bitが`0`かどうか
- 愚直に実装するしかない
  - 先頭1byteを読んで
  - 2進数にして
  - 桁をあわせて
  - 文字列として判定する
- 他の言語でも同じ・・？
  - ビット演算しろという話ではある

--

### DevToolsでデバッグできる

- 控えめにいって最高
- `node --inspect-brk ./client.js`
  - 任意の行を`debugger`で止められる
  - 変数も覗き放題
- ただし16進数を脳内でパースする必要あり
  - DevToolsに見える数値はすべて10進数になってる
  - RFCはだいたい16進数で書いてある

--

### RFCの行間を読むのがつらい

- 何よりもつらい
- 実装の100倍つらい
  - 要件の全容が把握できないまま、ベストなAPIを模索
  - カジュアルに破壊的変更するしかない
- 読んで理解しないと実装できないけど、実装しないとそもそも理解できないという怪現象が起こる
  - 🤔🤔🤔
- そして関連RFCの数も膨大

--

# まとめ

--

### まとめ

- STUNはWebRTCを支える技術
  - であるICEを支える技術
  - いわゆるNAT越えを実現するための道具
- STUNメッセージをやり取りする決まり
  - メッセージにはTypeがある
  - メッセージにはアトリビュートがついてる
- JavaScriptでもこういう実装はできる
  - DevToolsのおかげでデバッグはしやすい

--

### 今後の展望

- 全てのアトリビュートを実装する・・？
  - 拡張されまくりで、40種類くらいある🤗
  - [Session Traversal Utilities for NAT (STUN) Parameters](https://www.iana.org/assignments/stun-parameters/stun-parameters.xhtml)
- ICEを実装してみて、必要な拡張部分だけを追加する？
  - 4-5種類くらいなはず
- 次のレイヤーへ？
  - DTLS・・？
  - でも前例あるし・・

--

### 参考資料
- [RFC 5389 - Session Traversal Utilities for NAT (STUN)](https://tools.ietf.org/html/rfc5389)
- [NodeJSでSTUN(RFC5389)(の一部)を実装した - console.lealog();](https://lealog.hateblo.jp/entry/2018/12/28/184909)
- [輪講資料 ICE（Interactive Connectivity Establishment）](http://www.wata-lab.meijo-u.ac.jp/file/seminar/2017/2017-Semi1-Yuma_Kamoshita.pdf)
- [nodertc/stun: Low-level Session Traversal Utilities for NAT (STUN) server](https://github.com/nodertc/stun)

--

# Thank you!

<style>
:root {
  --bg-color: #f8fdff;
  --bar-color: #66b5ff;
  --em-color: #6f89d8;
}
</style>
<link rel="stylesheet" href="../public/base.css">
<link rel="stylesheet" href="../public/timer.css">
<script src="../public/timer.js"></script>
<script src="../public/mobile-controls.js"></script>

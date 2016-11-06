title: WebAudio初学者を阻む壁について
controls: false
--

# <a>WebAudio</a>初学者を<br>阻む壁について

## &nbsp;
## 2016/11/08 WebAudio.tokyo \#2

--

### はじめまして

- Yuji Sugiura / [@leader22](https://twitter.com/leader22)
- フロントエンド・エンジニア at PixelGrid Inc.

![leader22](./img/doseisan.jpg)

--

### Web Audio API 初心者向けハンズオン

![](https://connpass-tokyo.s3.amazonaws.com/thumbs/20/ff/20ff4ec05444a61a8627641d089d9afe.png)

- この間の日曜日
- メンターとして参加しました
- そこで出てた質問 = 初学者を阻む壁
- その一部をご紹介

--

# 初学者を阻んだ壁

--

# 堂々の第一位

--

# なぜか音が鳴らない

--

# ＼なぜか音が鳴らない／

--

### そんなはずはない
- プログラムは嘘付かない
- 書いたコードに何か問題があって、音が鳴らない
- 壁にもカテゴリがある
  - 問題の切り分けが大事

まぁ極稀に自分は悪くないのに動かないこともあ..(˘ω˘ )

--

### カテゴリ
- 各API特有のもの
- ブラウザの実装によるもの
- その他

--

# API特有のもの

--

### 問: このパラメータの上限値は？

```js
var oscillator = audioCtx.createOscillator();
oscillator.frequency.value = 440; // コレとか

var delay = audioCtx.createDelay(5.0);
delay.delayTime.value = 3.0; // コレとか
```

- なぜ`440`なの？
- もっと大きい・小さい値は入れられないの？
- 初期値は？

--

### AudioParamというまとまり

```js
// これらは実は AudioParam というオブジェクト
oscillator.frequency;
delay.delayTime;
```


- 値を直接セットしたり
- 関数で逐次セットしたりもできる

肝心の値の初期値・範囲は、各AudioNodeごとに決まってる

--

### 例: delay.delayTime
> Its default value is 0 (no delay).
> The minimum value is 0 and the maximum value is determined by the maxDelayTime argument to the AudioContext method createDelay.

https://webaudio.github.io/web-audio-api/#h-attributes-8

--

### さっきの例だと

```js
var delay = audioCtx.createDelay(5.0);
delay.delayTime.value = 3.0;
```

- min: 0
- max: 5.0
- default: 0

--

### 問: AudioNodeが..

```js
// まず鳴らす
var oscillator = audioCtx.createOscillator();
oscillator.start();

// 止める
oscillator.stop();

// また鳴らそうとするとエラー
oscillator.start();
```

Failed to execute 'start' on 'OscillatorNode': cannot call start more than once.

--

### AudioNodeは使い捨て

- いったん`stop()`すると、もう`start()`できない
- また新しくAudioNodeを作って
  - また繋ぎ合わせて
  - また`start()`しないとダメ

そういうデザインのAPIなので割り切る。

--

# ブラウザの実装によるもの

--

### 例: マイクから拾って音を出す

音は鳴った。

```js
micStream.stop(); // micStream.stop is not a function
```

が、止めるとエラーになる！

--

### MediaStream

- 昔は動いてた
- ある時から仕様が変わった

```js
// micStream.stop();
micStream.getAudioTracks().forEach((track) => { track.stop(); });
```

ちなみにこれはWebRTCのAPIの問題

--

### 他にもいろいろ

- `AudioContext`
  - iOSのSafariは`webkitAudioContext`だったり
- `AudioNode.start`
  - 昔は`start`ではなく`noteOn`だったり・・
- `navigator.getUserMedia`
  - `navigator.mediaDevices.getUserMedia`

コピペして試す場合は、古いAPIのコードに注意！

--

### メソッドのI/Oも

```js
audioCtx.decodeAudioData(audioData, function(buffer) {
  // コールバック
});

audioCtx.decodeAudioData(audioData)
  .then(function(buffer) {
    // Promise
  });
```

便利なものは使っていきましょう！

--

# その他の問題

--

### 書いたコードが悪い
- そもそもシンタックスエラー
- 音源ロードしただけで再生してない
- 非同期処理のタイミングで実行されてなかったり
  - `xhr.onload`
  - `decodeAudioData`

エディタやLinterでチェックできるし、慣れでカバーもできる

--

### 環境が悪い
- ブラウザによって再生できる音源ファイルフォーマットが違う
- [Media formats supported by the HTML audio and video elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats#Browser_compatibility)

この表も微妙に古いような・・？

--

### 環境が！悪い！

- モバイル（iOS Safari）の制限
- ユーザーの`click`や`touchstart`等のイベントを経由しないと音がでない
  - `onload`でファイルのロードと`decodeAudioData`まではできるが・・

一度出せば後はOK、無音のファイルを再生させて回避したり。

--

### 用語がわからん
- AudioParamのa-rate / k-rate
- サンプリングレート？
- ナイキスト周波数・・・日本語でおｋ
- フーリエ変換 is 何

http://www.g200kg.com/jp/docs/dic/ というバイブルを読もう！

--

# 目指せWebAudioMaster

--

### 簡単に言うけど
- JavaScript自体に慣れる
  - 非同期処理のいい感じの書き方とか
  - ついでにWebRTCとか親和性の高い技術も知る
- AudioNodeを知る・慣れる
  - Nodeは使い捨て、AudioParamの使い方
  - こういうことするならこのAudioNode
- ブラウザや環境の差異を把握する
- サウンドプログラミングの手札を増やす


--

# Thank you!

<style>
:root {
  --bg-color: #fffdf8;
  --bar-color: #274a78;
  --em-color: #54b6d3;
}
</style>
<link rel="stylesheet" href="../public/base.css">
<link rel="stylesheet" href="../public/timer.css">
<script src="../public/timer.js"></script>
<script src="../public/mobile-controls.js"></script>

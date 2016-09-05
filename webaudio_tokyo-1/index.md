title: WebAudioでなんちゃってWebRTCする
controls: false
--

# <a>WebAudio</a>で<br>なんちゃってWebRTC

## &nbsp;
## 2016/09/06 WebAudio.tokyo \#1

--

### はじめまして

- Yuji Sugiura / [@leader22](https://twitter.com/leader22)
- フロントエンド・エンジニア at PixelGrid Inc.
- 最近の仕事はパフォーマンスチューニング📈とかReact案件とか
- 趣味ではReact Native x Swiftで音楽プレーヤーを少々

![leader22](./img/doseisan.jpg)

--

### WebAudioとわたし

- 誰もが通るOscillatorでシンセを作るところから
- 前職（渋谷のDなんとか社）で、ソシャゲのBGM・効果音に使えないか検証したり
- [宣伝] [CodeGrid](http://www.codegrid.net/)に[入門記事](https://app.codegrid.net/series/2015-sound)書いたり
- いわゆる[MP3プレーヤー](https://github.com/leader22/mmss)作ってみたり

素人ではないが、ガチ勢でもないレベル・・・(˘ω˘ )

--

# 🎉WebAudio.tokyo
##まさかWebAudioの勉強会が開催される日がくるとは！

--

# <a>WebAudio</a>で<br>なんちゃってWebRTC

--

# ...🤔

--

# （iOSだとWebRTCが使えないので<br>WebSocketと）<a>WebAudio</a>で<br>なんちゃってWebRTC<br>（という試みを半年前にやった話）

--

### WebRTCとは

ざっくり言うと、

- ブラウザでマイクやカメラのストリームを取得し
- ネットワークを越えてリアルタイム配信できるAPI
- "基本的"には通信はP2P
  - ただしP2Pだとスケールしない..

SkypeがWebの技術でできるようなもの。<br>
ただ、このモバイル全盛期でもiOSのWebで使えない！！

--

### そこで

WebRTCアプリの会話・音を聞くだけでも・・。

というわけで、

- WebRTCのストリームから音を拾って
- それをWebSocketで送りつければ
- iOSでもWebAudioで再生できるし
- 力ずくやけどWebRTCっぽいことできないか？

なんちゃってWebRTCできるのでは！

--

# できた💪(´∀｀💪)

--

# デモ👀
##（WiFiがあれば）

![](https://raw.githubusercontent.com/leader22/audio-streaming-over-websocket/master/demo-img.jpg)

--

### アプリの概要
- [leader22/audio-streaming-over-websocket](https://github.com/leader22/audio-streaming-over-websocket)
- WebRTC x WebWorker x WebAudio x WebSocket
- JavaScript
  - Vue.js
  - Browserify
  - WebWorkify
  - Socket.IO
- CSS
  - PostCSS
  - Milligram

--

### やってること: Publisher

- getUserMedia()
- MediaStreamSourceNode
  - BiquadFilterNode
  - ScriptProcessorNode: 1ch
    - postMessage('audio', PCM&lt;ArrayBuffer&gt;)
- WebWorker
  - socket.emit('audio', payload)

--

### やってること: Subscriber

- WebWorker
  - socket.on('audio', payload)
- ctx.createBuffer.set(new Float32Array(payload))
- AudioBufferSourceNode
- source.start()

--

# WebAudioな部分の紹介
## WebAudioの勉強会なので

--

### マイク🎙の音をAudioNodeにする
```js
var crx = new AudioContext();

navigator.mediaDevices
  // 今回は音さえあればOK
  .getUserMedia({ audio: true })
  .then((stream) => {
    var micSrc = ctx.createMediaStreamSource(stream);

    // micSrc: AudioBufferSourceNode
    // コレをつないでいく
  })
```

`getUserMedia()`は、localhostかhttps環境でお試しください！

--

### 雑音を雑にカットする💇🏻

```js
var filter = ctx.createBiquadFilter();
filter.type = 'bandpass';
// アナログ電話は300Hz ~ 3.4kHz / ひかり電話は100Hz ~ 7kHz
filter.frequency.value = (100 + 7000) / 2;
// 固定ならだいたい聴き良いのがこれくらい・・？
filter.Q.value = 0.25;

micSrc.connect(filter);
```

リアルタイムに周波数帯を検知して、ダイナミックにフィルタも変動したかったけど面倒なのでやめた・・。

--

### 音源（INPUT）のデータをみる📊

```js
var analyser = ctx.createAnalyser();
analyser.smoothingTimeConstant = 0.4;
analyser.fftSize = BUFFER_SIZE;

var fbc = analyser.frequencyBinCount;

var freqs = new Uint8Array(fbc);
analyser.getByteFrequencyData(freqs);

// freqsの中身を、canvasにグラフとして描画
```

入力音によって波打つアレ。<br>
これがあるとそれっぽい感じに！

--

### 音データを飛ばす🚀
```js
var processor = ctx.createScriptProcessor(BUFFER_SIZE, 1, 1);
processor.onaudioprocess = _onAudioProcess;

function _onAudioProcess(ev) {
  var inputBuffer  = ev.inputBuffer;
  var outputBuffer = ev.outputBuffer;
  // 1chなのでインデックスは0
  var inputData  = inputBuffer.getChannelData(0);
  var outputData = outputBuffer.getChannelData(0);

  // Bypassしつつ飛ばさないとダメ
  outputData.set(inputData);
  // これをそのままWebSocketで流す
  worker.postMessage({
    type: 'AUDIO',
    data: outputData.buffer
  });
}
```

音質にこだわるなら、ここで巨大なバッファに2chつめこめば・・？

--

### 音データを受け取る📡
```js
var ctx = new AudioContext();

// WebSocketで受けたバッファを処理する
function _handleAudioBuffer(buf) {
  var f32Audio = new Float32Array(buf);
  // 送られてきたのとあわせる
  var audioBuffer = ctx.createBuffer(1, BUFFER_SIZE, ctx.sampleRate);
  audioBuffer.getChannelData(0).set(f32Audio);

  // 後はいつも通り
  var source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audio.gain);
}
```

後は鳴らすだけ！

--

### いいタイミングで再生する🔊
```js
var _startTime = 0;
var currentTime = ctx.currentTime;

// つまってるので未来に再生
if (currentTime < _startTime) {
  source.start(_startTime);
  _startTime += audioBuffer.duration;
}
// すぐ再生
else {
  source.start(_startTime);
  _startTime = currentTime + audioBuffer.duration;
}
```

これが地味に重要で、こうしないとプツプツとぎれとぎれになります・・。

--

# まとめ

--

### 気になる実用性

- リアルタイム性
  - ネットワークによってはじわじわ遅延する
  - 都度つなぎなおせばLTEでも全然OK
- 音質
  - 今回の実装（1ch / 1024）だと音楽は辛い
  - ニュースや会話は問題ない

やってみた本人が一番驚いてるけど、意外にイケる😊

--

### 触れなかった話題
- なぜWebWorkerなのか
- Vue.jsのアレコレ
- Web屋がこういうことやるにあたっての壁

一部は[ブログ](http://lealog.hateblo.jp/entry/2016/02/26/200718)に！もしくは懇親会🍕で！

--

# Thank you!

<style>
:root {
  --bg-color: #fffdf8;
  --bar-color: #274a78;
  --em-color: #54b6d3;
}
\#slide-7 {
  font-size: 70%;
}
</style>
<link rel="stylesheet" href="../public/base.css">
<link rel="stylesheet" href="../public/timer.css">
<script src="../public/timer.js"></script>
<script src="../public/mobile-controls.js"></script>

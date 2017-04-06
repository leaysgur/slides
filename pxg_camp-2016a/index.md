title: WebSocketでAudioStreamingしてみた
controls: false
--

# AudioStreaming over WebSocket
## 2016/02/21-23 PixelGrid Inc. 開発合宿 in 八丈島
--

# 事の発端

--

### WebRTC界隈の技術を見ていて
- リアルタイムコミュニケーション用のAPI群
  - MediaStream API(getUserMedia): カメラ・音
  - RTC**3つほど: それを通信する
- なんしかUDP上でP2P通信ができる
  - PeerConnection
  - offer with SDP
  - answer with SDP
- ただしP2Pではスケールしない(20とかでアウト)

--

### WebRTC SFU
- Selective Forwarding Unitの略
- 1クライアント ⇔ サーバー ⇔ Nクライアント
- サーバーのスペック上がればスケールできる！

--

# ん・・？

--

# サーバーを介す？

--

# WebRTCでやる<br>必要ないのでは

--

### 既存の技術で再構築できれば
- iOSにリーチできる可能性
  - スーパーイカメーカーのアクセスの60%はiOS
  - そういえばイカデンワというものが
- 難解なWebRTCスタックを学ばずに済む
- WebSocketとか使えばなんとかなるのでは？

--

### 注:
今から説明するものは、

- WebRTCの代替ではない
  - あくまで目標達成への別アプローチ
- ここで話した以上の認識がない
  - 実用的かの判断がつかない
  - 落とし穴はいっぱいありそう
  - セキュリティとかスケーラビリティとか

--

# 改めて

--

# AudioStreaming over WebSocket

--

# DEMO
## [Publisher](http://localhost:8888/client/pub/) / [Subscriber](http://localhost:8888/client/sub/)

--

# やってること紹介

--

### ざっくり
- AudioStreamを
- WebAudioに食わせてArrayBufferにして
- バイナリが送れるWebSocketでそのまま流して
- WebAudioで受けて再生

--

### Publisher
- getUserMedia
  - MediaStreamSourceNode
  - BiquadFilterNode
  - ScriptProcessorNode: 1ch
    - postMessage(PCM &lt;ArrayBuffer&gt;)
  - WebWorker
    - socket.IO.emit('audio', payload)

--

### Socket.IO Server

```javascript
socket.on('audio', (payload) => {
  // 送り先はともかく、ほんとに流すだけ
  socket.to(payload.ch).emit('audio', payload.buf);
});
```

--

### Subscriber
- socket.on('audio')
  - new Float32Array(payload)
  - createBuffer.set(buf)
  - source.start()

--

# ね、簡単でしょ？

--

### WebRTCへの優位性
- iOSで動く
  - iOS7でも！やったね！
- もちろんAndroidでも動く
  - WebSocketが動けば動く！
- SDPまわりの煩雑な処理とかいらない
  - UDPホールパンチングなにそれお
  - Web屋のスタックでなんとかなる

--

### できないこと
- iOS側からの音の入力
  - あくまで聴く専
--

# 関連技術のご紹介

--

### ScriptProcessor
```javascript
var processor = context.createScriptProcessor(
  BUFFER_SIZE,
  // 1: Monoral, 2: Stereo
  numOfInputCh,
  numOfOutputCh
);

processor.onaudioprocess = function(ev) {
  var inputBuffer  = ev.inputBuffer;
  var outputBuffer = ev.outputBuffer;

  // Float32Array
  var inputData  = inputBuffer.getChannelData(0);
  var outputData = outputBuffer.getChannelData(0);

  for (var sample = 0; sample < inputBuffer.length; sample++) {
    outputData[sample] = inputData[sample];
  }
  // or just set
  // outputData.set(inputData);
};
```

PCMのサンプルデータに直接アクセスできるAudioNode

--

### BiquadFilter
```javascript
var filter = context.createBiquadFilter();

// 電話はバンドパスフィルタ
filter.type = 'bandpass';
// アナログ電話は300Hz ~ 3.4kHz / ひかり電話は100Hz ~ 7kHzを使ってる
// 今回は高品質あたりに山を作る
filter.frequency.value = (100 + 7000) / 2;
// 固定ならだいたい聴き良いのがこれくらい・・？
filter.Q.value = 0.25;
```

最適な通過帯域は声や音によってそれぞれなので、決め打ちは気休めでしかない・・<br>が、コレが有るのと無いのでは大違い

--

### WebWorker
```javascript
new Worker('./worker.js');
// require('webworkify')(require('./worker.js'));
```

- Mainスレッドとは別
  - Workerスレッドでjs処理ができる
  - MainとはpostMessageでやりとり
- Chromeの仕様？でタブが裏に回るとMainスレッドの処理が間引かれて音が途切れる
- Workerで処理させれば回避できた
- Browserifyするなら`webworkify`

--

### 再生タイミングの調整
```javascript
socket.on('audio', this._handleAudioBuffer);

// とにかくこれがすごい呼ばれる
function _handleAudioBuffer(buf) {
  var currentTime = ctx.currentTime;

  // 略

  // 貯まってるので未来に再生
  if (currentTime < startTime) {
    source.start(startTime);
    startTime += audioBuffer.duration;
  }
  // すぐ再生
  else {
    source.start(startTime);
    startTime = currentTime + audioBuffer.duration;
  }
}
```

こうしないと、Socketの到着タイミングで随時再生されちゃうので、プツプツと聞けたもんじゃない！

--

### まとめ
- WebSocketはバイナリを流せる
  - 2010年で既に
  - Socket.IOが対応したのは2014年春
- AudioStreamは、ただのArrayBufferである
  - Float32Array
  - ScriptProcessorでいじれる
- マイクは雑音の宝庫なので、フィルタおすすめ
  - 電話はすごい
  - LINEもすごい

--

# 気になる実用性

--
### LANで試す

同一WiFi上で、<br>
Pub: Mac ⇔ Server ⇔ Sub: Mac || iPhoneの場合。

|Pubの内容　　|評価　|備考|
|:-----------|:--:|:---|
|マイクから声|S+  ||
|動画ニュース|S+  ||
|音楽        |S   |さすがに音質が気になる|

--

### WANでも試す

サーバーをVPSに立ててみた。<br>
Pub: Mac ⇔ Server ⇔ Sub: Mac || iPhoneの場合。

|Pubの内容　　|評価　|備考|
|:-----------|:--:|:---|
|マイクから声|S  |1秒くらい遅れる|
|動画ニュース|S  |〃|
|音楽        |A+   |音質は(ry|

--

### まとめ
- さすがに音楽となると音質のしょぼさが気になる
- MacでもiOS7のiPhoneでも大差ない
  - FireFoxの方がなんか途切れる
- LANだろうがWANだろうが関係ない！
- WiFiでも4Gでも大差ない！！すごい！
  - ただ微妙に遅れてくることがある？
    - けど繋ぎ直せば直るしいいか

--

### おわりに
- 端末台数増えるとどうなる？
  - SocketServerのスペック上げればいける？
- サウンドプログラミング難しい
- WebWorkerすごい
- WebSocketもっとすごい

--

### WebSocketすごくない？
- 対応ブラウザも十分すぎる
- バイナリが送れるなら画像もcssもjsも
  - そういうアーキテクチャとか
  - 音は難しかったが画像はもっと楽そう
- 何か欠陥があるから？
  - もうみんなHTTP/2？
- 単に誰も冒険してないだけ？

--

### Links
- [leader22/audio-streaming-over-websocket](https://github.com/leader22/audio-streaming-over-websocket)
- [このスライド](http://leader22.github.io/slides/asows)

--

# Finish!

<link rel="stylesheet" href="./style.css">
<script src="../_static/mobile-controls.js"></script>

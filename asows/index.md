title: WebSocketでAudioStreamingしてみた
controls: false
--

# AudioStreaming over WebSocket
## at PixelGrid 開発合宿 2016春 in 八丈島
--

# 事の発端

--

### WebRTC界隈の技術を見ていて
- リアルタイムコミュニケーション用のAPI群
  - MediaStream API(getUserMedia)
  - RTC**3つほど
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
## [Publisher](http://localhost:8888/client/pub/) / [Subscriber](http://dev.lealog.net/client/sub/)

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
  - ScriptProcessorNode: 1ch
    - postMessage(PCM &lt;ArrayBuffer&gt;)
  - WebWorker
    - Socket.IO.emit('audio', payload)

--

### Socket.IO Server

```javascript
socket.on('audio', (buf) => {
  socket.broadcast.emit('audio', buf);
});
```

room機能とか作ってないから実用的ではない

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
- SDPまわりの煩雑な処理とかいらない
  - Web屋のスタックでなんとかなる
- 普通に聴ける
  - 遅延が思ったより無い
  - 5人くらいに流してもいける

--

### できないこと
- iOS側からの音の入力

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

PCMのデータに直接アクセスできるAudioNode

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
- 夢は広がる
  - audioタグから高音質ストリーミング
  - MediaRecorderで`webm`にして保存したり

--

### 実用的か
- 実装すれば
  - room機能で親を切り替えたり
  - 親側にリアクションする仕組み
- パフォーマンス
  - どこまでスケールするのか
  - 一定時間使うとパフォーマンス落ちるとか

--

### WebSocketすごくない？
- 3Gでも一旦張れればそこそこ
- 対応ブラウザも十分すぎる
- バイナリが送れるなら画像もcssもjsも
  - そういうアーキテクチャとか
- 何か欠陥があるから？
  - もうみんなHTTP/2？
- 単に誰も冒険してないだけ？

--

### Links
- [leader22/audio-streaming-over-websocket](https://github.com/leader22/audio-streaming-over-websocket)
- [このスライド](http://leader22.github.io/slides/asows)

--

# Finish!

<style>
.progress {
  z-index: 1;
}

ul {
  padding: 10px 0 10px 60px;
}

pre {
  background-color: #fff;
  padding: 2%;
}

.slide-content img {
  display: block;
  margin: 0 auto;
  max-width: 80%;
}
</style>
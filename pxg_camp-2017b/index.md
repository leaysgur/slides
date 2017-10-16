title: MediaStream to HttpLiveStreaming
controls: false
--

# <a>M</a>edia<a>S</a>tream<br>to<br><a>H</a>ttp<a>L</a>ive<a>S</a>treaming
## 2017/10/15-17 PixelGrid Inc. 開発合宿 in 柏たなか

--

### 事の発端
- iOS SafariにWebRTCがきた
  - `getUserMedia()`とかWebRTCでなんかやりたいな？
  - カメラで撮った内容を録画できたらよいのでは！
- WebRTCでPCに飛ばしてMediaRecorderでWebMにしよう
  - でも録画見るならHLSが良さそう
- よろしい、ならばMediaStream2HLSだ！

すっかり動画エンジニアになってしまった(˘ω˘ )

--

### いちおう前提知識
- `getUserMedia()`
  - 端末カメラやマイクからMediaStreamを取得できるAPI
- WebRTC
  - MediaStreamを相互に送ったりできるAPI群
  - つまりはP2P
- MediaRecorder
  - MediaStreamを録画しできるAPI
  - 動画ファイルにできる
- HLS
  - 動画配信の方式
  - キャッシュが効くので長時間のライブ配信などに適してる
  - マニフェストに細切れになった動画URLが書かれてる

ね？簡単でしょ？

--

### 構成
```
iOS Safari OR other browsers
      ↑      ↑
    WebRTC
      ↓      ↑
Chrome or Firefox -> MediaRecorder
      ↓
    fetch() w/ .webm
      ↓
Node.js -> ffmpeg -> .ts + .m3u8 = HLS
```

お手元のスマートフォンで撮った動画が、いい感じに後から見直せるフォーマットで保存される仕組み。

--

### できました
> https://github.com/leader22/ms2hls

- https://github.com/leader22/ms2hls/tree/master/ms2hls-server
- https://github.com/leader22/ms2hls/tree/master/ms2hls-client

monorepo風。

--

# Server

--

### ms2hls-server
- `/initialize/:liveId`
  - ディレクトリの用意
- `/chunks/:liveId`
  - `.webm`を受けて`.ts`へ
  - 内部では`ffmpeg`が頑張る
- `/finalize/:liveId`
  - 送られてきた`.webm`を数えて`.m3u8`を生成
  - HLSのマニフェストを手動で作る

CPUに余裕があれば、画質レベルをいくつか用意したりもできそう。今回は単一画質のみ。

--

### 学び: HLSは作れる

こういうマニフェストを手書きするだけ。

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:5
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:4.0,
http://localhost:9999/live/1e26162b-2435-41c0-8140-667bf08ff072/1.ts
#EXTINF:4.0,
http://localhost:9999/live/1e26162b-2435-41c0-8140-667bf08ff072/2.ts

...

#EXT-X-ENDLIST
```

仕様: https://tools.ietf.org/html/draft-pantos-http-live-streaming-23

--

### 学び: HLSは簡単だが奥深い

- 仕様に則って文字列を用意するだけ
- 妥当なコンテナ・コーデックの`.ts`ファイルならなんでも動く
- ただ`EXTINF`を適当にすると、上手く再生されなくなる・・？
  - HLS.jsでも上手く再生できなかった
  - Safariが強い

--

### 学び: fastifyはいいぞ
- Expressより速いと噂のNodeのサーバー
  - https://github.com/fastify/fastify
- だいたいのMiddlewareは揃ってる
  - `.webm`を`multipart`で受けるところにハマったくらい
- `async / await`標準対応でシュッとしてていい感じ

なんでもいいけど合宿の度にNodeでサーバー書いてる気がする・・。

--

### 学び: fluent-ffmpegもいいぞ
- ffmpegをNodeから使いやすくしたやつ
  - https://github.com/fluent-ffmpeg/node-fluent-ffmpeg

```js
ffmpeg()
  .input(inputPath)
  .videoCodec('libx264')
  .audioCodec('libfdk_aac')
  .format('mpegts')
  .output(outputPath)
  .on('error', err => { throw err; })
  .run();
```

ただし「Looking for a new maintainer」らしい・・・！

--

# Client

--

### ms2hls-client

- Recorder
  - MediaStreamを4秒ごとに`.webm`にしてサーバーへ
    - まさかのニッチな自作ライブラリがここでも・・
  - これをChromeかFirefoxで開く
- Reporter
  - RecorderにMediaStreamを送る
  - これをiOS Safariで開く
- Viewer
  - サーバーが生成したHLSのストリームを見れる
  - 別にこれで見なくてもいい（正直おまけ）

JSフレームワークとか使ってません。

--

### 学び: MediaRecorderがxxx

- WebMしか吐けない（2017/10/17時点）
  - コンストラクタに渡すオプションで指定はできる（仕様上）
  - Chromeはそのまま再生できる / Firefoxでは再生できない（吐けるのに）
- `#start(timeSlice)`の存在意義が不明
  - 指定した㍉秒単位でWebMを出力できるようになる
  - ただし、2つ目以降は不完全で再生できない`.webm`が出力される
- WebMはMatoroskaというコンテナのサブセット
  - 最初の`.webm`にだけ、ヘッダがついてる <- は？？？
  - もちろん不完全なメディアなので`.ts`に変換もできない

--

### 学び: MediaRecorderが本当にxxx

- 迫られる3択
  - 1 サーバーサイドで自前で`.webm`を結合する
  - 2 バイナリ解析してヘッダ部を抽出して使いまわす
  - 3 手動で`#start()` / `#stop()`を繰り返す
- 結局3にした
  - これだと完全な`.webm`ができる
  - 個人的には許容できるが、動画の切れ目がわかる
    - ダブルバッファでなんとか・・
- Chromeの実装がバグってるというダメ押し
  - http://lealog.hateblo.jp/entry/2017/10/16/144127

動画コンテナ・コーデックに関わるとろくなことない。

--

### 学び: その他

- ES Modulesは時期尚早
  - https://twitter.com/leader22/status/919454960189816833
  - Webpack最高！
  - だれかnpm兼cdnみたいなやつはよ
- SkyWay最高！
  - 今回書いたWebRTC関連のコードは10行未満

--

# 結論: 録画するならサーバーで

--

### Special thanks
- https://github.com/JosePedroDias/webcam2hls
  - これの焼き直しな面がある
- https://www.slideshare.net/mganeko/media-recorder-and-webm
  - 2015年に先を行く先輩芸人さすがです
- https://qiita.com/tomoyukilabs/items/57ba8a982ab372611669
  - WebMを解くのをやめる決断をさせてくれた偉人

--

# Thank you!

<style>
:root {
  --bg-color: #fafff8;
  --bar-color: #59ec47;
  --em-color: #3e984c;
}
</style>
<link rel="stylesheet" href="../public/base.css">
<link rel="stylesheet" href="../public/timer.css">
<script src="../public/timer.js"></script>
<script src="../public/mobile-controls.js"></script>

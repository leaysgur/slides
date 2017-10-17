title: MediaStream to HttpLiveStreaming
controls: false
--

# <a>M</a>edia<a>S</a>tream<br>to<br><a>H</a>ttp<a>L</a>ive<a>S</a>treaming
## 2017/10/15-17 PixelGrid Inc. 開発合宿 in 柏たなか

--

### 作ったもの
- MediaStreamを後からHLS形式で見れるようにする仕組み
  - ローカルのストリームでも
  - リモートのストリームでも
- サーバーサイドの実装と、それを利用するクライアント

お手元のPC・スマートフォンで撮った動画が、いい感じに後から見直せるフォーマットで保存される仕組み。

おそらくやろうと思えばHDとかでも撮れるし、別に音だけでもいけるので、ポッドキャストとかにも。（とりあえず45分は問題なく撮れた）

--

### 事の発端
- ついにiOS SafariにWebRTCがきた
  - `getUserMedia()`とかWebRTCでなんかやりたいな？
  - カメラで撮った内容を録画できたらよいのでは！
- WebRTCでPCに飛ばしてMediaRecorderで録画しよう
  - でも録画見るならHLSが良さそう
- ならばMediaStream2HLSだ！

フロントエンドとは(˘ω˘ )

--

### いちおう前提知識
- `getUserMedia()`
  - 端末カメラやマイクからMediaStreamを取得できるAPI
- WebRTC
  - MediaStreamをブラウザ間で相互に送ったりできるAPI群
  - ちょろっとコードを書くだけでいい
- MediaRecorder
  - MediaStreamを録画できるAPI
  - Blobを保存すればそのまま動画ファイルにできる
- HLS
  - 動画配信の方式
  - キャッシュが効くので長時間のライブ配信などに適してる
  - マニフェストに細切れになった動画URLが書かれてて、それを読み込む

ね？簡単でしょ？

--

### できました
> https://github.com/leader22/ms2hls

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

- クライアント: https://github.com/leader22/ms2hls/tree/master/ms2hls-server
- サーバー: https://github.com/leader22/ms2hls/tree/master/ms2hls-client

なんちゃってmonorepo風。

--

# Server

--

### ms2hls-server

3つのエンドポイントがあるだけ。

- `/api/initialize/:liveId`
  - 配信用ディレクトリの用意
- `/api/chunks/:liveId`
  - `.webm`を受けて`.ts`へトランスコード
  - 内部では`ffmpeg`が頑張ってる
- `/api/finalize/:liveId`
  - HLSのマニフェスト`.m3u8`を手動で作る
  - 用意しておいた`.ts`を数える

レベル（画質）をいくつか用意したり、リアルタイムで見れるようにもできそう。今回は雑に単一画質でアーカイブのみ。

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
  - 動画長がズレてうまくストリーミングできない風な挙動
- [未解決] HLS.jsで上手く再生できない
  - マニフェストも動画も問題ないはずだが・・
  - Safariだと問題なく動く
  - なんのためにHLSにしたの感

Safari最高！

--

### 学び: fastifyはいいぞ
- Expressより速いと噂のNodeのサーバー
  - https://github.com/fastify/fastify
- だいたいのMiddlewareは揃ってる
  - `.webm`を`multipart`で受けるところにハマったくらい
- `async / await`も標準対応でシュッとしてていい感じ

なんでもいいけど合宿の度にNodeでサーバー書いてる気がする。

--

### 学び: fluent-ffmpegもいいぞ
- ffmpegをNodeから使いやすくしたやつ
  - https://github.com/fluent-ffmpeg/node-fluent-ffmpeg

```js
// こういう感じで
ffmpeg()
  .input(inputPath)
  .videoCodec('libx264')
  .audioCodec('libfdk_aac')
  .audioChannels(2)
  .format('mpegts')
  .outputOptions([
    '-mpegts_copyts 1',
  ])
  .output(outputPath)
  .on('error', err => {})
  .on('end', () => {})
  .run();
```

ただし「Looking for a new maintainer」らしい・・・！

--

### 学び: Error: read ECONNRESET
- HLSのマニフェスト用に`ffprobe`でまとめて`duration`を取得する処理で出た
  - 他のライブラリでも、自分で`execFile`してもダメ
  - コールバックの`err`は常に`null`なのに出る
- ただ本体側の動作には支障なし
  - ただ気持ち悪いのでなおしたくて半日くらい潰した
- なんと`NODE_ENV=production`にするとエラーが見えなくなる！
  - ログに吐かれないだけなのか、消えるのか謎
- 処理タイミングを一括処理から逐次処理に変えたら出なくなった

お手上げ＼(^o^)／

--

# Client

--

### ms2hls-client

こちらも3つの構成要素。

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

JSフレームワークとかは使ってません！

--

### 学び: MediaRecorderがxxx

- WebMしか吐けない（2017/10/17時点）
  - `mimeType`をコンストラクタに渡せる（仕様上）
  - Chromeはそのまま再生できる / Firefoxでは再生できない（吐けるのに）
- `#start(timeSlice)`の存在意義が不明
  - 指定した㍉秒単位でWebMを出力できるようになる
  - ただし、2つ目以降は「不完全で再生できない」`.webm`が出力される
- WebMはMatoroskaというコンテナのサブセット
  - 最初の`.webm`にだけ、ヘッダがついてる
  - もちろん不完全なメディアなので`.ts`に変換もできない

どういうユースケースを想定した結果この実装になってるのか・・。

--

### 学び: MediaRecorderが本当にxxx

- 迫られる3択
  - 1: サーバーサイドで自前で`.webm`を結合する
    - 動画が長くなればなるほど不利になる（時間・CPU）
    - 巨大ファイルをPOST・トランスコードとか嫌な予感しかしない
  - 2: バイナリ解析してヘッダ部を抽出して使いまわす
    - バイナリ解析とか合宿でやるもんじゃない！
  - 3: 手動で`#start()` / `#stop()`を繰り返す
- 結局3にした
  - これだと完全な`.webm`ができる
  - 個人的には許容できるが、動画の切れ目がわかる
- そしてChromeの実装がバグってるというダメ押し
  - http://lealog.hateblo.jp/entry/2017/10/16/144127

動画コンテナ・コーデックに関わると時間を無限に持っていかれる・・。

--

### 学び: その他

- ES Modulesは時期尚早
  - https://twitter.com/leader22/status/919454960189816833
  - Webpack最高！
  - だれかnpm兼cdnみたいなやつはよ
- SkyWay最高！
  - 今回書いたWebRTC関連のコードは10行未満

--

# 結論: 録画はサーバーでやれ

--

### Special thanks
- https://github.com/JosePedroDias/webcam2hls
  - これの焼き直しな面がある
  - まさかの2014年製！
- https://www.slideshare.net/mganeko/media-recorder-and-webm
  - 2015年に先を行ってた先輩<s>芸人</s>さすがです
  - ただ2017年でもこの分野にあまり進捗はないようです
- https://qiita.com/tomoyukilabs/items/57ba8a982ab372611669
  - これを見てWebM解くのをやめる決断をしました

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

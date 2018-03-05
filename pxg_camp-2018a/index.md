title: 動画をトリミングするアプリをElectronで作った
controls: false
--

# <a>動画をトリミングするアプリ</a>を<br>Electronで作った
## 2017/03/04-06 PixelGrid Inc. 開発合宿 in 湯河原

--

# モチベーション

--

### 全部イカのせい

- 普段のプレイ動画はYouTubeにUPしてる
  - けどUPしてない箇所も結構ある
- この数十秒を切り出してTwitterにUPしたいと思うことはあるが、編集が面倒
- YouTubeにUPする用のやつ（録画アプリ付属）だと、元動画の開き直しが面倒


なんとかしたい！

--

### 既存のアプリありそう

あるにはあるけど、

- Twitterの動画投稿フォーマットに沿ってない
  - https://help.twitter.com/ja/using-twitter/twitter-videos
- 余計な機能たくさんついてる
- 画質がいまいち（良くも悪くも）
  - そして調整できない
- 謎のバナー付けられる

微妙。

--

### CLIでやれば

やれんことはないけど、

- 巨大な動画（2時間で30GBとか）なので、GUIじゃないと辛い
- `Preview.app`でひらいて、切り取り秒数をメモって`ffmpeg`で・・
  - いやなにこれ面倒くさい

これはもう自作するしかない・・！

--

# というわけで、作りました
## https://github.com/leader22/movie-slicer

--

# DEMO

--

### 作ったもの

- 動画をトリミングして書き出せるElectronアプリ
  - `ffmpeg`に渡す引数をGUIで編集できる
- 書き出しフォーマットはTwitterがターゲット
  - ただデフォルトなだけで、変更もできる

--

# 推しポイントの紹介

--

### タイムライン: サムネイル

> https://github.com/leader22/movie-slicer/blob/master/src/renderer/component/selector/thumb.jsx

- 動画の様子が見やすい
  - ざっくり切り取り位置を探すのに最高
- そのぶん実装はダルい
  - 動画長と画面サイズから、1サムネイルあたりの秒数を割り出す
  - その秒数で、サムネイルが何枚必要かを割り出す
  - この2つをかけ合わせて、`video.currentTime`に指定
  - `canplay`イベントを待って、非同期で`video`を`canvas`に転写して表示

--

### タイムライン: 拡大と縮小

> https://github.com/leader22/movie-slicer/blob/master/src/renderer/store/ui.js

- 短い動画・長い動画、どちらがきても編集しやすいように
  - 5分の動画から3時間の動画までいい感じ
- 「1秒を何pxとして扱うか」を、倍率とあわせて管理する
  - 全ての幅は、この値をかけ合わせて算出する

--

### タイムライン: 選択する部分

> https://github.com/leader22/movie-slicer/blob/master/src/renderer/component/selector/main.jsx

- 範囲選択がしやすい
  - ドラッグで移動可能
  - フチを掴んでリサイズ可能
  - `bokuweb/react-rnd`最高
    - ただしイベントを`stopPropagation()`させてくれない
- 選択範囲を繰り返し再生するので、出来上がりを想像しやすい

--

### 動画プレーヤー

> https://github.com/leader22/movie-slicer/blob/master/src/renderer/component/video.jsx

- 今まで何回作ってきたことか
  - キーボードから再生・一時停止の切り替え
  - Mute/Unmuteの切り替え
  - コンポーネント外に現在の再生秒数を出す

--

### 書き出し結果の表示

> https://github.com/leader22/movie-slicer/blob/master/src/renderer/component/progress.jsx

- Twitterの動画投稿フォーマットの面倒なところ
  - 40FPS以下
  - 2分20秒以内
  - etc...
- 書き出し後に、どういうフォーマットになったかを表示するようにした

--

### それっぽいデザインとそれっぽいUX

- 黒を基調とした高級感のある（ｒｙ
  - 温かみのある手書きCSS
- アイコンは、Material Icons
  - 必要なものだけSVGでローカルに
- アプリ感のあるUX
  - 動画をドロップして編集
  - 切り出し後は`Finder`で表示

--

# 学び

--

### `H.264`を`ffmpeg`で扱う
- WebRTC界隈でもよく見るコーデック
- 再エンコなしの切り出しは高速
  - 3時間から数十秒切り出すのも一瞬でできる
- `preset`を調整すれば、エンコありでもそれなりで終わる
  - 現状`ultrafast`が最も速度重視だが、もっと攻めてほしい

--

### Electronでの開発
- オレオレボイラープレートは滅べ
  - `sindresorhus/electron-reloader`
  - `webpack`(`target: electron-renderer`)
- この2つだけで十分

--

### なんか

--

# 付録

--

### 今回の作業の内訳

- 合宿前
  - 各種検証
    - そもそも巨大な動画をロードできるかとか
    - Electronから`ffmpeg`どう呼ぶか
    - `ffmpeg`の引数・処理速度の確認
  - 仕様Fix
- 1日目: 見た目以外と本筋の機能は完成
  - 基本的な書き出し機能
  - タイムラインの使い勝手向上
- 2日目: ひたすら完成度を高める
  - スタイル・アイコン反映
  - 書き出し設定
  - アプリ化
  - バグ修正
  - プレゼン資料ざっくり
- 3日目: のんびり暮らす
  - 簡単な機能追加・調整
  - プレゼン資料の微調整

--

# Thank you!

<style>
:root {
  --bg-color: #fffcfe;
  --bar-color: #ec38b4;
  --em-color: #e84fdc;
}
</style>
<link rel="stylesheet" href="../public/base.css">
<link rel="stylesheet" href="../public/timer.css">
<script src="../public/timer.js"></script>
<script src="../public/mobile-controls.js"></script>

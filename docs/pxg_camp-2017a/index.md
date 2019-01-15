title: （今度こそ）VPSにあるmp3をストリーミングする仕組みを作った
controls: false
--

# （今度こそ）<br>VPSにあるmp3をストリーミングする仕組みを作った
## 2017/03/05-07 PixelGrid Inc. 開発合宿 in 湯河原

--

# 前回までのあらすじ

--

### 時を遡ること2015年の秋

> https://github.com/leader22/mmss

VPSに配置してあるmp3を使って、iTunesクローンを作ろうとした男がいた・・。

--

### しかし

![ダメでした](./img/last.png)

--

### 敗因

- 必要なのはmp3のツリーではなく、パースして得たid3tagのツリー
  - id3tagも複数のバージョンが存在する
    - さらに文字コードも混在する
- 単純に難易度が高い
  - バイナリ解析 x OSレベルでのファイルハンドル x 文字コード...

--

# しかし今度こそ

--

### これで勝てる！

![きたこれ](./img/export.png)

--

# というわけで

--

# （今度こそ）<br>VPSにあるmp3をストリーミングする仕組みを作った

--

### 成果物

- https://music.lealog.net/
- ソースコード
  - https://github.com/leader22/mmss-client
  - https://github.com/leader22/mmss-server
  - https://github.com/leader22/mmss-cli

--

### How to use

- `CLI`にiTunesから書き出したプレイリストを食わせる
- 構造化したJSONを吐き出すので`CLIENT`でそれを使って画面を構成
- `SERVER`にリクエストすれば音源が返る

--

# DEMO
## https://music.lealog.net/

--

### 機能
- 検索
- ログイン・ログアウト
- アーティスト・アルバム・シングル再生
- 自動曲送り
- 最近流行りのローディングUI
- 次の曲のプリフェッチ <- 重要
- 通知

--

### やったこと（cli/server）
- Node.jsでCLI
  - `yargs`で引数をこねてファイルを吐くだけ
- Node.jsでストリーミングサーバー
  - `ReadableStream`を返すだけ
  - ログイン機能もあるよ
  - `pm2`でデーモンに

--

### やったこと（client）
- React x MobX
- Web Notifications
- <s>ServiceWorker</s>
- Flow
- PostCSS
- Webpack

--

# 知見

--

### ServiceWorkerが変な動きする

```js
self.addEventListener('fetch', ev => {
  if (ev.request.url.match(/\api\/track/) === false) { return; }
  ev.respondWith(
    caches.open('v1').then(cache => {
      return cache.match(ev.request).then(res => {
        if (res) { return res; }

        // net::ERR_FAILED!
        fetch(ev.request.clone())
          // but call then() and cache something...
          .then(response => {
            cache.put(ev.request, response.clone());
            return response;
          })
          // never comes
          .catch(err => { err; debugger; });
      });
    })
  );
});
```

そもそも数MBの音源をキャッシュすると、すぐに`DOMException: Quota exceeded.`に・・。

--

### PostCSS CLIが微妙

```sh
# v2
postcss -c ./.postcssrc.json

# v3
postcss ./path/to/src.css -c ./postcss.config.js -o ./path/to/dist.css
```

設定ファイルに`from`/`to`あるのに見てくれない！

Issue立てたけど仕様らしい・・
https://github.com/postcss/postcss-cli/issues/93

あと`watch`モードもバグってない・・・？

--

### Flowのプロセスがどっかいく

- 古い型定義を抱えたままゾンビプロセスに・・
  - どれだけ新しい修正しても何も起きない
  - そしてある時いきなり怒り出す
- 再現手順は不明

--

### WebpackのUglifyPluginが惜しい

- Babelを通してないES6のコードを読めない
- ので、`webpack -p`する = `babel`に依存することになる

--

### MobXを使ったアーキテクチャ

続きはブログで！

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

title: 俺たちは雰囲気でgetUserMedia()をやっている
controls: false
--

# 俺たちは雰囲気で<br><a>getUserMedia()</a>を<br>やっている

## &nbsp;
## 2017/08/25 WebRTC Meetup Tokyo #16

--

### はじめまして

- Yuji Sugiura / [@leader22](https://twitter.com/leader22)
- フロントエンド・エンジニア at PixelGrid Inc.
  - 最近はWebRTC（ついに）、普段はReactとかMobXとか
- ブログもよろしく
  - [console.lealog();](http://lealog.hateblo.jp/)
  - 今日の発表の元ネタ記事もあります

![leader22](../public/img/doseisan.jpg)

--

# 本日のテーマ<br><a>getUserMedia()</a>

--

# みなさん！<br><a>getUserMedia()</a><br>してますか？

--

### まずはおさらい

> [10.2 MediaDevices Interface Extensions | Media Capture and Streams](https://w3c.github.io/mediacapture-main/#h-mediadevices-interface-extensions)

```swift
partial interface MediaDevices {
  Promise<MediaStream>  getUserMedia(optional MediaStreamConstraints constraints);
};
```

・使い方

```js
navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {})
  .catch(err => {});
```

`Promise`が返り、resolveされると`MediaStream`が取得できます。

--

### こういうのはもう忘れてください

```js
// navigatorに生えてるし、コールバックベースである
navigator.getUserMedia(constraints, successCallback, errorCallback);

// なんか変な接頭辞ついてる
navigator.mozGetUserMedia(constraints, successCallback, errorCallback);
navigator.webkitGetUserMedia(constraints, successCallback, errorCallback);
```

2017年になっても謎の圧力によって古いブラウザを切れない人は、がんばってください・・。

--

### 本日の主役
```js
// コレ
const constraints = { video: true };

navigator.mediaDevices.getUserMedia(constraints); // <- コレ！！
```

`getUserMedia()`には、どういう`MediaStream`が欲しいかを決めるオプションを渡すことができます。

オプションというより、Constraints: 制約を課すイメージ。

--

### MediaStreamConstraints

> [10.3 MediaStreamConstraints | Media Capture and Streams](https://w3c.github.io/mediacapture-main/#h-mediastreamconstraints)

```swift
dictionary MediaStreamConstraints {
  (boolean or MediaTrackConstraints) video = false;
  (boolean or MediaTrackConstraints) audio = false;
};
```

`audio`と`video`それぞれ、どうしたいか決められる。

```js
// カメラもマイクもくださいな
navigator.mediaDevices.getUserMedia({ video: true, audio: true });

// マイクのストリームだけくださいな
navigator.mediaDevices.getUserMedia({ audio: true });
```

`false`または未定義の場合は、取得しない。

--

### 続・MediaStreamConstraints
```swift
dictionary MediaStreamConstraints {
  (boolean or MediaTrackConstraints) video = false;
  (boolean or MediaTrackConstraints) audio = false;
};
```

実はコレ・・・、`bool`以外にも指定できます！！

指定してるとこ、見たことありますよね？どういう指定ができるのか把握してますよね？！

--

### よく見る例 1

```js
{
  video: {
    width: 1280,
    height: 720,
    frameRate: 15,
  },
}
```

これはわかる！

--

### よく見る例 2

```js
{
  video: {
    width: 1280,
    height: 720,
    aspectRatio: 1.5,
  },
}
```

わか・・ると思ったけど、この場合のアスペクト比はどうなる・・？

--

### よく見る例 2

```js
{
  video: {
    width: { min: 320, ideal: 1280, max: 1920 },
    height: { min: 240, ideal: 720, max: 1080 },
    frameRate: 30,
    facingMode: { exact: 'environment' },
  }
}
```

コレもなんとなくわかる気はするけど、謎のキーワードがいっぱいある・・うっ・・。

--

### よく見る例 3

```js
{
  audio: {
    advanced: [{
      echoCancellation: {
        exact: true
      }
    }, {
      googEchoCancellation: {
        exact: true
      }
    }, {
      googExperimentalEchoCancellation: {
        exact: true
      }
    }, {
      googNoiseSuppression: {
        exact: true
      }
    }, {
      googExperimentalNoiseSuppression: {
        exact: true
      }
    }, {
      googAutoGainControl: {
        exact: true
      }
    }, {
      googExperimentalAutoGainControl: {
        exact: true
      }
    }, {
      googHighpassFilter: {
        exact: true
      }
    }, {
      googTypingNoiseDetection: {
        exact: true
      }
    }, {
      googAudioMirroring: {
        exact: false
      }
    }, {
      deviceId: {
        exact: ["default"]
      }
    }]
  },
}
```

全然わからない（^ω^#）

--

# 俺たちは雰囲気で<br><a>getUserMedia()</a><br>をやっている！

--

# 今日はコレを解説します！

--

### MediaTrackConstraints

> [4.3.6 MediaTrackConstraints | Media Capture and Streams](https://w3c.github.io/mediacapture-main/#h-media-track-constraints)

```swift
dictionary MediaTrackConstraints : MediaTrackConstraintSet {
  sequence<MediaTrackConstraintSet> advanced;
};
```
```swift
dictionary MediaTrackConstraintSet {
  ConstrainLong      width;
  ConstrainLong      height;
  ConstrainDouble    aspectRatio;
  ConstrainDouble    frameRate;
  ConstrainDOMString facingMode;
  ConstrainDouble    volume;
  ConstrainLong      sampleRate;
  ConstrainLong      sampleSize;
  ConstrainBoolean   echoCancellation;
  ConstrainBoolean   autoGainControl;
  ConstrainBoolean   noiseSuppression;
  ConstrainDouble    latency;
  ConstrainLong      channelCount;
  ConstrainDOMString deviceId;
  ConstrainDOMString groupId;
};
```

これが`video`と`audio`の直下に指定できるものたち。それに加えて、`advanced`にも指定できる。

さっきの`googXxxx`はChromeが勝手にやってる独自プロパティで、仕様書にはない。

--

### min / max / exact

「絶対これに制限したいです！」という指定。

```js
{
  video: {
    facingMode: { exact: 'environment' }
  }
}
```

リアカメラのないMacbook Proとかでコレやると、rejectされます。

```js
{
  video: {
    width: { min: 1920, },
  }
}
```

Macbook ProのFaceカメラは720pなので、`width: 1280`以上を指定するとrejectされます。

なのでとりあえず付けておくものではない！

--

### ideal

「なにも制限せずブラウザに委ねます」という指定。

```js
{
  video: {
    width: { ideal: 1920, },
  }
}
```

実はこれ、値を直指定するのと同じ。

```js
{
  video: {
    width: 1920,
  }
}
```

普段から何気なくやってるやつですね・・！

--

### advanced

「できたら制限したいんですよねー、無理なら別に良いんですけど」という指定。

```js
{
  video: {
    width: { min: 640, ideal: 1280 },
    height: { min: 480, ideal: 720 },

    // 値として使うキーワードではない
    advanced: [
      { width: 1920, height: 1280 },
      { aspectRatio: 1.3333333333 },
    ]
  },
}
```

最低でも640x480以上の解像度がいいです！

「でもできたら解像度は1920x1280がいいんですよねー。
それがダメならアス比は4:3のやつにしてもらえます？」

もしそれもダメならもう1280x720に近いやつでいいです・・。

--

### 続・advanced

```js
{
  video: {
    advanced: [
      // exactと同じ
      { aspectRatio: 1.3333333333 },
      // こっちはフォールバック
      { aspectRatio: 1 },

      // widthだけOKでもheightがNGなら両方NGになる
      { width: 1920, height: 1280 },
    ]
  },
}
```

- リスト内での値の直指定は、`exact`と同じ意味
- リストの先頭から順にチェックされるので、同じ指定をフォールバックとして使える
- リストアイテムごとのチェックになる

--

### まとめ

処理の流れ。

- min / max / exact
  - 問題ないなら次へ OR reject
- advanced
  - リストの上から順に
  - 問題ないなら有効化して次へ
- ideal（値の直指定）
  - 指定ないもの含めブラウザがよしなに
- resolve

> [11. Constrainable Pattern | Media Capture and Streams](https://w3c.github.io/mediacapture-main/#h-constrainable-interface)

大事なことはすべてこの章から教わりました。

--

### 択一の答えにならないとき

```js
{
  video: {
    width: 1280,
    height: 720,
    aspectRatio: 1.5,
  },
}
```

`width / height`は`1.777`なので、3/3は満たせない。

この場合の組合せは3C2の3通りだが、どれになるかはブラウザがよしなにする。

手元のChromeは`width` x `height`になりました。

--

# 雰囲気ではなく<br><a>getUserMedia()</a><br>完全に理解しましたね？

--

# そんな皆さんに<br>悲しいお知らせです

--

### ほぼChromeでしか動きません

```js
navigator.mediaDevices.getUserMedia({ video: { width: 100 } });
```

サイズ指定をしてない`video`に、これで取得したストリームを表示した際、どうなるか。（いずれもCanary, Nightly, TPなど最新のバージョン）

- Chrome: 問題なし
- Firefox: エラーにはならない（resolve）が指定は無視
- Safari: エラーになる（reject）
- Edge: エラーにはならない（resolve）が指定は無視

`aspectRatio`だとEdgeで動くので、プロパティにも依る・・？

--

### いちおう仕様書的には

```js
navigator.mediaDevices.getSupportedConstraints();
```

これで返るオブジェクトの当該プロパティが`true`なら、サポートしてることになる。

ただしさっきのSafari TPの`getSupportedConstraints()`氏は`width: true`などと供述しており・・。

やはり・・俺たちは・・。

--

# 俺たちは雰囲気で<br><a>getUserMedia()</a><br>をやっている！

--

# Thanks！
## （まだ時間ある ? <a href="?#29">次へ</a> : <a href="?#34">末尾へ</a>）

--

# 謎の制約<br>googXxxx

--

### ナニコレ

```js
// Google ハングアウトより
{
  audio: {
    advanced: [
      {
        googEchoCancellation: {
          exact: true
        }
      },
      {
        googExperimentalEchoCancellation: {
          exact: true
        }
      },
      {
        googAutoGainControl: {
          exact: true
        }
      },
      {
        googExperimentalAutoGainControl: {
          exact: true
        }
      },
      {
        googNoiseSuppression: {
          exact: true
        }
      },
      {
        googHighpassFilter: {
          exact: true
        }
      },
      {
        googAudioMirroring: {
          exact: false
        }
      },
      {
        googExperimentalNoiseSuppression: {
          exact: true
        }
      }
    ]
  }
}
```

`chrome://webrtc-internals`で色んなサービスを探すと色々見つかる。

--

### Chromeでだけ有効っぽい

> [MediaConstraintsImpl.cpp - Code Search](https://cs.chromium.org/chromium/src/third_party/WebKit/Source/modules/mediastream/MediaConstraintsImpl.cpp)

Chromiumのコードサーチでのみ色々見つかる。

- enableDtlsSrtp
- enableRtpDataChannels
- googCpuOveruseDetection
- googCpuOveruseEncodeUsage
- googCpuUnderuseThreshold
- googCpuOveruseThreshold
- googScreencastMinBitrate
- googHighStartBitrate
- googPayloadPadding
- googNoiseReduction
- etc..

`chrome://webrtc-internals`により、`video`だけでもこれだけの発掘に成功・・・！

--

### Chromeでだけ有効っぽい・・が

それらしいプロパティは山ほど見つかるけど、

> This interface is being deprecated in Chrome, and may be removed from WebRTC too.

とか書いてあるファイルもありよくわからん。（誰かChromiumのコードの追い方教えてください・・）

ただまぁ実際に動いてるから各サービスも使ってるんやろうけど・・。

--

### 我々はどうするべきか

触らぬ神に祟りなし！ <- おすすめ

or

自己責任で使う

- どうしても困ってることがあり
- Chromeだけでよくてこれで解決できそうなら
- いつ変わっても消えても泣かないしいつ変なバグを踏んでも泣かないし動かなくても泣かない
- そんな覚悟を持って

--

### Thank you!

- [このスライド](https://leader22.github.io/slides/webrtc_meetup-16)
- 仕様書: [Media Capture and Streams](https://w3c.github.io/mediacapture-main/#dom-constraindomstringparameters-ideal)
- 元ネタのブログ記事: [getUserMedia()で指定できるMediaTrackConstraintsのよもやま - console.lealog();](http://lealog.hateblo.jp/entry/2017/08/21/155211)

<style>
:root {
  --bg-color: #f9fbff;
  --bar-color: #6f89d8;
  --em-color: #5bbbec;
}
</style>
<link rel="stylesheet" href="../public/base.css">
<link rel="stylesheet" href="../public/timer.css">
<script src="../public/timer.js"></script>
<script src="../public/mobile-controls.js"></script>

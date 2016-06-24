title: 雛形スライド
controls: false
--

# スライドの雛形

## &nbsp;
## XXXX/XX/XX XXXXXXXXXXX

--

### はじめまして

- Yuji Sugiura / [@leader22](https://twitter.com/leader22)
- フロントエンド・エンジニア at PixelGrid Inc.

![leader22](./img/doseisan.jpg)

--

### Code

```javascript
const foo = 1;
```

--

# Thank you!

<script>
// 時間管理するの面倒なので経過時間をこっそり出す
(function(global) {
  const timer = document.createElement('div');
  timer.textContent = '0';
  timer.id = 'timer';
  document.body.appendChild(timer); 

  setInterval(function() {
    const now = timer.textContent|0;
    timer.textContent = '' + (now + 1);
  }, 1000 * 1);
}(this));

// モバイルでcontrolsない場合に詰むので
(function(global) {
  const isMobile = 'ontouchstart' in global;
  if (isMobile === false) return;
  
  document.body.addEventListener('click', (ev) => {
    const isRight = (global.innerWidth / 2) < ev.clientX;
    const dir = isRight ? 1 : -1;
    global.navigate(dir);
  }, false);
}(this));
</script>

<style>
:root {
  --bg-color: #eee;
  --bar-color: #274a78;
  --em-color: #0094c8;
}

#timer {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;
  color: inherit;
  font-size: 10%;
  padding: 5px;
}

.progress {
  z-index: 1;
}

.progress-bar {
  background-color: var(--bar-color);
}

a {
  color: var(--em-color);!important;
}

h1 {
  font-size: 220%;
}

h3 {
  border-color: var(--bar-color);
}

pre {
  padding: 2%;
  background-color: #fff;
}

ul {
  padding: 10px 0 10px 60px;
}

.slide {
  background-color: var(--bg-color);
}

.slide-content {
  overflow: scroll;
}

.slide-content img {
  display: block;
  margin: 0 auto;
  max-width: 75%;
}
</style>
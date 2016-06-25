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

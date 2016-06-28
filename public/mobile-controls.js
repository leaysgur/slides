// モバイルでcontrolsない場合に詰むので
(function(global) {
  var isMobile = 'ontouchstart' in global;
  if (isMobile === false) return;

  document.body.addEventListener('click', function(ev) {
    var isRight = (global.innerWidth / 2) < ev.clientX;
    var dir = isRight ? 1 : -1;
    global.navigate(dir);
  }, false);
}(this));

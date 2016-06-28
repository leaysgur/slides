// モバイルでcontrolsない場合に詰むので
(function(global) {
  var isMobile = 'ontouchstart' in global;
  if (isMobile === false) return;

  var $slide = [].slice.call(document.querySelectorAll('.slide'));
  $slide.forEach(function(el) {
    el.addEventListener('click', function(ev) {
      var isRight = (global.innerWidth / 2) < ev.clientX;
      global.navigate(isRight ? 1 : -1);
    }, false);
  });
}(this));

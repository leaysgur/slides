// 時間管理するの面倒なので経過時間をこっそり出す
(function(global) {
  var timer = document.createElement('div');
  timer.textContent = '0';
  timer.id = 'timer';
  document.body.appendChild(timer);

  setInterval(function() {
    var now = timer.textContent|0;
    timer.textContent = '' + (now + 1);
  }, 1000 * 1);
}(this));

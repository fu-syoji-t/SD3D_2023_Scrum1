function adjustImageSize() {
    var image = document.getElementById('fullscreenImage');
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    // 画像のサイズをウィンドウサイズに合わせて変更
    image.style.width = windowWidth + 'px';
    image.style.height = windowHeight + 'px';
  }

  // ウィンドウのリサイズ時に実行する
  window.addEventListener('resize', adjustImageSize);

  // 初回実行
  adjustImageSize();
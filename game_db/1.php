<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>タイトル画面</title>
  </head>
  <style>
    body {
        background: url(351_0.png) center center / cover no-repeat fixed;
    }
    .image-center {
        text-align: center;
    }
  </style>
  <body>
    <div class="image-center">
        <img src="もんすたーフレンズ.png" alt="タイトル名画像" width="800vw">
    </div>
    <div id="content">
        <font size="7">Tap to Start</font>
    </div>
    
    <script>
        // body要素をクリックしたときにページ遷移する関数
        function navigateToNewPage() {
            // ここに遷移先のURLを指定します
            window.location.href = '2.html';
        }
        // body要素にクリックイベントを設定
        document.body.addEventListener('click', navigateToNewPage);
    </script>
    </div>
  </body>
</html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>タイトル画面</title>
  </head>
  <style>
    body {
        background: url(../開発素材/background/351_0.png) center center / cover no-repeat fixed;
    }
    .image-center {
        text-align: center;
    }
  </style>
  <body>
    <div class="image-center">
        <img src="../開発素材/title/もんすたーフレンズ.png" alt="タイトル名画像" width="800vw">
    </div>
    <div>
      <form action="start.php" method="post">
        <input type="button" value="はじめから">
      </form>
    </div>
    <div>
      <form action="restart.php"method="post">
        <input type="button" value="つづきから">
      </form>
    </div>
  </body>
</html>
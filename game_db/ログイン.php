<?php 
session_start();
?>
<!DOCTYPE html>
<html>

<head>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
<title>モンスターフレンズ | ログイン</title>
</head>
<body>
<h2>ユーザーログイン</h2>
<form action="index2.php"method="post">
<!-- メールアドレス -->
<input type="text" name="mail" required placeholder="メールアドレス"><br>
<!-- パスワード -->
<input type="password" name="password" required placeholder="パスワード"><br>
<!-- 名前 -->
<input type="text" name="name" required placeholder="名前"><br>
<button type="submit"class="login"style="background-color:#008080;"href="index2.php">ログイン</button>
</form>
<a class = "new" href="index2.php">新規登録</a>
</body>
</html>
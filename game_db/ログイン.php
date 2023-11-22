<?php 
session_start();
?>
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Script-Type" content="text/javascript">
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<link rel="stylesheet" href="style.css">
<link href="login.css" rel="stylesheet" type="text/css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css">
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
<title>ログイン</title>
</head>
<body>
<h2>ユーザーログイン</h2>
<body style="background-image: url('background/352_1.png');">
<form action="index2.php"method="post">
<!-- メールアドレス -->
<div class="magin30">
<input type="text" name="mail" required placeholder="メールアドレス"style="border-width:3px;"><br>
</div>
<!-- パスワード -->
<div class="magin30">
<input type="password" name="password" required placeholder="パスワード"style="border-width:3px;"><br>
<?php
     if((isset($_SESSION['error']))){
    echo '<div style="color: red; text-align: center;">'.$_SESSION['error'].'</div>';
    unset($_SESSION['error']);
        }
?>
</div>
<button type="submit"class="login"style="background-color:#008080;"href="index2.php">ログイン</button>
</form>
<a class = "new" href="index2.php">新規登録</a>

</body>
</html>

<?php
session_start();
?>
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Script-Type" content="text/javascript">
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<link href="login2.css" rel="stylesheet" type="text/css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css">
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
<form method="POST"action="login.php">
<title>ログイン</title>
</head>
<body>
<div class="login-wrap">
  <div class="login-html">
    <input id="tab-1" type="radio" name="tab" class="sign-in" checked><label for="tab-1" class="tab">Sign In</label>
    <input id="tab-2" type="radio" name="tab" class="sign-up"><label for="tab-2" class="tab">Sign Up</label>
    <div class="login-form">
      <div class="sign-in-htm">
        <div class="group">
          <label for="user" class="label">Email address</label>
          <input id="user" type="text" class="input" name="mail" required>
        </div>
        <!-- パスワード -->
        <div class="group">
          <label for="pass" class="label">Password</label>
          <input id="pass" type="password" class="input" name="password" data-type="password" required>
        </div>
        <div>　</div>
        <div>　</div>
        <h4><font color="red">
        <?php
        if (isset($_GET['error'])) {
          echo '<div class="error-message" >'. $_GET['error'] . '</div>';
      }
        ?>
        </font></h4>
        <div class="hr"></div>
        <div class="group">
        <input type="submit" class="button" value="Sign In">
        </div>
</form>
        
<form method="POST"action="register.php">
<title>新規登録</title>
      </div>
      <div class="sign-up-htm">
        <div class="group">
          <label for="user" class="label">Username</label>
          <input id="user" type="text" class="input" name = "user">
        </div>
        <div class="group">
          <label for="pass" class="label">Password</label>
          <input id="pass" type="password" class="input" data-type="password" name = "pass">
        </div>
        <div class="group">
          <label for="pass" class="label">Repeat Password</label>
          <input id="pass" type="password" class="input" data-type="password" name = "pass">
        </div>
        <div class="group">
          <label for="mail" class="label">Email Address</label>
          <input id="mail" type="text" class="input" name = "mail">
        </div>
        <div class="hr"></div>
        <div class="group">
          <input type="submit" class="button" value="Sign Up">
        </div>
        <div class="foot-lnk">
          <label for="tab-1">Already Member?</a>
</form>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
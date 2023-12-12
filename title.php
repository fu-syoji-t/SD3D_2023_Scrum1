<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Script-Type" content="text/javascript">
<link rel="stylesheet" href="main.css">
</head>

<?php 

session_start();

$_SESSION['user_id'] = 1;

?>

<img id="fullscreenImage" src="img/haikei2.jpg" alt="Full Screen Image">


<canvas id="title"></canvas>
</body>

<script type="text/javascript" src="title.js"></script>

<script  type="module" src="db.js"></script>
<script  type="module" src="bg.js"></script>
<script  type="module" src="title.js"></script>

</html>
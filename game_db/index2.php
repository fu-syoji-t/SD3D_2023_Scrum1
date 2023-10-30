<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Script-Type" content="text/javascript">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>

<body>

<?php 

session_start();

$_SESSION['user_id'] = 1;
$_SESSION['play_id'] = 1;

?>



    <canvas id="main"></canvas>
</body>


<script  type="module" src="db.js"></script>
<script type="module" src="main2.js"></script>

</html>

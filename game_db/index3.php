<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Script-Type" content="text/javascript">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <link rel="stylesheet" href="style.css">
    <title>Ranking</title>
</head>

<body>

<div style="position: relative; display:inline-block;">
<div class="example">
<div style="position:relative;">
  <img src="./background/351_0 - コピー.png" alt="" width="700px">
  <img src="./background/waku3.png" alt="" width="600px" style="position:absolute; top: 0; left: 50px;" >
</div>
<div style="position: absolute; top: 0; left: 100px; max-width: 100%; max-height: 100%; padding: 30px;">
<div style="text-align: center; padding: 0; ">

<?php 

session_start();

$_SESSION['user_id'] = 1;
$_SESSION['play_id'] = 1;

?>



    <canvas id="main"></canvas>
</body>
<body>




<table border="5">
    <div class="text-center"><h1>ランキング</h1></div>
<div class="header">
	<div class="container"><br>
<table border="3">
  <tr>
    <div class="text-center"><td width="70"><h2>順位<h2></td></div>
    <div class="text-center"><td width="210"><h2>ユーザー名<h2></td></div>
    <div class="text-center"><td width="130"><h2>スコア<h2></td></div>
  </tr>
	<?php
		$rank = 1;
				
          $pdo = new PDO('mysql:host=localhost;dbname=scrum1;charset=utf8','webuser','abccsd2');
          $sql = "SELECT * FROM rankr INNER JOIN user ON rankr.user_id=user.user_id ORDER BY score DESC LIMIT 5 "; 
			
		$ps = $pdo->prepare($sql);
		$ps->execute();

		foreach($ps->fetchAll() as $row){
	?>
  <tr>
  <td><h3><?php echo $rank ?><h3></td>
  <td><h3><?php 
   echo $row['name'];
  ?><h3></td>
   <td><h3><?php 
   echo $row['score'];
  ?><h3></td>
<tr>
<?php 
$rank = $rank+1;

} ?>
		</tbody>
		</table>
		<br>
		<div class="text-end">
    <button onclick="test()"> タイトルへ戻る </button>
			<br>
		</div>
		
	</div>
</body>

<script  type="module" src="db.js"></script>
<script type="module" src="main3.js"></script>
</html>

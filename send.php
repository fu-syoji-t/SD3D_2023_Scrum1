<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["start_data"])) {
    echo $_POST["start_data"];
    $_SESSION['play_id'] = $_POST["start_data"];
    echo "<script>console.log('".$_SESSION['play_id']."')</script>";
    header('Location: index.php');
    exit;
}
?>

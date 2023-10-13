<?php

session_start();
$user_id = $_SESSION['user_id'];
$play_id = $_SESSION['play_id'];


if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["db_function"])) {
    $receivedFunction = $_POST["db_function"];


    

$dbConnection = new mysqli("localhost", "webuser", "abccsd2", "scrum1");

$dbConnection->set_charset("utf8");

if ($dbConnection->connect_error) {
    die("データベースへの接続に失敗しました: " . $dbConnection->connect_error);
}

if($receivedFunction === "play_data"){
    
    $query = "SELECT * FROM `my_monster` WHERE `user_id` = '$user_id' AND `play_id` = '$play_id'";
    
    

    $result = $dbConnection->query($query); 


    encode($result);
}


}


function encode($result){

    if ($result->num_rows > 0) {
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo "該当するユーザーはいません。";
    }
    
}

?>
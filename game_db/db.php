<?php


session_start();
$receivedFunction = "";

$user_id = $_SESSION['user_id'];
$play_id = $_SESSION['play_id'];

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["db_function"])) {
    $receivedFunction = $_POST["db_function"];
}
   
$dbConnection = new mysqli("localhost", "webuser", "abccsd2", "scrum1");
$dbConnection->set_charset("utf8");

if ($dbConnection->connect_error) {
    die("データベースへの接続に失敗しました: " . $dbConnection->connect_error);
}


if($receivedFunction === "state"){
    
    $query = "SELECT mm.monster_id, mm.my_gold, mm.day, mm.life, mm.hp, mm.atk, mm.def, mm.agi,
    dm.monster_name, dm.need_hp, dm.need_atk, dm.need_def, dm.need_agi, dm.need_item_id, 
    dm.correction_hp, dm.correction_atk, dm.correction_def, dm.correction_agi, dm.monster_text, dm.monster_image
    FROM my_monster mm
    INNER JOIN default_monster dm ON mm.monster_id = dm.monster_id
    WHERE mm.user_id = $user_id AND mm.play_id = $play_id;";

    $result = $dbConnection->query($query); 

    encode($result);
}

if($receivedFunction === "item"){
    
    $query = "SELECT * FROM item";

    $result = $dbConnection->query($query); 

    encode($result);
}

if($receivedFunction === "myitem"){
    
    $query = "SELECT mi.item_id, mi.item_number, i.item_name, i.item_effect, i.item_price, i.item_text  
    FROM my_item mi
    INNER JOIN item i on mi.item_id = i.item_id
    WHERE mi.user_id = $user_id AND mi.play_id = $play_id;";

    $result = $dbConnection->query($query); 

    encode($result);
}

if($receivedFunction === "skill"){
    
    $query = "SELECT * FROM skill";

    $result = $dbConnection->query($query); 

    encode($result);
}

if($receivedFunction === "myskill"){
    
    $query = "SELECT s.skill_id, s.skill_name, s.skill_effect, s.skill_price, s.skill_text  
    FROM my_skill ms
    INNER JOIN skill s on ms.skill_id = s.skill_id
    WHERE ms.user_id = $user_id AND ms.play_id = $play_id;";

    $result = $dbConnection->query($query); 

    encode($result);
}



if($receivedFunction === "save_item"){
    
    error_log("Received Function: " . $receivedFunction, 3, "error.log");
    
    $receiveditem = $_POST["id"];
    $receivedfluctuate = $_POST["number"];

    $query = "INSERT INTO `my_item` (`play_id`, `user_id`, `item_id`, `item_number`)
    VALUES ($play_id, $user_id, $receiveditem, $receivedfluctuate)
    ON DUPLICATE KEY UPDATE
    `item_number` = $receivedfluctuate;";
    
    $dbConnection->query($query);
}

if($receivedFunction === "save_state"){
    
    $receivedid   = $_POST["monster_id"];
    $receivedgold = $_POST["my_gold"];
    $receivedday  = $_POST["day"];
    $receivedlife = $_POST["life"];
    $receivedhp   = $_POST["hp"];
    $receivedatk  = $_POST["atk"];
    $receiveddef  = $_POST["def"];
    $receivedagi  = $_POST["agi"];

    $query = "UPDATE `my_monster`
          SET `monster_id` = $receivedid,
              `my_gold` = $receivedgold,
              `day` = $receivedday,
              `life` = $receivedlife,
              `hp` = $receivedhp,
              `atk` = $receivedatk,
              `def` = $receiveddef,
              `agi` = $receivedagi
          WHERE `play_id` = $play_id AND `user_id` = $user_id;";

              
              $dbConnection->query($query);
}

function encode($result){

    if ($result->num_rows > 0) {
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        //echo "該当するユーザーはいません。";
        echo json_encode(null);
    }
    
}

?>
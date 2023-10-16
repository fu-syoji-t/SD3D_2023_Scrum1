<?php
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["number"])) {
    $receivedNumber = $_POST["number"];
    $receivedPassword = $_POST["password"]; // 修正: $receivedPassword を "password" キーから取得
    $receivedName = $_POST["name"];
    $receivedData = json_decode($_POST["newData"]);

    // データベースに接続
    $dbConnection = new mysqli("localhost", "webuser", "abccsd2", "test");

    if ($dbConnection->connect_error) {
        die("データベースへの接続に失敗しました: " . $dbConnection->connect_error);
    }

    // 文字セット設定
    $dbConnection->set_charset("utf8");

    if ($receivedNumber == 1) {
        // numberが1の場合、データベースからすべてのデータを取得
        $query = "SELECT * FROM `user`";
        $result = $dbConnection->query($query);  

        encode($result);

    } elseif ($receivedNumber == 2) {
        // numberが2の場合、パスワードを使用してデータベースからデータを取得
       
        $query = "SELECT * FROM `user` WHERE `password` = '$receivedPassword'";
        $result = $dbConnection->query($query);

        encode($result);

    } elseif ($receivedNumber == 3) {
        // numberが3の場合、UPDATEクエリを実行して user_name を更新
        $receivedName = mysqli_real_escape_string($dbConnection, $receivedName);
        $receivedPassword = mysqli_real_escape_string($dbConnection, $receivedPassword); // 修正: $receivedPassword を正しく使用
        $query = "UPDATE `user` SET `user_name` = '$receivedName' WHERE `password` = '$receivedPassword'";
        $result = $dbConnection->query($query);

        if ($result) {
            echo "user_nameが更新されました.";
        } else {
            echo "更新に失敗しました.";
        }
    } elseif ($receivedNumber == 4) {
        // numberが4の場合、新しいデータを挿入
        $newMail = $receivedData->newMail;
        $newPass = $receivedData->newPass;
        $newName = $receivedData->newName;

        $query = "INSERT INTO `user` (`mail`, `password`, `user_name`) VALUES ('$newMail', '$newPass', '$newName')";
        $result = $dbConnection->query($query);

        if ($result) {
            echo "新しいデータが挿入されました.";
        } else {
            echo "挿入に失敗しました.";
        }
    }

    // データベース接続を閉じる
    $dbConnection->close();
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

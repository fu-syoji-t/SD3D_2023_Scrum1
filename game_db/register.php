<?php
// データベースへの接続情報
$host = "localhost"; // ホスト名
$dbname = "scrum1"; // データベース名
$username = "webuser"; // データベースユーザー名
$password = "abccsd2"; // データベースパスワード

// フォームから送信されたデータを取得
$name = $_POST['user'];
$email = $_POST['mail'];
$pass = password_hash($_POST['pass'], PASSWORD_DEFAULT); // パスワードをハッシュ化

try {
    // データベースに接続
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    
    // エラーモードを例外モードに設定
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // データベースに新規ユーザーを挿入
    $query = $db->prepare("INSERT INTO user (name, mail, pass) VALUES (?, ?, ?)");
    $query->execute([$name, $email, $pass]);
    
    // データベース接続を切断
    $db = null;
    
    // 登録が成功したらメッセージを表示
    echo '新規登録が完了しました。';
} catch (PDOException $e) {
    // エラーが発生した場合はエラーメッセージを表示
    die("エラー: " . $e->getMessage());
}
header('Location: ログイン.php');
?>

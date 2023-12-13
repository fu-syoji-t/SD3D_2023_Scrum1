<?php
// データベースへの接続情報
$host = "localhost"; // ホスト名
$dbname = "scrum1"; // データベース名
$username = "root"; // データベースユーザー名
$password = "root"; // データベースパスワード

// フォームから送信されたユーザー名とパスワードを取得
$user = $_POST['mail'];
$pass = $_POST['password'];

$error_message = "";
try {
    // データベースに接続
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);

    // エラーモードを例外モードに設定
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // データベースからユーザー情報を取得
    $query = $db->prepare("SELECT * FROM user WHERE mail = ?");
    $query->execute([$user]);
    $userData = $query->fetch();

    // メールアドレスの検証
if (!filter_var($user, FILTER_VALIDATE_EMAIL)) {
    // 無効なメールアドレス
    $error_message = "メールアドレスまたはパスワードが一致しません。";
    header('Location:ログイン.php?error=' . urlencode($error_message));
    exit();
}

    // パスワードの検証
    if ($userData['pass'] == password_verify($pass, $userData['pass'])) {
        // 認証成功
        echo 'ログイン成功！';
        header('Location:index2.php') ;
    } else {
        // 認証失敗
        $error_message = "メールアドレスまたはパスワードが一致しません。";
        // ログインページにエラーメッセージを渡してリダイレクト
        header('Location:ログイン.php?error=' . urlencode($error_message));
    }

    // データベース接続を切断
    $db = null;
} catch (PDOException $e) {
    // エラーが発生した場合はエラーメッセージを表示
    die("エラー: " . $e->getMessage());
}
?>
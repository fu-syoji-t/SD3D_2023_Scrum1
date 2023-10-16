// JavaScriptコードでnumberを生成
var number = 3; // ここを4に設定
var name = "たちつて斗";
var password = "tatituteto"; // パスワードを設定

// 新しいデータを生成するJavaScript関数
function generateNewData() {
    var newMail = "tatituteto@tatituteto.jp";
    var newPass = "tatituteto";
    var newName = "たちつて斗";
    return {
        newMail: newMail,
        newPass: newPass,
        newName: newName
    };
}

// JavaScriptからデータをPHPに送信
function sendDataToPHP(number, password, name, newData) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "sample6.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var result = xhr.responseText;
            var data = JSON.parse(result);

            if (data.length > 0) {
                document.write("取得したデータ:<br>");
                for (var i = 0; i < data.length; i++) {
                    document.write("メール: " + data[i].mail + "<br>");
                    document.write("ユーザー名: " + data[i].user_name + "<br>");
                }
            }
        }
    };
    xhr.send("number=" + number + "&password=" +  password + "&name=" + name + "&newData=" + JSON.stringify(newData));
}

// 新しいデータを生成
var newData = generateNewData();

// データをPHPに送信
sendDataToPHP(number, password, name, newData);
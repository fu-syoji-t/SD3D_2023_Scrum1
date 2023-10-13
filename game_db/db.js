export function play_data() {
    return new Promise(function(resolve, reject) {
        var db_function = "play_data";
        var xhr = new XMLHttpRequest();

        xhr.open("POST", "db.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var result = xhr.responseText;
                    var data = JSON.parse(result);
                    resolve(data); // 成功時にPromiseを解決
                } else {
                    reject(new Error("Request failed")); // エラー時にPromiseを拒否
                }
            }
        };
        xhr.send("db_function=" + db_function);
    });
}

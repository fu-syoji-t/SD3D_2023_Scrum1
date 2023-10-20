export function load_data(data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open("POST", "db.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var result = xhr.responseText;
                    var sql_data = JSON.parse(result);

                    console.log(sql_data);

                    if(sql_data != null){
                        resolve(sql_data); // 成功時にPromiseを解決
                    }else{
                        resolve(null);
                        console.log("該当する値は存在しませんでした。")
                    }
                } else {
                    reject(new Error("Request failed")); // エラー時にPromiseを拒否
                }
            }
        };
        xhr.send("db_function=" + data);
    });
}



export function save_item(id, number) {
    var xhr = new XMLHttpRequest();
    var data = "save_item";

    xhr.open("POST", "db.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var result = xhr.responseText;
                console.log(result);
            } else {
                console.error("Request failed");
            }
        }
    };

    xhr.send("db_function=" + data + "&id=" + id + "&number=" + number);
}



export function save_state(monster_id,my_gold,day,life,hp,atk,def,agi){

        var xhr = new XMLHttpRequest();
        var data = "save_state";

        xhr.open("POST", "db.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var result = xhr.responseText;
                    console.log(result);
                } else {
                    console.error("Request failed");
                }
            }
        };

        console.log("hp"+ hp+1);
        xhr.send("db_function=" + data +
                 "&monster_id=" + monster_id +
                 "&my_gold=" + my_gold +
                 "&day=" + day +
                 "&life=" + life +
                 "&hp=" + hp +
                 "&atk=" + atk +
                 "&def=" + def +
                 "&agi=" + agi);

}
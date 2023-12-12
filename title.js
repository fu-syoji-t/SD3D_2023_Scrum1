"use strict";

//--------------------フォント設定0-------------------------
var FONT = "36px sans-serif";           //使用フォント

const customFont = new FontFace(
    'CustomFont', // フォントファミリー名
    `url(font/PixelMplus12-Regular.ttf)`, // フォントファイルへの相対パス
);

customFont.load().then(function(loadedFont) {
    document.fonts.add(loadedFont);
})

customFont.loaded.then(function() {
    FONT = '36px CustomFont'; // フォントファミリー名を設定
    // ここでフォントのスタイルを適用する他の部分のコードを追加
})
//---------------------------------------------------------

const FONTSTYLE     = "#000000";                   //文字色


const SelectMenu = ["はじめから","つづきから"];
const testMenu = ["データ1","データ2","データ3"]

const T_HEIGHT = 32;                      //モンスターチップの幅
const T_WIDTH = 31;    

const INTERVAL      = 66;                          //フレーム呼び出し感覚
const HEIGHT        = 1000;                        //仮想画面サイズ、高さ
const WIDTH         = 1000;                        //仮想画面サイズ、幅
const WNDSTYLE      = "rgba(0,0,0,0.75)"           //ウインドウの色
const gFileLogo  = "img/logo_icon.png"           //画像。テスト
const gFileBack      = "img/back.png"           //  背景画像


let gMessage1 = null;
let gMessage2 = null;
let gMessage3 = null;

let gCursorX = 0;                              //カーソルの横位置                      
let gCursorY = 0;                              //カーソルの縦位置
let Cursor = 0;
let SelectCursor = 0;
let gWidth;                                    //実画面の幅
let gHeight;                                   //実画面の高さ
let gScreen;                                   //仮想画面
let gImgLogo;                                  //画像。テスト
let gImgback
let gIsKeyDown = {};                           //キーが押されているかどうかを示すオブジェクト
let gFrame = 0;                                //内部カウンタ
let tPhase = 0;                                //タイトル画面のフェーズ
let p_id = 0;
let select_slot = 0;

const audio = new Audio('BGM/MusMus-BGM-033.mp3');      //BGMを取得

import{load_data} from './db.js';

const s ={};

async function play_data(){
    
    const my_data  =  await  load_data("mydata");    

    s.my_data   =  Setdata(my_data);
    console.log(s.my_data)
}

function Setdata(data){

    if(data !== null && data !== undefined){
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (!isNaN(data[i][key])) {
                data[i][key] = parseInt(data[i][key]);
            }
        }
    }
}else(
    data = []
)
return data;
}



//画像の読み込みを行う関数
function LoadImage()
{
    gImgLogo    = new Image(); gImgLogo.src    = gFileLogo;         // モンスター画像読み込み
    gImgback    = new Image(); gImgback.src    = gFileBack;         // モンスター画像読み込み
}

function GetMenu()
{
    let Cm=0;let Cx=0; let Cy=0;
    if(tPhase === 0){
        Cm = SelectMenu;    Cx = 1; Cy = 2;
    }
    if(tPhase === 1 || tPhase === 2){
        Cm = testMenu;    Cx = 1; Cy = 3;
    }
    return {
        Cm,Cx,Cy
    };
}

/*
function Drawmessage(g){
    g.font = FONT;  g.fillStyle = FONTSTYLE   // 文字色を設定

    g.fillText(gMessage1, WIDTH / 28 ,HEIGHT / 1.32 + HEIGHT /11.5 * 0);
    g.fillText(gMessage2, WIDTH / 28 ,HEIGHT / 1.32 + HEIGHT /11.5 * 1);
    g.fillText(gMessage3, WIDTH / 28 ,HEIGHT / 1.32 + HEIGHT /11.5 * 2);
}
*/
function SetText(M1,M2,M3){
    gMessage1 = M1;
    gMessage2 = M2;
    gMessage3 = M3;
}


function DrawTitle(g)
{
    g.drawImage(gImgLogo, 100, 120,800,264) 
}

function DrawBack(g){
    g.drawImage(gImgback,0,0,WIDTH, gImgback.height * WIDTH / gImgback.width) 
}

function DataSelect(g){
    

    for(var i = 0;i<3;i++){
    g.fillStyle = WNDSTYLE;         // ウインドウの色
    g.fillRect(WIDTH/9, HEIGHT/3.5 * i + HEIGHT/10, WIDTH/1.2, HEIGHT/4);     // 短形描画
    g.fillStyle = "#ffffff";  // 文字フォントを設定
    g.fillText("データ"+(i+1),WIDTH/8, HEIGHT/3.5 * i + HEIGHT/7)
    if(s.my_data && s.my_data[i] != undefined && s.my_data[i].play_id == i+1){
        g.fillText(s.my_data[i].day+"日目",WIDTH/8, HEIGHT/3.5 * i + HEIGHT/7 + HEIGHT/18 * 1)
        g.fillText(s.my_data[i].my_gold+"G",WIDTH/8, HEIGHT/3.5 * i + HEIGHT/7 + HEIGHT/18 * 2)
        g.fillText("体力:"+s.my_data[i].hp+
                   "　攻撃:"+s.my_data[i].atk+
                   "　防御:"+s.my_data[i].def+
                   "　速さ:"+s.my_data[i].agi
                   ,WIDTH/8, HEIGHT/3.5 * i + HEIGHT/7 + HEIGHT/18 * 3);
                   
    }else{
        g.fillText("…なにも!!!な゛かった…!!!",WIDTH/8, HEIGHT/3.5 * i + HEIGHT/5)
    }
}


    g.fillStyle = WNDSTYLE;  // 文字フォントを設定

    if(tPhase === 1){
    g.fillText("どのデータでゲームを始めますか？",  WIDTH/9 , HEIGHT/15);             // Lv
    }else{
    g.fillText("どのデータを読み込みますか？",  WIDTH/9 , HEIGHT/15);             // Lv
    }
    g.fillText("➡",  WIDTH/15, HEIGHT/3.5 * gCursorY + HEIGHT/4.3, WIDTH/1.2, HEIGHT/4);
    console.log(gCursorY);
}

function StartCheck(g){
    g.fillStyle = WNDSTYLE;         // ウインドウの色
    g.fillRect(WIDTH/9, HEIGHT/10, WIDTH/1.2, HEIGHT/8);     // 短形描画


}

function DrawHome(g)
{
    audio.play();
    g.fillStyle = "#F0E68C";								//	背景色
	g.fillRect( 0, 0, WIDTH, HEIGHT );                      //  背景設定                              

    DrawBack(g);
    DrawTitle(g);                                           //タイトルロゴを描画する関数
    //Drawmessage(g);
    //DrawMenu(g);                                        //セレクトメニュー画面を描画する

    if(tPhase == 0){
        DrawMenu(g);
    }
    if(tPhase == 1){
        DataSelect(g);
    }
    if(tPhase == 2){
        DataSelect(g);
    }
    if(tPhase == 22){
        StartCheck();
    }
    //g.fillStyle = WNDSTYLE
}

function DrawMenu(g)
{
    let Menu = GetMenu();

    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定

    var Mlength = Object.keys(Menu.Cm).length;
    
    let CountMenu = 0;

    //g.fillText(Menu.Cm[0], WIDTH/28,HEIGHT / 1.32);
    
        for(let y=0; y<Menu.Cy; y++){
            for(let x=0; x<Menu.Cx; x++){
                
                g.fillText( "　"+Menu.Cm[CountMenu] , WIDTH / 2.85 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8) ,HEIGHT / 2 + HEIGHT /11.5 * (y+1));
                
                CountMenu += 1;
            if(Mlength-1 < CountMenu){
                break;
            }
        }
    }
    g.fillText("⇒", WIDTH / 2.85 + (WIDTH/1.2 / Menu.Cx) * gCursorX * 0.8, HEIGHT / 2 + HEIGHT /11.5 * (gCursorY + 1));
}


function WmTimer()
{
    gFrame++;                                  // 内部カウンタを加算
    WmPaint();
}

function WmPaint() // グラフィック系のファンクション
{
    DrawMain();

    const ca = document.getElementById("title");// titleキャンバスの要素を取得
    const g = ca.getContext("2d");             // 2D描画コンテキストを取得


    g.drawImage(gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight); // 仮想画面のイメージを実画面へと転送

}

function WmSize()
{
    const ca = document.getElementById("title");// titleキャンバスの要素を取得

    ca.width = window.innerWidth               // キャンバスの幅をブラウザの幅へ変更
    ca.height = window.innerHeight             // キャンバスの高さをブラウザの幅へ変更

    const g = ca.getContext("2d");

    // 実画面サイズを計測。ドットのアスペクト比を維持したままでの最大サイズを計測。
    gWidth = ca.width;
    gHeight = ca.height;

    // ブラウザサイズが縦長だった場合横に、横長だった場合縦に比率を合わせる計算
    if (gWidth / WIDTH < gHeight / HEIGHT) {
        gHeight = gWidth * HEIGHT / WIDTH;
    } else {
        gWidth = gHeight * WIDTH / HEIGHT;
    }

    const offsetX = (window.innerWidth - gWidth) / 2;
    const offsetY = (window.innerHeight - gHeight) / 2;
    ca.style.position = "absolute";
    ca.style.left = offsetX + "px";
    ca.style.top = offsetY + "px";

    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "hidden";
}

function DrawMain() 
{

    const g = gScreen.getContext("2d");             // 仮想画面の2D描画コンテキスト

    DrawHome(g);
}

window.onkeydown = function (ev) {
    let c = ev.keyCode;     // キーコード取得
    /*
    if (gIsKeyDown[c]) {    // 既にキーが押されている場合は処理しない
        return;
    }
    gIsKeyDown[c] = true;
    */

    const menu = GetMenu();
    var length = Object.keys(menu.Cm).length + 1;
    
    console.log(menu.Cm);


    // キーボードの右キーが押された場合
    if (c === 40) {
        // gCursorXが最大値に達していない場合に1増やす
        if(gCursorY < menu.Cy - 1){
            gCursorY ++;
        }else{
            gCursorY = 0;
        }

    }
    // キーボードの左キーが押された場合
    if (c === 38) {
        // gCursorXが最小値に達していない場合に1減らす
        if(gCursorY > 0){
            gCursorY --;
        }else{
            gCursorY = menu.Cy-1;
        }
       NowCursor();
    }
    console.log("X:"+ gCursorX+" Y:"+gCursorY);

    
}

function NowCursor(){
    var Menu = GetMenu();
    Cursor = (gCursorY == 0) ? gCursorX + 1 :gCursorY * Menu.Cx + gCursorX+1;
}

function ChangePhase(t){
    tPhase = t;
    gCursorX = 0;
    gCursorY = 0;

    NowCursor();
}

window.onkeyup = function (ev) {
    let c = ev.keyCode;     // キーコード取得
    gIsKeyDown[c] = false;
    
    

    if(c == 13 || c == 90){             //Enterキー、またはzキーの場合
        
        /*
        button_se.play();

        if (isAudioPlaying) {
            button_se.currentTime = 0;
        }

        isAudioPlaying = true;
        */
    
        if(tPhase == 0){
            if(gCursorY == 0){
                console.log("テストのとこ")
                ChangePhase(1);
            }
            if(gCursorY == 1){
                console.log("テスト２のとこ")
                ChangePhase(2);
            }
        }
        else if(tPhase === 1){
            select_slot = gCursorY+1
            ChangePhase(11);
        }
        else if(tPhase === 11){
            start_state(select_slot);
            start_game(select_slot);
            window.location.href = "index.php";
        }
        else if(tPhase === 2){
            select_slot = gCursorY+1
            ChangePhase(22);
        }
        else if(tPhase === 21){
            ChangePhase(22);       
        }
        if(tPhase === 22){
            //if(gCursorY === 1){
                start_game(select_slot);
                window.location.href = "index.php";
           /* }else{
                ChangePhase(21);
            }*/
        }
        console.log(Cursor);
    }
    if(c == 88 ||  c == 96){
        
            tPhase = 0
        
    }
}
/*
button_se.addEventListener('ended', function () {
    isAudioPlaying = false;
})
*/

// ブラウザ起動イベント
window.onload = function () 
{
    LoadImage();

    gScreen = document.createElement("canvas"); // 仮想画面を作成
    gScreen.width = WIDTH;                      // 仮想画面の幅を設定
    gScreen.height = HEIGHT;                    // 仮想画面の高さを設定
    
    play_data()

    WmSize();
    window.addEventListener("resize", function () { WmSize() }); // ブラウザサイズ変更時、WmSize()が呼ばれるよう指示
    setInterval(function () { WmTimer() }, INTERVAL); 
    
}



export function start_state(sp_id){
    var xhr = new XMLHttpRequest();
    var data = "start_state";

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

    xhr.send("db_function=" + data + "&sp_id=" + sp_id);
}


export function start_game(start_data) {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "send.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var result = parseInt(xhr.responseText,10);
                console.log(result);
            } else {
                console.error("Request failed");
            }
        }
    };

    xhr.send("start_data=" + start_data);
}


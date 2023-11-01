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


const SelectMenu = [/*モード選択",*/"こうげき","特技","テスト"];

const T_HEIGHT = 32;                      //モンスターチップの幅
const T_WIDTH = 31;    

const INTERVAL      = 66;                          //フレーム呼び出し感覚
const HEIGHT        = 1000;                        //仮想画面サイズ、高さ
const WIDTH         = 1000;                        //仮想画面サイズ、幅
const gFileLogo  = "img/logo_icon.png"           //画像。テスト
const gFileBack      = "img/back.png"           //  背景画像

let gCursorX = 0;                              //カーソルの横位置                      
let gCursorY = 0;                              //カーソルの縦位置
let Cursor = (gCursorY == 0) ? gCursorX :gCursorY * 2 + gCursorX;
let gWidth;                                    //実画面の幅
let gHeight;                                   //実画面の高さ
let gScreen;                                   //仮想画面
let gImgback
let gIsKeyDown = {};                           //キーが押されているかどうかを示すオブジェクト
let gFrame = 0;                                //内部カウンタ
let tPhase = 0;                                //タイトル画面のフェーズ

let gHP = 100                             //モンスターのHP
let gMHP = 100                            //モンスターの最大HP
let gATK = 100                                //モンスターの攻撃力
let gDFE = 100                                 //モンスターの防御力
let gAGI = 100                                 //モンスターの素早さ

let eHP = 300                             //モンスターのHP
let eMHP = 300                            //モンスターの最大HP
let eATK = 300                                 //モンスターの攻撃力
let eDFE = 300                                 //モンスターの防御力
let eAGI = 300                                 //モンスターの素早さ

let adamage = 50
let ahit = 80

let kaihi
let meichu

let pDogge;
let eDogge;
let random; 
let min = 1;
let max = 100;
let dmg;



const audio = new Audio('BGM/MusMus-BGM-033.mp3');      //BGMを取得

//画像の読み込みを行う関数
function LoadImage()
{

    gImgback    = new Image(); gImgback.src    = gFileBack;         // モンスター画像読み込み

}

function GetMenu()
{
    let Cm=0;let Cx=0; let Cy=0;
    Cm = SelectMenu;    Cx = 1; Cy = 2;
    return {
        Cm,Cx,Cy
    };
}

function DrawBack(g){
    g.drawImage(gImgback,0,0,WIDTH, gImgback.height * WIDTH / gImgback.width) 
}

function DrawHome(g)
{
    audio.play();
    g.fillStyle = "#F0E68C";								//	背景色
	g.fillRect( 0, 0, WIDTH, HEIGHT );                      //  背景設定                              

    DrawBack(g);
    DrawMenu(g);                                        //セレクトメニュー画面を描画する
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

    const ca = document.getElementById("battle");// titleキャンバスの要素を取得
    const g = ca.getContext("2d");             // 2D描画コンテキストを取得


    g.drawImage(gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight); // 仮想画面のイメージを実画面へと転送

}

function WmSize()
{
    const ca = document.getElementById("battle");// titleキャンバスの要素を取得

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

    const Cursor = GetMenu();
    var length = Object.keys(Cursor.Cm).length + 1;
    
    console.log(Cursor.Cx+" "+ Cursor.Cy);


    // キーボードの右キーが押された場合
    if (c === 40) {
        // gCursorXが最大値に達していない場合に1増やす
        if(gCursorY == 1){
            gCursorY = 0;
        }else{
            gCursorY++;
        }
        /*
        if (gCursorY < Cursor.Cy - 1) {
            gCursorY++;
        }
        else if(gCursorX <= Cursor.Cx-1){
            gCursorX++;
            gCursorY = 0;
        }
        if(length-2 <  Cursor.Cy * gCursorX + (gCursorY)){
            gCursorY = 0;
            gCursorX = 0;
        }
        */
    }
    // キーボードの左キーが押された場合
    if (c === 38) {
        // gCursorXが最小値に達していない場合に1減らす
        if(gCursorY == 0){
            gCursorY = 1;
        }else{
            gCursorY--;
        }
        /*
        if (gCursorY > 0) {
            gCursorY--;
        }
        else if(gCursorX != 0){
            gCursorX--;
            gCursorY = Cursor.Cy - 1;
        }else{
            gCursorX = Cursor.Cx - 1
            if(Cursor.Cx != 1){
                gCursorY = length % Cursor.Cx;
            }else{
                gCursorY = Cursor.Cy - 1;
            }
        }
        */

    }
    console.log("X:"+ gCursorX+" Y:"+gCursorY);
    console.log(tPhase);
    
}

function gAttack(){
    console.log("味方のモンスターの攻撃！")
    random = Math.floor(Math.random() * (max - min) + min);
    //console.log(random);
    if((ahit - eDogge) >= random){
        console.log("命中")
        dmg = Math.ceil((gATK * 20) / eDFE);
        eHP -= dmg;
    }else{
        dmg = 0;
        console.log("当たらなかった！")
    }
        console.log("ダメージ数：" + dmg);
        console.log("自分のHP：" + gHP + "敵のHP" + eHP);  
}

function eAttack(){
    console.log("敵のモンスターの攻撃！")
    random = Math.floor(Math.random() * (max - min) + min);
    //console.log(random);
    if((ahit - pDogge) >= random){
        console.log("命中")
        dmg = Math.ceil((eATK * 20) / gDFE);
        gHP -= dmg;
    }else{
        dmg = 0;
        console.log("当たらなかった！")
    }
        console.log("ダメージ数：" + dmg);
        console.log("自分のHP：" + gHP + "敵のHP" + eHP);
}

function bAttack(){
    if(gAGI < eAGI){
        eDogge = (eAGI - gAGI) * 0.1
        pDogge = 0;
    }else{
        pDogge = (gAGI - eAGI) * 0.1;
        eDogge = 0;
    }

    if(gAGI < eAGI){
        eAttack();
        if(gHP > 0){
            gAttack();
        }
    }else{
        gAttack(g);
        if(eHP > 0){
            eAttack();
        }
    }
    if(eHP <= 0 || gHP <= 0){
        console.log("バトル終了！")
    }
}


window.onkeyup = function (ev) {
    let c = ev.keyCode;     // キーコード取得
    gIsKeyDown[c] = false;
    
    let nowCursor = gCursorY + 1;

    if(c == 13 || c == 90){             //Enterキー、またはzキーの場合
        
        /*
        button_se.play();
        if (isAudioPlayin g) {
            button_se.currentTime = 0;
        }

        isAudioPlaying = true;
        */
        if(nowCursor == 1){
            bAttack();
            /*if(gAGI < eAGI){
                sai = (eAGI - gAGI) * 0.1
            }else{
                sai = (gAGI - eAGI) * 0.1
            }
            random = Math.floor(Math.random() * (max - min) + min);
            console.log(random);
            if((ahit - sai) >= random){
                 console.log("命中")
                 dmg = Math.ceil((gATK * 20) / eDFE);
                 eHP -= dmg;
            }else{
                dmg = 0;
                console.log("当たらなかった！")
            }
            console.log("ダメージ数：" + dmg);
            console.log("自分のHP：" + gHP + "敵のHP" + eHP);
            */
        }
        if(nowCursor == 2){
            if(gAGI < eAGI){
                sai = (eAGI - gAGI) * 0.1
            }else{
                sai = (gAGI - eAGI) * 0.1
            }
            random = Math.floor(Math.random() * (max - min) + min);
            console.log(random);
            if((ahit - sai) >= random){
                 console.log("命中")
                 dmg = Math.ceil(((gATK * 100)) / eDFE);
                 eHP -= dmg;
            }else{
                dmg = 0;
                console.log("当たらなかった！")
            }
            console.log("ダメージ数：" + dmg);
            console.log("自分のHP：" + gHP + "敵のHP" + eHP);
        }
    
    }
    console.log(nowCursor);
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
    

    WmSize();
    window.addEventListener("resize", function () { WmSize() }); // ブラウザサイズ変更時、WmSize()が呼ばれるよう指示
    setInterval(function () { WmTimer() }, INTERVAL); 
    
}
"use strict";

const M_HEIGHT = 32;                      //モンスターチップの幅の半分
const M_WIDTH = 32;                       //モンスターチップの高さの半分

const FONT = "36px sans-serif";           //使用フォント
const FONTSTYLE     = "#ffffff";          //文字色
const INTERVAL      = 33;                 //フレーム呼び出し感覚
const gFileMonster  = "img/mob_icon.png"           //画像。テスト
const HEIGHT        = 1000;                //仮想画面サイズ、高さ
const WIDTH         = 1000;                //仮想画面サイズ、幅
const START_HP      = 20;                  //モンスターの開始時のHP
const ATK           = 5;                   //モンスターの攻撃力
const DFE           = 5;                   //モンスターの防御力
const AGI           = 5;                   //モンスターの素早

const MWNDSTYLE     = "rgba(203,244,255,1)"  //モンスターウインドウの色
const WNDSTYLE      = "rgba(0,0,0,0.75)"  //ウインドウの色

const SelectMenu = ["今日は何をしますか？","鍛える","働く","休む","買い物","アイテム"];
const TrainingMenu = ["何を鍛えますか？","体力","力","守り","速さ"];
const ShopMenu = {"何を買いますか？":null,"やくそう　 200G": 200,"中やくそう 400G": 400,"上やくそう 800G": 800,"スライム餅     0G": 0};

const gKey = new Uint8Array(0x100);

let gHP = START_HP                             //モンスターのHP
let gMHP = START_HP                            //モンスターの最大HP
let gATK = ATK                                 //モンスターの攻撃力
let gDFE = DFE                                 //モンスターの防御力
let gAGI = AGI                                 //モンスターの素早さ

let state = [ gMHP,gATK,gDFE,gAGI ];

let life = 100  

let MyItem = [0,0,0,0];
let MyG = 100;

let gMessage1 = null;
let gMessage2 = null;
let gMessage3 = null;
let gCursorX = 0;                              //カーソルの横位置                      
let gCursorY = 0;                              //カーソルの縦位置
let gFrame = 0;                                //内部カウンタ
let gWidth;                                    //実画面の幅
let gHeight;                                   //実画面の高さ
let gImgMonster;                               //画像。テスト
let Monster_number = 1;
let gScreen;                                   //仮想画面
let gIsKeyDown = {};                           //キーが押されているかどうかを示すオブジェクト
let mPhase = 0;                                //モンスター育成画面のフェーズ
let bPhase = 0;                                //戦闘画面のフェーズ
let day = 1;                                   //育成画面での経過日数

var loopshop = 0;


//画像の読み込みを行う関数
function LoadImage()
{

    gImgMonster    = new Image(); gImgMonster.src    = gFileMonster;         // モンスター画像読み込み

}


function GetMenu(){
    let Cm=0;let Cx=0; let Cy=0;
    if(mPhase == 0){
        Cm = SelectMenu;    Cx = 4; Cy = 2; 
    }else if(mPhase == 1){
        Cm = TrainingMenu;  Cx = 4; Cy = 1;
    }else if(mPhase == 4){
        Cm = ShopMenu;      Cx = 2; Cy = 2;
    }
    return {
        Cm,Cx,Cy
    };
}


//ステータスを表示する関数
function DrawStatus(g)
{
    g.fillStyle = WNDSTYLE;         // ウインドウの色
    g.fillRect(WIDTH - WIDTH/4, HEIGHT/8, WIDTH/4.1, HEIGHT/2.8);     // 短形描画
    
    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定

    g.fillText("体力: "+ state[0], WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 0);        // Lv
    g.fillText("　力:" + state[1], WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 1);             // HP
    g.fillText("守り:" + state[2], WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 2);             // 経験値
    g.fillText("速さ:" + state[3], WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 3);             // 経験値
}

//所持金を表示する関数
function DrawG(g)
{
    g.fillStyle = WNDSTYLE;
    g.fillRect(WIDTH - WIDTH/4, HEIGHT/2, WIDTH/4.1, HEIGHT/6.3);

    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定  

    g.fillText("所持ゴールド", WIDTH - WIDTH/4.2, HEIGHT/1.8);        // Lv
    g.fillText(MyG + "G", WIDTH - WIDTH/4.2, HEIGHT/1.6);             // HP
}

//新しいテキストを入力する前にウインドウをリセットする関数
function ResetWND(g)
{
    g.fillRect(WIDTH/80, HEIGHT / 2 + HEIGHT/5.4 ,WIDTH/1.37 , WIDTH/3.3);     // 短形描画
}


function MoveCurso()
{
}


function DrawMenu(g)
{
    ResetWND(g);
    let Menu = GetMenu();

    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定

    var Mlength = Object.keys(Menu.Cm).length;

    let CountMenu = 0;

    if (typeof Menu.Cm === 'object' && !Array.isArray(Menu.Cm) && Menu.Cm !== null) 
    {
        g.fillText("　"+Object.keys(ShopMenu)[0]+"　" , WIDTH/28,HEIGHT / 1.32);
        
        let First = true;
        let x = 0;
        let y = 0
        Object.keys(ShopMenu).forEach(function(productName) {
            if (First) {
                First = false; // 最初の要素をスキップ
                return; // continueのように処理をスキップして次の要素へ
              }
            g.fillText(`　${productName}`,
            WIDTH / 28 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8) ,HEIGHT / 1.32 + HEIGHT /11.5 * (y+1));
            x = x+1;
            if(x >= Menu.Cx){
                x = 0;
                y++;
            }
          });
          
    }else{
    g.fillText(Menu.Cm[0], WIDTH/28,HEIGHT / 1.32);
    
        for(let y=0; y<Menu.Cy; y++){
            for(let x=0; x<Menu.Cx; x++){
                
                    g.fillText( "　"+Menu.Cm[CountMenu+1] , WIDTH / 28 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8) ,HEIGHT / 1.32 + HEIGHT /11.5 * (y+1));
                
                CountMenu += 1;
            if(Mlength-2 < CountMenu){
                break;
            }
        }
    }
}
g.fillText("⇒", WIDTH / 28 +(WIDTH / 1.2 / Menu.Cx) * gCursorX * 0.8, HEIGHT / 1.32 + HEIGHT /11.5 * (gCursorY + 1));
}


function Drawwork(g)
{
    ResetWND(g);
    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定

    let PlusG = 100;

    //g.fillText("モンスターと一緒に働いて"+PlusG+"G手に入れた！！" , WIDTH/28,HEIGHT / 1.32);

    MyG += PlusG;

    mPhase = 0;
    gCursorX = 0;
}

function Shop()
{
    let buy_Item = (gCursorY == 0) ? gCursorX+1 :gCursorY * 2 + gCursorX+1;

    const menuItems = Object.keys(ShopMenu);

    if (buy_Item >= 1 && buy_Item <= menuItems.length) {
        const selectedItem = menuItems[buy_Item]; // 数値をインデックスに変換
        const price = ShopMenu[selectedItem]; // 項目の価格を取得
        if(MyG >= price){
        MyG -= price;
        MyItem[buy_Item - 1] += 1;

        console.log(buy_Item);
        console.log(MyItem[0]+":薬草　"+MyItem[1]+":上薬草　"+MyItem[2]+":中薬草　"+MyItem[3]+":スライム餅"); 
        }
    }
}


function Drawgrowth(gCursorX)
{

    var random = RandomUp();
    var chenge = 0;
    if(gCursorX == 0){
        if (random === '1' || random === '3' || random === '4') {
            if (random === '1') {
                chenge = -3;
            } else if (random === '3') {
                chenge = 3;
            } else if (random === '4') {
                chenge = 10;
            }
        }
     }else if(gCursorX > 0 && gCursorX < 4){
            if (random == '1' || random === '3' || random === '4') {
                if (random == '1') {
                    chenge = -1;
                } else if (random == '3') {
                    chenge = 1;
                } else if (random == '4') {
                    chenge = 3;
                }
            }
        }
        state[gCursorX] += chenge;

        day++;
    }

function RandomUp()
{
   const random = Math.random() * 100;
   return random <= 1 ? '1' : random <= 25 ? '2' : random <= 98 ? '3' : '4';
}

//モンスターのライフバーを描画する関数
function DrawLife(moov)
{

    life = life + moov;
    if(life >= 100){
        life = 100;
    }
    if(life <= 0){
        life = 0;
    }

    if(life <= 0){
        mPhase = 9;
    }
}


//ホーム画面を描写する関数
function DrawHome(g)
{
    g.fillStyle = "#F0E68C";								//	背景色
	g.fillRect( 0, 0, WIDTH, HEIGHT );
 
    g.fillStyle = MWNDSTYLE;
    g.fillRect(0,0,WIDTH - WIDTH /3.9,HEIGHT/1.52);


    g.drawImage(gImgMonster,Monster_number-1,0, M_WIDTH , M_HEIGHT ,Math.floor(WIDTH/ 4.8) ,Math.floor(HEIGHT / 8),WIDTH/3,HEIGHT/3);

    g.fillStyle = WNDSTYLE;         // ウインドウの色
    g.fillRect(WIDTH/80,HEIGHT/80,WIDTH/7,65);

    g.fillRect(WIDTH/4.3,HEIGHT/7,WIDTH/3.5,HEIGHT/45);

    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定
    g.fillText(day + "日目",WIDTH/27,HEIGHT / 18)

    DrawLife(0);

    g.fillStyle = "rgba(255,30,30,1)";
    g.fillRect(WIDTH/4.25,HEIGHT/6.9,(WIDTH/3.55)/100 * life,HEIGHT/53);


    DrawStatus(g);
    DrawG(g);

    g.fillStyle = WNDSTYLE

    if(mPhase == 0){
        DrawMenu(g);
    }

    if(mPhase == 1){
        DrawMenu(g);
    }
    if(mPhase == 2){
        Drawwork(g);
        DrawLife(-15);
        day++;
    }
    if(mPhase == 3){
        DrawLife(20);
        mPhase = 0;
        day++;
    }
    if(mPhase == 4){
        DrawMenu(g);
    }
    if(mPhase == 5){
        console.log("アイテム確認");
        mPhase = 0;
    }
    if(mPhase == 9){
        if(life != 100){
        state = state.map(value => Math.ceil(value * 0.8));
        MyG /= 2;
        day += 3;
        }        
        life = 50; 
        mPhase = 0;
    }
    if((day %= 30) == 0){
        bPhase = 1;
        Battle();
    }
}

function Battle(){   
}


function WmPaint() // グラフィック系のファンクション
{
    DrawMain();

    const ca = document.getElementById("main");// mainキャンバスの要素を取得
    const g = ca.getContext("2d");             // 2D描画コンテキストを取得


    g.drawImage(gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight); // 仮想画面のイメージを実画面へと転送

}



function DrawMain() 
{

    const g = gScreen.getContext("2d");             // 仮想画面の2D描画コンテキスト

    DrawHome(g);
}



// ブラウザサイズが変更された際、キャンバスの大きさを変更する
function WmSize()
{
    const ca = document.getElementById("main");// mainキャンバスの要素を取得
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


function WmTimer()
{
    gFrame++;                                  // 内部カウンタを加算
    WmPaint();
}


window.onkeydown = function (ev) {
    let c = ev.keyCode;     // キーコード取得
    if (gIsKeyDown[c]) {    // 既にキーが押されている場合は処理しない
        return;
    }
    gIsKeyDown[c] = true;

    const Cursor = GetMenu();
    var length = Object.keys(Cursor.Cm).length;


    // キーボードの右キーが押された場合
    if (c === 39) {
        // gCursorXが最大値に達していない場合に1増やす


        if (gCursorX < Cursor.Cx - 1) {
            gCursorX++;
        }
        else if(gCursorY <= Cursor.Cy-1){
            gCursorY++;
            gCursorX = 0;
        }
        if(length-1 <  Cursor.Cx * gCursorY + (gCursorX + 1)){
            gCursorX = 0;
            gCursorY = 0;
        }
    }
    // キーボードの左キーが押された場合
    if (c === 37) {
        // gCursorXが最小値に達していない場合に1減らす
        if (gCursorX > 0) {
            gCursorX--;
        }
        else if(gCursorY != 0){
            gCursorY--;
            gCursorX = Cursor.Cx - 1;
        }else{
            gCursorY = Cursor.Cy - 1
            if(Cursor.Cy != 1){
                gCursorX = length % Cursor.Cy;
            }else{
                gCursorX = Cursor.Cx - 1
            }
        }
    }
}



window.onkeyup = function (ev) {
    let c = ev.keyCode;     // キーコード取得
    gIsKeyDown[c] = false;

    let nowCursor = (gCursorY == 0) ? gCursorX+1 :gCursorY+2 * 2 -1 + gCursorX+1;

    if(c == 13 || c == 90){             //Enterキー、またはzキーの場合
        
        if(mPhase == 0){
            mPhase = nowCursor;
            gCursorX = 0;
            gCursorY = 0;
            console.log(mPhase);
        }
        else if(mPhase == 1){
            Drawgrowth(gCursorX);
            mPhase = 0;
            gCursorX = 0;
            gCursorY = 0
            DrawLife(-10);
        }
        else if(mPhase == 2){
        }
        else if(mPhase == 3){
        }
        else if(mPhase == 4){ 
            Shop();
            mPhase = 0;
            gCursorX = 0;
            gCursorY = 0;
        }
    }
}



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
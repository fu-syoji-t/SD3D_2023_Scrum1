"use strict";


const M_HEIGHT = 32;                      //モンスターチップの幅
const M_WIDTH = 31;                       //モンスターチップの高さ


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



const FONTSTYLE     = "#ffffff";                   //文字色
const INTERVAL      = 66;                          //フレーム呼び出し感覚
const gFileMonster  = "img/mob_icon.png"           //画像。テスト
const HEIGHT        = 1000;                        //仮想画面サイズ、高さ
const WIDTH         = 1000;                        //仮想画面サイズ、幅

const Start_placeX = Math.floor(WIDTH/ 4.8);       //モンスターの開始縦位置 
const Start_placeY = Math.floor(HEIGHT / 8);       //モンスターの開始横位置


const MWNDSTYLE     = "rgba(203,244,255,1)"        //モンスターウインドウの色
const WNDSTYLE      = "rgba(0,0,0,0.75)"           //ウインドウの色


const SelectMenu = [/*"今日は何をしますか？",*/"鍛える","働く","休む","買い物","アイテム"];
const TrainingMenu = [/*"何を鍛えますか？",*/"体力","力","守り","速さ","やめる"];

const ShopMenu = {/*null:null,*/"薬草": 200,"中薬草": 400,"上薬草": 800,"スライム餅": 0};

const Item_Text = ["体力が30回復する","体力が60回復する","体力が100回復する","体力を０にする"]
const MyItem = {"薬草":5,"中薬草":1,"上薬草":1,"スライム餅":1};     //所持アイテム
                                      //所持しているアイテムのみを抽出する配列

const ItemEffect_list = {0:30,0:60,0:100,1:null};
const ItemEffect = [
    function add(a) {
        return life + a;
    },
    function subtract(a) {
        return life = 0;
    },
];


const menuItems = Object.keys(ShopMenu);
const gKey = new Uint8Array(0x100);                     //キーボード情報を取得


const audio = new Audio('BGM/MusMus-BGM-033.mp3');      //BGMを取得
const button_se = new Audio('SE/音人ボタン音47.mp3');   //ボタンを押した際のSEを取得


let isAudioPlaying = false;                             //SEが再生中かどうかを判定する

let life = 100                                 //モンスターのスタミナ

let MyG = 100000;                                 //所持ゴールド

let gMessage1 = null;
let gMessage2 = null;
let gMessage3 = null;

let gCursorX = 0;                              //カーソルの横位置                      
let gCursorY = 0;                              //カーソルの縦位置
let Cursor = (gCursorY == 0) ? gCursorX :gCursorY * 2 + gCursorX;
let gFrame = 0;                                //内部カウンタ
let gWidth;                                    //実画面の幅
let gHeight;                                   //実画面の高さ
let gImgMonster;                               //画像。テスト
let Monster_number = 1;                        //モンスターの番号
let gScreen;                                   //仮想画面
let gIsKeyDown = {};                           //キーが押されているかどうかを示すオブジェクト
let mPhase = 0;                                //モンスター育成画面のフェーズ
let bPhase = 0;                                //戦闘画面のフェーズ
let day = 1;                                   //育成画面での経過日数

let now_placeX = Start_placeX;                 //現在のモンスターの縦位置
let now_placeY = Start_placeY;                 //現在のモンスターの横位置 
let randomX = null;                            //モンスターを動かす縦位置
let randomY = null;                            //モンスターを動かす横位置

import{play_data} from './db.js';
play_data()
    .then(function(data) {
        // データを処理
        console.log(data)

        SetState(data);
    });
    
function SetState(data){

    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (!isNaN(data[i][key])) {
                data[i][key] = parseInt(data[i][key]);
            }
        }
    }

    console.log(data)

    let gMHP = data[0].hp;
    let gATK = data[0].atk;
    let gDFE = data[0].def;
    let gAGI = data[0].agi;

    let state = [ gMHP,gATK,gDFE,gAGI];


//画像の読み込みを行う関数
function LoadImage()
{
    gImgMonster    = new Image(); gImgMonster.src    = gFileMonster;         // モンスター画像読み込み
}


//メニュー画面を取得し、行数と列数を返す関数
function GetMenu(){
    let Cm=0;let Cx=0; let Cy=0;
    if(mPhase == 0){
        Cm = SelectMenu;    Cx = 4; Cy = 2; 
    }else if(mPhase == 1){
        Cm = TrainingMenu;  Cx = 4; Cy = 2;
    }else if(mPhase == 4){
        Cm = ShopMenu;      Cx = 2; Cy = 2;
    }else if(mPhase == 5){
        let count = 0
        for (const itemName in MyItem) {
            if (MyItem[itemName] !== 0) {
                count++;
            }
        }
        console.log("a"+count);
        var length = Math.floor(count / 2);
        console.log("b"+length);
        Cm = MyItem;      Cx = 2; Cy = length;
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

    g.fillText("体力:"+ state[0], WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 0);             // Lv
    g.fillText("　力:" + state[1], WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 1);             // HP
    g.fillText("守り:" + state[2], WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 2);             // 経験値
    g.fillText("速さ:" + state[3], WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 3);             // 経験値
}


//所持金を表示する関数
function DrawG(g)
{
    g.fillStyle = WNDSTYLE;
    g.fillRect(WIDTH - WIDTH/4, HEIGHT/2, WIDTH/4.1, HEIGHT/6.3);   //所持金を描画するウインドウ

    g.font = FONT;                                  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定  

    g.fillText("所持ゴールド", WIDTH - WIDTH/4.2, HEIGHT/1.8);        
    g.fillText(MyG + "G", WIDTH - WIDTH/4.2, HEIGHT/1.6);           // 所持ゴールドを表示するテキスト
}

//新しいテキストを入力する前にウインドウをリセットする関数
function ResetWND(g)
{
    g.fillStyle = WNDSTYLE;
    g.fillRect(WIDTH/80, HEIGHT / 2 + HEIGHT/5.4 ,WIDTH/1.37 , WIDTH/3.3);     // 短形描画
}


//メニュー画面を描画する関数

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

function DrawMenu(g)
{
    ResetWND(g);
    let Menu = GetMenu();

    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定

    var Mlength = Object.keys(Menu.Cm).length;
    
    let CountMenu = 0;

    //g.fillText(Menu.Cm[0], WIDTH/28,HEIGHT / 1.32);
    
        for(let y=0; y<Menu.Cy; y++){
            for(let x=0; x<Menu.Cx; x++){
                
                    g.fillText( "　"+Menu.Cm[CountMenu] , WIDTH / 28 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8) ,HEIGHT / 1.32 + HEIGHT /11.5 * (y+1));
                
                CountMenu += 1;
            if(Mlength-1 < CountMenu){
                break;
        }
    }
}

g.fillText("⇒", WIDTH / 28 +(WIDTH / 1.2 / Menu.Cx) * gCursorX * 0.8, HEIGHT / 1.32 + HEIGHT /11.5 * (gCursorY + 1));
}

function ItemText(g){

    const key = Object.keys(ShopMenu);
    const NCursor = (gCursorY == 0) ? gCursorX :gCursorY * 2 + gCursorX
    const now_item = key[NCursor];
    const Item_description = Item_Text[NCursor]


    if(mPhase == 4){
        SetText(g,"何を購入しますか？",now_item,Item_description)
    }else if(mPhase == 5){

        SetText(g,"どのアイテムを使いますか？",now_item,Item_description)
    }
    console.log(mPhase);
}

function DrawShopMenu(g){

    g.fillRect(WIDTH / 70,HEIGHT / 70,WIDTH - WIDTH /3.5,HEIGHT/1.52);

    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定

    
    let Menu = GetMenu();

    ItemText(g);

    //let First = true;
    let x = 0;
    let y = 0;
    Object.keys(ShopMenu).forEach(function(productName) {
        /*if (First) {
            First = false; // 最初の要素をスキップ
            return; // continueのように処理をスキップして次の要素へ
        }
        */

        const price = ShopMenu[productName]; // 二つ目の要素（価格）を取得
        g.fillText(`　${productName}:${price}G`, WIDTH / 28 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8), HEIGHT / 700 + HEIGHT /11.5 * (y+1));
        
        x = x + 1;
        if (x >= Menu.Cx) {
            x = 0;
            y++;
        }
    });       
    g.fillText("⇒", WIDTH / 28 +(WIDTH / 1.2 / Menu.Cx) * gCursorX * 0.8, HEIGHT / 700 + HEIGHT /11.5 * (gCursorY + 1));
}


//ショップ画面での購入処理を行う関数
function Shop()
{
    let buy_Item = (gCursorY == 0) ? gCursorX :gCursorY * 2 + gCursorX;

    console.log(buy_Item)

        const selectedItem = menuItems[buy_Item];
        const price = ShopMenu[selectedItem];; // 項目の価格を取得
        console.log("商品名："+selectedItem+"　値段："+price)
        if(MyG >= price){
        MyItem[selectedItem]++;
        MyG -= price;
    }
}


//アイテムを確認する項目を描画する関数
function ItemCheck(g){
    ResetWND(g);
    g.fillStyle = WNDSTYLE;
    g.fillRect(WIDTH / 70,HEIGHT / 70,WIDTH - WIDTH /3.5,HEIGHT/1.52);

    let x = 0;
    let y = 0;
    let length = 0;
    ItemText(g);

    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定

    let Menu = GetMenu();

    Object.keys(Menu.Cm).forEach(function(productName) {

        const possessions = MyItem[productName]; // 二つ目の要素（価格）を取得

        if(possessions != 0){
        g.fillText(`　${productName}:${possessions}個`, WIDTH / 28 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8), HEIGHT / 700 + HEIGHT /11.5 * (y+1));
        }

        x = x + 1;
        if (x >= Menu.Cx) {
            x = 0;
            y++;
        }
    });

    g.fillText("⇒", WIDTH / 28 +(WIDTH / 1.2 / Menu.Cx) * gCursorX * 0.8, HEIGHT / 700 + HEIGHT /11.5 * (gCursorY + 1));

}


function Use_Item(){
    /*const MyItem = {"薬草":5,"中薬草":1,"上薬草":1,"スライム餅":1}; 
    const ItemEffect_list = {0:30,0:60,0:100,1:null};
    const ItemEffect = [
        function add(a) {
            return life + a;
        },
        function subtract(a) {
            return life = 0;
        },
    ];*/

    const select_Item = (gCursorY == 0) ? gCursorX :gCursorY * 2 + gCursorX
    ;

    var length = Object.keys(MyItem).length


}


function SetText(g,M1,M2,M3){
    ResetWND(g);

    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定

    g.fillText(M1, WIDTH / 28 ,HEIGHT / 1.32 + HEIGHT /11.5 * 0);
    g.fillText(M2, WIDTH / 28 ,HEIGHT / 1.32 + HEIGHT /11.5 * 1);
    g.fillText(M3, WIDTH / 28 ,HEIGHT / 1.32 + HEIGHT /11.5 * 2);
}



//モンスターを鍛えた際、成長値を決定する関数
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


//ランダムな値を返す関数
function RandomUp()
{
   const random = Math.random() * 100;
   return random <= 1 ? '1' : random <= 25 ? '2' : random <= 98 ? '3' : '4';
}


//モンスターを移動させる関数
function moovMonster(){
    if(randomX != null && randomY != null){
    if(now_placeX < randomX){
        now_placeX += 1;
    }else if(now_placeX > randomX){
        now_placeX -= 1;
    if(now_placeY < randomY){
        now_placeY += 1;
    }else if(now_placeY > randomY){
        now_placeY -= 1;
    }
    }
}
}


//モンスターを描画する関数
function DrawMonster(g){

    g.drawImage(gImgMonster,Monster_number-1,0, M_WIDTH , M_HEIGHT 
    ,now_placeX ,now_placeY,
    WIDTH/3,HEIGHT/3);
    moovMonster();
        
    g.fillStyle = WNDSTYLE;                             // ウインドウの色
    g.fillRect(WIDTH/80,HEIGHT/80,WIDTH/7,65);          //日数を表記するウインドウ
    
    g.fillRect(now_placeX + WIDTH / 39 ,now_placeY-WIDTH/200,WIDTH/3.5,HEIGHT/45); //ライフバー（黒）を表記するウインドウ
    
    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定
    g.fillText(day + "日目",WIDTH/27,HEIGHT / 18)   // 日数を表記するテキスト
    
    DrawLife(0);
    
    g.fillStyle = "rgba(255,30,30,1)";
    g.fillRect(now_placeX + WIDTH / 35.5,now_placeY-WIDTH/300,(WIDTH/3.55)/100 * life,HEIGHT/53);    //ライフバー（赤）を表記するウインドウ
    
}


//モンスターのライフバーを描画する関数
function DrawLife(L_moov)
{

    life = life + L_moov;
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
    audio.play();
    g.fillStyle = "#F0E68C";								//	背景色
	g.fillRect( 0, 0, WIDTH, HEIGHT );                      //  背景設定
 
    g.fillStyle = MWNDSTYLE;                            
    g.fillRect(0,0,WIDTH - WIDTH /3.9,HEIGHT/1.52);         //モンスターウインドウ

    DrawMonster(g);                                         //モンスターを描画する関数
   
    DrawStatus(g);                                          //ステータスウインドウを描画する関数
    DrawG(g);                                               //所持ゴールドウインドウを描画する関数

    g.fillStyle = WNDSTYLE

    if(mPhase == 0){
        DrawMenu(g);                                        //セレクトメニュー画面を描画する
    }

    if(mPhase == 1){
        DrawMenu(g);                                        //トレーニングメニュー画面を描画する
    }
    if(mPhase == 2){
        Drawwork(g);                                        //働いた際の処理を行う
        DrawLife(-15);
        day++;
    }
    if(mPhase == 3){
        DrawLife(20);                                       //休んだ際の処理を行う
        mPhase = 0;
        day++;
    }
    if(mPhase == 4){                                        //買い物をした際の処理を行う
        DrawShopMenu(g);
    }
    if(mPhase == 5){                                        //アイテムを確認する処理を行う
        ItemCheck(g);
    }
    if(mPhase == 9){                                        //体力がなくなった際の処理を行う
        if(life == 0){     
        SetText(g,"モンスターの体力が無くなってしまった！","モンスターの能力が下がった。","回復の為に三日間休んだ。")
        state = state.map(value => Math.ceil(value * 0.8));
        day += 3;
        life = 50;
        }        
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

const M_moov = function(){

    randomX = Math.floor(Math.random() * ((WIDTH - WIDTH /3.9) - WIDTH/3 - 0 + 1)) + 0;
    randomY = Math.floor(Math.random() * ((HEIGHT/1.52 - 0 + 1) - HEIGHT/3 + 0));

    //now_placeX = randomX; now_placeY = randomY; 
}

window.onkeydown = function (ev) {
    let c = ev.keyCode;     // キーコード取得
    if (gIsKeyDown[c]) {    // 既にキーが押されている場合は処理しない
        return;
    }
    gIsKeyDown[c] = true;

    const Cursor = GetMenu();
    var length = Object.keys(Cursor.Cm).length + 1;


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
        if(length-2 <  Cursor.Cx * gCursorY + (gCursorX)){
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
    console.log("X:"+ gCursorX+" Y:"+gCursorY);
    
}



window.onkeyup = function (ev) {
    let c = ev.keyCode;     // キーコード取得
    gIsKeyDown[c] = false;
    
    let nowCursor = (gCursorY == 0) ? gCursorX+1 :gCursorY+2 * 2 -1 + gCursorX+1;

    if(c == 13 || c == 90){             //Enterキー、またはzキーの場合
        
        button_se.play();

        if (isAudioPlaying) {
            button_se.currentTime = 0;
        }

        isAudioPlaying = true;


        if(mPhase == 0){
            mPhase = nowCursor;
            gCursorX = 0;
            gCursorY = 0;
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
        else if(mPhase == 5){
            mPhase = 0;
            gCursorX = 0;
            gCursorY = 0
        }
    }
    console.log(nowCursor);
}


button_se.addEventListener('ended', function () {
    isAudioPlaying = false;
});

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
    setInterval(M_moov, 6000); 
}


}
"use strict";

const ca = document.getElementById("main");// mainキャンバスの要素を取得
const g = ca.getContext("2d");             // 2D描画コンテキストを取得



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
    FONT = '33px CustomFont'; // フォントファミリー名を設定
    // ここでフォントのスタイルを適用する他の部分のコードを追加
})
//---------------------------------------------------------



const FONTSTYLE     = "#ffffff";                   //文字色
const INTERVAL      = 66;                          //フレーム呼び出し感覚
const gFileMonster  = "img/mob_icon.png"           //画像。テスト
const gFileMonster2  = "img/mob_icon.png"           //画像。テスト
const HEIGHT        = 1000;                        //仮想画面サイズ、高さ
const WIDTH         = 1000;                        //仮想画面サイズ、幅

const Start_placeX = Math.floor(WIDTH/ 4.8);       //モンスターの開始縦位置 
const Start_placeY = Math.floor(HEIGHT / 8);       //モンスターの開始横位置


const MWNDSTYLE     = "rgba(203,244,255,1)"        //モンスターウインドウの色
const WNDSTYLE      = "rgba(0,0,0,0.75)"           //ウインドウの色


const SelectMenu   = [/*"敵が現れた",*/"行動する","逃げる"];
const ActionMenu = [/*"何をしますか？",*/"戦う","特技","アイテム","やめる"];
const FightMenu = [/*"何をしますか？",*/"はたく","蹴る","鳴き声","破壊光線"];
const SpecialMenu = [/**特技のあれを使いますか */"使う","やめる"];
const TestMenu= ["育成画面に戻る"];

const gKey = new Uint8Array(0x100);                     //キーボード情報を取得


const audio = new Audio('BGM/MusMus-BGM-033.mp3');      //BGMを取得
const button_se = new Audio('SE/音人ボタン音47.mp3');   //ボタンを押した際のSEを取得


let isAudioPlaying = false;                             //SEが再生中かどうかを判定する

let gMessage1 = null;
let gMessage2 = null;
let gMessage3 = null;

let gCursorX = 0;                              //カーソルの横位置                      
let gCursorY = 0;                              //カーソルの縦位置
let Cursor = (gCursorY == 0) ? gCursorX :gCursorY * 2 + gCursorX;
let gFrame = 0;                                //内部カウンタ
let gWidth;                                    //実画面の幅
let gHeight;                                   //実画面の高さ
let gImgMonster;                               //画像。テスト                              //画像。テスト 
let Monster_number = 1;                        //モンスターの番号
let gScreen;                                   //仮想画面
let gIsKeyDown = {};                           //キーが押されているかどうかを示すオブジェクト
let mPhase = 0;                                //モンスター育成画面のフェーズ
let bPhase = 0;                                //戦闘画面のフェーズ

let now_placeX = Start_placeX;                 //現在のモンスターの縦位置
let now_placeY = Start_placeY;                 //現在のモンスターの横位置 
let randomX = null;                            //モンスターを動かす縦位置
let randomY = null;                            //モンスターを動かす横位置

let pDogge;
let eDogge;
let random; 
let min = 1;
let max = 100;
let dmg;

let mHp
let eHp


import{load_data,save_item,save_state} from './db.js';

const shared ={};



async function play_data(){

    const state  =  await  load_data("state");    
    const item   =  await  load_data("item");
    const myitem =  await  load_data("myitem");
    const enemy  =  await  load_data("enemy");

    shared.state = Setdata(state,);
    shared.item = Setdata(item);
    shared.myitem = Setdata(myitem);
    shared.enemy = Setdata(enemy);

    console.log(state);
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


async function updata_item(){
    if (shared.myitem.length > 0){
    for(const myitem of shared.myitem){
        console.log(myitem.item_name);
    save_item(myitem.item_id,myitem.item_number);
    }
}
}
async function updata_state(){
    console.log("id"+shared.state[0].monster_id
    +"gold"+ shared.state[0].my_gold
    +"day"+ shared.state[0].day
    +"life"+shared.state[0].life
    +"hp"+shared.state[0].hp
    +"atk"+shared.state[0].atk
    +"def"+shared.state[0].def
    +"agi"+shared.state[0].agi);

    save_state(shared.state[0].monster_id,
               shared.state[0].my_gold,
               shared.state[0].day,
               shared.state[0].life,
               shared.state[0].hp,
               shared.state[0].atk,
               shared.state[0].def,
               shared.state[0].agi,
    )
}


//画像の読み込みを行う関数
function LoadImage()
{
    gImgMonster    = new Image(); gImgMonster.src    = gFileMonster;         // モンスター画像読み込み
}


//メニュー画面を取得し、行数と列数を返す関数
function GetMenu(){
    let Cm=0;let Cx=0; let Cy=0;
    if(mPhase == 0){
        Cm = SelectMenu;    Cx = 2; Cy = 1; 
    }else if(mPhase == 1){
        Cm = ActionMenu;  Cx = 4; Cy = 1;
    }else if(mPhase == 3){
        Cm = FightMenu;  Cx = 4; Cy = 1;
    }else if(mPhase == 3){
        Cm = SpecialMenu;  Cx = 4; Cy = 1;
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

    g.fillText("体力:" + shared.enemy[0].enemy_hp, WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 0);             // Lv
    g.fillText("力:" + shared.enemy[0].enemy_atk, WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 1);             // HP
    g.fillText("守り:" + shared.enemy[0].enemy_def, WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 2);             // 経験値
    g.fillText("速さ:" + shared.enemy[0].enemy_agi, WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 3);             // 経験値
}
function LoadImage2()
{
    gImgMonster    = new Image(); gImgMonster.src    = gFileMonster;         // モンスター画像読み込み
}

function DrawMymon(g)
{
    g.fillStyle = WNDSTYLE;         // ウインドウの色
    g.fillRect(WIDTH - WIDTH/4, HEIGHT/2, WIDTH/4.1, HEIGHT/2.8);     // 短形描画

}

//新しいテキストを入力する前にウインドウをリセットする関数
function ResetWND(g)
{
    g.fillStyle = WNDSTYLE;
    g.fillRect(WIDTH/80, HEIGHT / 2 + HEIGHT/5.4 ,WIDTH/1.37 , WIDTH/3.3);     // 短形描画
}


//メニュー画面を描画する関数

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
                
                    g.fillText( "　"+Menu.Cm[CountMenu] , WIDTH / 28 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8) ,HEIGHT / 1.32 + HEIGHT /11.5 * (y+1));
                
                CountMenu += 1;
            if(Mlength-1 < CountMenu){
                break;
        }
    }
}

g.fillText("⇒", WIDTH / 28 +(WIDTH / 1.2 / Menu.Cx) * gCursorX * 0.8, HEIGHT / 1.32 + HEIGHT /11.5 * (gCursorY + 1));
}




function DrawShopMenu(g){

    g.fillRect(WIDTH / 70,HEIGHT / 70,WIDTH - WIDTH /3.5,HEIGHT/1.52);

    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定

    
    let Menu = GetMenu();

    ItemText(g);

    //let First = true;
    
    g.fillText("⇒", WIDTH / 28 +(WIDTH / 1.2 / Menu.Cx) * gCursorX * 0.8, HEIGHT / 700 + HEIGHT /11.5 * (gCursorY + 1));
}
          




//アイテムを確認する項目を描画する関数
function ItemCheck(g){
    g.fillStyle = WNDSTYLE;
    g.fillRect(WIDTH / 70,HEIGHT / 70,WIDTH - WIDTH /3.5,HEIGHT/1.52);

    let x = 0;
    let y = 0;

    ItemText(g);

    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定

    let Menu = GetMenu();



    shared.myitem.forEach(function(myitem){

        g.fillText(`　${myitem.item_name}:${myitem.item_number}個`, WIDTH / 28 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8), HEIGHT / 700 + HEIGHT /11.5 * (y+1));

        x = x + 1;
        if (x >= Menu.Cx) {
            x = 0;
            y++;
        }

    g.fillText("⇒", WIDTH / 28 +(WIDTH / 1.2 / Menu.Cx) * gCursorX * 0.8, HEIGHT / 700 + HEIGHT /11.5 * (gCursorY + 1));

})
}

function Use_Item(){
    let Select_Item = (gCursorY == 0) ? gCursorX :gCursorY * 2 + gCursorX;
    console.log(Select_Item);
    console.log(shared.myitem[Select_Item].item_name);
    console.log(shared.myitem[Select_Item].item_effect);
    console.log(shared.state[0].life);
    shared.myitem[Select_Item].item_number--;

    const item_result = eval(shared.myitem[Select_Item].item_effect);


    console.log(shared.state[0].life);

    if(shared.myitem[Select_Item].item_number <= 0){
        shared.myitem.splice(Select_Item, 1);
    }
}

function Drawmessage(g){
    g.font = FONT; g.fillStyle = FONTSTYLE

    g.fillText(gMessage1, WIDTH / 28, HEIGHT / 1.32, HEIGHT / 11.5 * 0);
    g.fillText(gMessage2, WIDTH / 28, HEIGHT / 1.32, HEIGHT / 11.5 * 1);
    g.fillText(gMessage3, WIDTH / 28, HEIGHT / 1.32, HEIGHT / 11.5 * 2);
}

function SetText(M1,M2,M3){
   gMessage1 = M1;
   gMessage2 = M2;
   gMessage3 = M3;
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
        
               // ウインドウの色
    g.fillRect(WIDTH/40,HEIGHT/65,WIDTH/7,65);          //日数を表記するウインドウ
    
    g.fillRect(now_placeX + WIDTH / 39 ,now_placeY-WIDTH/200,WIDTH/3.5,HEIGHT/45); //ライフバー（黒）を表記するウインドウ
    
    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定
    g.fillText(shared.state[0].day + "ターン",WIDTH/27,HEIGHT / 18)   // 日数を表記するテキスト
    
    DrawLife(0);
    
    g.fillStyle = "rgba(255,30,30,1)";
    g.fillRect(now_placeX + WIDTH / 35.5,now_placeY-WIDTH/300,(WIDTH/3.55)/100 * shared.state[0].life,HEIGHT/53);    //ライフバー（赤）を表記するウインドウ
    
}


//モンスターのライフバーを描画する関数
function DrawLife(L_moov)
{

    shared.state[0].life = shared.state[0].life + L_moov;
    if(shared.state[0].life >= 100){
        shared.state[0].life = 100;
    }
    if(shared.state[0].life <= 0){
        shared.state[0].life = 0;
    }

    if(shared.state[0].life <= 0){
        mPhase = 9; 
    }                                                                                                                             
}

function gAttack(){
    SetText("味方のモンスターの攻撃！","","") 
    random = Math.floor(Math.random() * (max - min) + min);
    //console.log(random);
    if((95 - eDogge) >= random){
        console.log("命中")
        dmg = Math.ceil((shared.state[0].atk * 20) / shared.enemy[0].enemy_def);
        eHp -= dmg;
    }else{
        dmg = 0;
        console.log("当たらなかった！")
    }
        console.log("ダメージ数：" + dmg);

}

function eAttack(){
    SetText("敵のモンスターの攻撃！","","") 
    random = Math.floor(Math.random() * (max - min) + min);
    //console.log(random);
    if((95 - pDogge) >= random){
        console.log("命中")
        dmg = Math.ceil((shared.enemy[0].enemy_atk * 20) / shared.state[0].def);
        mHp -= dmg;
    }else{
        dmg = 0;
        console.log("当たらなかった！")
    }
        console.log("ダメージ数：" + dmg);
}

function bAttack(){
    if(shared.state[0].agi < shared.enemy[0].enemy_agi){
        eDogge = (shared.enemy[0].enemy_agi - shared.state[0].agi) * 0.1;
        pDogge = 0;
    }else{
        pDogge = (shared.state[0].agi - shared.enemy[0].enemy_agi) * 0.1;
        eDogge = 0;
    }

    if(shared.state[0].agi < shared.enemy[0].enemy_agi){
        eAttack();
        /*
        if(gHP > 0){
            gAttack();
        }
        */
        gAttack();
        /*
        if(eHP > 0){
            eAttack();
        }
        */
    }
    /*
    if(eHP <= 0 || gHP <= 0){
        console.log("バトル終了！")
    }
    */
}

function day_puls(){
    shared.state[0].day += 1
}

function NowCursor(){
    var Cursor = (gCursorY == 0) ? gCursorX :gCursorY * 2 + gCursorX;
}

//ホーム画面を描写する関数
function DrawHome(g)
{

    audio.play();
    g.fillStyle = "#F0E68C";								//	背景色
	g.fillRect( 0, 0, WIDTH, HEIGHT );                      //  背景設定
    ResetWND(g)


    g.fillStyle = MWNDSTYLE;                            
    g.fillRect(0,0,WIDTH - WIDTH /3.9,HEIGHT/1.52);         //モンスターウインドウ

    DrawMymon(g);                                           //自分のモンスターを表示

    DrawMonster(g);
    DrawMonster2(g);                                //モンスターを描画する関数
   
    DrawStatus(g);                                          //ステータスウインドウを描画する関数
    //DrawG(g);                                               //所持ゴールドウインドウを描画する関数

    g.fillStyle = WNDSTYLE

    if(mPhase == 0){
        DrawMenu(g);                                        //セレクトメニュー画面を描画する
        SetText("敵が現れた","","");
    }

    if(mPhase == 1){
        DrawMenu(g);                                        //トレーニングメニュー画面を描画する
        SetText("何をしますか","","");
    }
    if(mPhase == 2){
        /*
        bAttack();
        SetText(g,"通常攻撃！","","")                 //逃げるを選択した時の処理
        */
    }
    if(mPhase == 3){
        DrawMenu(g);
        SetText("あなたの負けです","","")                 //逃げるを選択した時の処理
    }
    Drawmessage(g);
}

function DrawMonster2(g){
    g.fillStyle = "rgba(255,30,30,1)";
    g.fillRect(now_placeX + WIDTH / 35.5,now_placeY-WIDTH/300,(WIDTH/3.55)/100 * shared.state[0].life,HEIGHT/53);    //ライフバー（赤）を表記するウインドウ

    g.drawImage(gImgMonster,Monster_number-1,0, M_WIDTH , M_HEIGHT,760, HEIGHT/1.9, WIDTH/6, HEIGHT/4,
    WIDTH/5,HEIGHT/5);
    
    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定
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

    const g = gScreen.getContext("2d");            // 仮想画面の2D描画コンテキスト

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
            if(nowCursor == 1){
                bAttack();
                gCursorX = 0;
                gCursorY = 0;
                mPhase = 2;
            }else if(nowCursor == 2){
                gCursorX = 0;
                gCursorY = 0;
                mPhase = 3;
            }else if(nowCursor == 3){
                gCursorX = 0;
                gCursorY = 0;
                mPhase = 4;
            }else if(nowCursor == 4){
                gCursorX = 0;
                gCursorY = 0;
                mPhase = 0;
            }
            /*
            mPhase = 1;
            gCursorX = 1;
            gCursorY = 0;
            */
        }
        else if(mPhase == 2){
            
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

    play_data();
    WmSize();
    window.addEventListener("resize", function () { WmSize() }); // ブラウザサイズ変更時、WmSize()が呼ばれるよう指示
    setInterval(function () { WmTimer() }, INTERVAL); 
    //WmPaint();
    setInterval(M_moov, 6000); 
}

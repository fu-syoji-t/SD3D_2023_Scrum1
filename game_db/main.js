"use strict";

const M_HEIGHT = 32;                      //モンスターチップの幅
const M_WIDTH = 32;                       //モンスターチップの高さ

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
const HEIGHT        = 1000;                        //仮想画面サイズ、高さ
const WIDTH         = 1000;                        //仮想画面サイズ、幅

const Start_placeX = Math.floor(WIDTH/ 4.8);       //モンスターの開始縦位置 
const Start_placeY = Math.floor(HEIGHT / 8);       //モンスターの開始横位置


const MWNDSTYLE     = "rgba(203,244,255,1)"        //モンスターウインドウの色
const WNDSTYLE      = "rgba(0,0,0,0.75)"           //ウインドウの色


const SelectMenu   = ["鍛える","働く","休む","買い物","アイテム","とくぎ","進化","セーブ"];
const TrainingMenu = ["体力","力","守り","速さ","やめる"];
const WorkMenu     = ["果物屋","大工の手伝い","モンスター退治","やめる"];
const restMenu     = ["家で休む:0G","街で遊ぶ:200G","旅行する:500G","やめる"];
const SkillMenu    = ["特技を覚える","特技をセットする"];
const ChoiceMenu   = ["はい","いいえ"];

const state_point  = ["hp","atk","def","agi"];

const gKey = new Uint8Array(0x100);                     //キーボード情報を取得


const audio = new Audio('BGM/MusMus-BGM-033.mp3');      //BGMを取得
const button_se = new Audio('SE/音人ボタン音47.mp3');   //ボタンを押した際のSEを取得


let isAudioPlaying = false;                             //SEが再生中かどうかを判定する

let gMessage1 = null;
let gMessage2 = null;
let gMessage3 = null;

let setskill = [null,null,null,0];
let SkillCursor

let Cursor = 0;
let gCursorX = 0;                              //カーソルの横位置                      
let gCursorY = 0;                              //カーソルの縦位置
let gFrame = 0;                                //内部カウンタ
let gWidth;                                    //実画面の幅
let gHeight;                                   //実画面の高さ
let gImgMonster;                               //画像。テスト
let gImgEMonster
let Monster_number = 0;                        //モンスターの番号
let gScreen;                                   //仮想画面
let gIsKeyDown = {};                           //キーが押されているかどうかを示すオブジェクト
let mPhase = 0;                                //モンスター育成画面のフェーズ
let bPhase = 0;                                //戦闘画面のフェーズ

let CLife = 0;
let CGold = 0;
let ShopFlag = "";
let evolution_monster = 0;

let now_placeX = Start_placeX;                 //現在のモンスターの縦位置
let now_placeY = Start_placeY;                 //現在のモンスターの横位置 
let randomX = null;                            //モンスターを動かす縦位置
let randomY = null;                            //モンスターを動かす横位置

let befor_state;                               //更新前のステータス
let after_state;                               //更新後のステータス

import{load_data,save_item,save_state,save_skill} from './db.js';

const s ={};

async function play_data(){

    const state    =  await  load_data("state");    
    const monster  =  await  load_data("monster");    
    const item     =  await  load_data("item");
    const myitem   =  await  load_data("myitem");
    const skill    =  await  load_data("skill");
    const myskill  =  await  load_data("myskill");

    s.state   =  Setdata(state);
    s.monster =  Setdata(monster);
    s.item    =  Setdata(item);
    s.myitem  =  Setdata(myitem);
    s.skill   =  Setdata(skill);
    s.myskill =  Setdata(myskill);
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
    if (s.myitem.length > 0){
        for(const myitem of s.myitem){
            save_item(myitem.item_id,myitem.item_number);
        }
    }
}

async function updata_skill(){
    if (s.myskill.length > 0){
        for(const myskill of s.myskill){
        save_skill(myskill.skill_id);
        }
    }
}

async function updata_state(){
    console.log("id"+s.state[0].monster_id
    +"gold"+ s.state[0].my_gold
    +"day"+ s.state[0].day
    +"life"+s.state[0].life
    +"hp"+s.state[0].hp
    +"atk"+s.state[0].atk
    +"def"+s.state[0].def
    +"agi"+s.state[0].agi);

    save_state(s.state[0].monster_id,
               s.state[0].my_gold,
               s.state[0].day,
               s.state[0].life,
               s.state[0].hp,
               s.state[0].atk,
               s.state[0].def,
               s.state[0].agi,
    )
}

//画像の読み込みを行う関数
function LoadImage()
{
    gImgMonster    = new Image(); gImgMonster.src = "img/" + s.monster[s.state[0].monster_id - 1].monster_image;         // モンスター画像読み込み
    gImgEMonster   = new Image(); gImgMonster.src = "img/" + s.monster[evolution_monster].monster_image;
}

//メニュー画面を取得し、行数と列数を返す関数
function GetMenu(){
    let Cm=0;let Cx=0; let Cy=0;
    if(mPhase == 0){
        Cm = SelectMenu;    Cx = 4; Cy = 2; 
    }else if(mPhase == 1){
        Cm = TrainingMenu;  Cx = 4; Cy = 2;
    }else if(mPhase == 2){
        Cm = WorkMenu;      Cx = 2; Cy = 2; 
    }else if(mPhase == 3){
        Cm = restMenu;      Cx = 2; Cy = 2; 
    }else if(mPhase == 4){
        Cm = s.item;   Cx = 2;;
        var i_length  = s.item.length;
        Cy = Math.ceil(i_length / 2);
    }
    else if(mPhase == 5){
        Cm = s.myitem; Cx = 2;

        var mi_length = s.myitem.length;
        Cy = Math.ceil(mi_length / 2);
    }
    else if(mPhase == 6){
        Cm = SkillMenu;      Cx = 2; Cy = 1; 
    }
    else if(mPhase == 61){
        Cm = s.skill; Cx = 2;

        var s_length = s.skill.length;
        Cy = Math.ceil(s_length / 2);
    }
    else if(mPhase == 61.5){
        var SetSkill_name = [];
        for(var i=0;i < 4;i++){
            if(setskill[i] === null){
                SetSkill_name[i] = "未登録"
            }else{
                SetSkill_name[i] = s.skill[setskill[i]].skill_name;
            }
        }
        Cm = SetSkill_name; Cx = 2; Cy = 2;
    }
    else if(mPhase == 62.5){
        Cm = s.myskill; Cx = 2;

        var ms_length = s.myskill.length;
        Cy = Math.ceil(ms_length / 2);
    }
    else if(mPhase == 7){
        Cm = s.monster; Cx = 1;

        var dm_length = s.monster.length;
        Cy = Math.ceil(dm_length / 2);
    }
    else if(mPhase == 71){
        Cm = ChoiceMenu;      Cx = 2; Cy = 1;
    }
    else if(mPhase == 8){
        Cm = ChoiceMenu;      Cx = 2; Cy = 1;
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

    var monster_id = s.state[0].monster_id - 1

    g.fillText("体力:" + s.state[0].hp  * s.monster[monster_id].correction_hp,  WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 0);             // Lv
    g.fillText("　力:" + s.state[0].atk * s.monster[monster_id].correction_atk, WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 1);             // HP
    g.fillText("守り:" + s.state[0].def * s.monster[monster_id].correction_def, WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 2);             // 経験値
    g.fillText("速さ:" + s.state[0].agi * s.monster[monster_id].correction_agi, WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 3);             // 経験値
}

//所持金を表示する関数
function DrawG(g)
{
    g.fillStyle = WNDSTYLE;
    g.fillRect(WIDTH - WIDTH/4, HEIGHT/2, WIDTH/4.1, HEIGHT/6.3);   //所持金を描画するウインドウ

    g.font = FONT;                                  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定  

    g.fillText("所持ゴールド", WIDTH - WIDTH/4.2, HEIGHT/1.8);        
    g.fillText(s.state[0].my_gold + "G", WIDTH - WIDTH/4.2, HEIGHT/1.6);           // 所持ゴールドを表示するテキスト
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

function ItemText(){
    if(mPhase == 4){
        SetText("何を購入しますか？",s.item[Cursor-1].item_name,s.item[Cursor-1].item_text)
    }
    else if(mPhase == 5){
        if(s.myitem.length > 0){
            SetText("どのアイテムを使いますか？",s.myitem[Cursor-1].item_name,s.myitem[Cursor-1].item_text);
        }else{
            SetText("アイテムを持っていなかった！","お店にアイテムを買いに行こう！",""); 
        }
    }
    else if(mPhase == 61){
        SetText("どの特技を習得しますか？",s.skill[Cursor-1].skill_name,s.skill[Cursor-1].skill_text);
    }
    else if(mPhase == 62.5){
        if(s.myskill.length > 0){
        SetText("どのスキルをセットしますか？",s.skill[s.myskill[0].skill_id - 1].skill_name,s.skill[s.myskill[0].skill_id].skill_text);
        }else{
        SetText("セットできるスキルが無い！！","","");
        }
    }
    else if(mPhase == 7){
        SetText("どのモンスターに進化しますか？",s.monster[Cursor-1].monster_name,s.monster[Cursor-1].monster_text);
    }
}

function DrawShopMenu(g){
    g.fillRect(WIDTH / 70,HEIGHT / 70,WIDTH - WIDTH /3.5,HEIGHT/1.52);
    g.font = FONT; g.fillStyle = FONTSTYLE;

    let Menu = GetMenu();

    ItemText();

    let x = 0; let y = 0;let name; let price
    Menu.Cm.forEach(function(buy){
        if(mPhase == 4){
            name = buy.item_name;  price = buy.item_price;
        }else if(mPhase === 61){
            name = buy.skill_name;
            var S_count = 0 
            s.myskill.forEach(function(ms){
                if(ms.skill_id === buy.skill_id){
                    price = buy.skill_price;
                    price = "習得済み";
                    S_count += 1
                }
            });
            if(S_count === 0){
                price = buy.skill_price
            }
        }else if(mPhase === 62.5){
            
        }
        g.fillText(`　${name}:${price}`, WIDTH / 28 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8), HEIGHT / 700 + HEIGHT /11.5 * (y+1));
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
    const buy_Item = Cursor - 1;

    const selectedItem = s.item[buy_Item].item_name;
    const price        = s.item[buy_Item].item_price;

        console.log("商品名："+ selectedItem +"　値段："+price)
        if(s.state[0].my_gold >= price){
        
            var id = 0
            if (s.myitem.length > 0){
            for(var i=0; s.myitem.length > i; i++){
            if(s.myitem[i].item_id == s.item[buy_Item].item_id){
                s.myitem[i].item_number++,
                id++;

                break;
            }
        }
    }           
    if(id === 0){
        s.myitem.push(
            {  
                item_id      : s.item[buy_Item].item_id,
                item_number  : 1,
                item_name    : s.item[buy_Item].item_name,
                item_effect  : s.item[buy_Item].item_effect,
                item_price   : s.item[buy_Item].item_price,
                item_text    : s.item[buy_Item].item_text  
            })
        }
        console.log(s.myitem);
        s.state[0].my_gold -= price;
        SetText("まいどあり！！","","");
    }else{
        SetText("ゴールドが足りないみたいだ…","","");
    }
}

function SkillShop()
{
    const buy_Skill = Cursor - 1;

    const selectedSkill = s.skill[buy_Skill].skill_name;
    const skillprice    = s.skill[buy_Skill].skill_price;

        console.log("商品名："+ selectedSkill +"　値段："+ skillprice)
        if(s.state[0].my_gold >= skillprice){
        s.myskill.push(
            {
                skill_id      : s.skill[buy_Skill].skill_id,
                skill_name    : s.skill[buy_Skill].skill_name,
                skill_effect  : s.skill[buy_Skill].skill_effect,
                skill_price   : s.skill[buy_Skill].skill_price,
                skill_text    : s.skill[buy_Skill].skill_text  
            })
    console.log(s.myskill);

    s.state[0].my_gold -= skillprice;
        SetText("また来るがよい","","");
    }else{
        SetText("お金が足りないみたいだ…","","");
    }
}

//アイテムを確認する項目を描画する関数
function ItemCheck(g){

    g.fillStyle = WNDSTYLE;
    g.fillRect(WIDTH / 70,HEIGHT / 70,WIDTH - WIDTH /3.5,HEIGHT/1.52);

    let x = 0;let y = 0;

    ItemText();

    g.font = FONT; g.fillStyle = FONTSTYLE                    

    let Menu = GetMenu();

    s.myitem.forEach(function(myitem){

        g.fillText(`　${myitem.item_name}:${myitem.item_number}個`, WIDTH / 28 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8), HEIGHT / 700 + HEIGHT /11.5 * (y+1));

        x = x + 1;
        if (x >= Menu.Cx) {
            x = 0; y++;
        }
        g.fillText("⇒", WIDTH / 28 +(WIDTH / 1.2 / Menu.Cx) * gCursorX * 0.8, HEIGHT / 700 + HEIGHT /11.5 * (gCursorY + 1));
    })
}

function Use_Item(){
    s.myitem[Cursor-1].item_number--;

    eval(s.myitem[Cursor-1].item_effect);

    if(s.myitem[Cursor-1].item_number <= 0){
        s.myitem.splice(Cursor-1, 1);
    }
}

function DrawSetSkill(g){
    g.fillStyle = WNDSTYLE;
    g.fillRect(WIDTH / 70,HEIGHT / 70,WIDTH - WIDTH /3.5,HEIGHT/1.52);

    let x = 0;let y = 0;

    ItemText();

    g.font = FONT; g.fillStyle = FONTSTYLE                    

    let Menu = GetMenu();

    s.myskill.forEach(function(myskill){

        g.fillText(`　${s.skill[myskill.skill_id - 1].skill_name}`, WIDTH / 28 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8), HEIGHT / 700 + HEIGHT /11.5 * (y+1));

        x = x + 1;
        if (x >= Menu.Cx) {
            x = 0; y++;
        }
        g.fillText("⇒", WIDTH / 28 +(WIDTH / 1.2 / Menu.Cx) * gCursorX * 0.8, HEIGHT / 700 + HEIGHT /11.5 * (gCursorY + 1));
    })
}

function SetSkill(){
    if(s.myskill.length > 0){
    setskill[SkillCursor - 1] = s.myskill[Cursor-1].skill_id - 1;
    console.log(SkillCursor)
    console.log(setskill)
    }
}

function Drawmessage(g){
    g.font = FONT;  g.fillStyle = FONTSTYLE   // 文字色を設定

    g.fillText(gMessage1, WIDTH / 28 ,HEIGHT / 1.32 + HEIGHT /11.5 * 0);
    g.fillText(gMessage2, WIDTH / 28 ,HEIGHT / 1.32 + HEIGHT /11.5 * 1);
    g.fillText(gMessage3, WIDTH / 28 ,HEIGHT / 1.32 + HEIGHT /11.5 * 2);
}

function SetText(M1,M2,M3){
    gMessage1 = M1;
    gMessage2 = M2;
    gMessage3 = M3;
}

//モンスターを鍛えた際、成長値を決定する関数
function Drawgrowth(Cursor)
{
    var random = RandomUp();
    var chenge = 0;

    if(mPhase == 1){
        if(Cursor == 5){
            ChangePhase(0);
        }else if (random === '1' || random === '3' || random === '4') {
                if (random === '1') {
                    chenge = (Cursor == 1) ? -3 :-1;
                } else if (random === '3') {
                    chenge = (Cursor == 1) ?  3 : 1;
                } else if (random === '4') {
                    chenge = (Cursor == 1) ?  10 : 3;;
                }

                SetText("特訓で"+s.monster[s.state[0].monster_id-1].monster_name+"の",state_point[Cursor-1]+"が"+chenge+"上がった！！","");
                console.log(state_point[Cursor-1]);
                befor_state = s.state[0][state_point[Cursor-1]];
                s.state[0][state_point[Cursor-1]] += chenge;
                after_state = s.state[0][state_point[Cursor-1]];
                s.state[0].day++;
                DrawLife(-10);
                ChangePhase(11);
            }
        }
        if(mPhase == 2){
            if(Cursor == 4){
                ChangePhase(0);
            }else if (Cursor === 1) {
                chenge = (random == "3") ? 100 : (random == "2" || random == "1") ? 300: 800;
                DrawLife(-15);
                CLife = 15
            } else if (Cursor === 2) {
                chenge = (random == "3") ? 300 : (random == "2" || random == "1") ? 600: 2000;
                DrawLife(-25);
                CLife = 25
            } else if (Cursor === 3) {
                chenge = (random == "3") ? 500 : (random == "2" || random == "1") ? 1500: 5000;
                DrawLife(-50);
                CLife = 50
            }

            SetText(s.monster[s.state[0].monster_id - 1].monster_name+"と働いて"+chenge+"G手に入れた！！",s.monster[s.state[0].monster_id - 1].monster_name+"のスタミナが"+CLife+"下がった","");
            befor_state = s.state[0].my_gold;
            s.state[0].my_gold += chenge;
            befor_state = s.state[0].my_gold;
            s.state[0].day++;
            ChangePhase(21); 
        }
    if(mPhase == 3){
        let restMessage = ""

        if(Cursor == 4){
            ChangePhase(0);
        }else if (Cursor === 1) {
            chenge = (random == "1") ? 50 : (random == "2") ? 15: (random == "3") ?  10 : 5 ;
        } else if (Cursor === 2) {
            chenge = (random == "1") ? 80 : (random == "2") ? 30: (random == "3") ?  20 : 10 ;
            restMessage = "200Gを失った…";
            CGold = -200;
        } else if (Cursor === 3) {
            chenge = (random == "1") ? 100 : (random == "2") ? 50: (random == "3") ?  40 : 30 ;
            restMessage = "500Gを失った…";
            CGold = -500;
        }
        SetText(s.monster[s.state[0].monster_id - 1].monster_name+"はしっかりと休んだ！",s.monster[s.state[0].monster_id - 1].monster_name+"のスタミナが"+chenge+"回復した",restMessage);
        DrawLife(chenge);
        s.state[0].my_gold += CGold;
        s.state[0].day++;
        ChangePhase(31); 
    }
}

function DrawEvolution(g){

    g.fillRect(WIDTH / 70,HEIGHT / 70,WIDTH - WIDTH /3.5,HEIGHT/1.52);
    g.font = FONT; g.fillStyle = FONTSTYLE;

    let Menu = GetMenu();
    ItemText();

    let x = 0; let y = 0;let name;
    Menu.Cm.forEach(function(dm){

            name = dm.monster_name;

        g.fillText(`　${name}:${dm.need_hp}　${dm.need_atk}　${dm.need_def}　${dm.need_agi}`, WIDTH / 28 + (WIDTH/1.2 / Menu.Cx)* (x * 0.8), HEIGHT / 700 + HEIGHT /11.5 * (y+1));
        x = x + 1;
        if (x >= Menu.Cx) {
            x = 0;
            y++;
        }
    });
    g.fillText("⇒", WIDTH / 28 +(WIDTH / 1.2 / Menu.Cx) * gCursorX * 0.8, HEIGHT / 700 + HEIGHT /11.5 * (gCursorY + 1));
}

function Evolution(){
    const selectmonster = Cursor - 1;
    const need_state = ["need_hp","need_atk","need_def","need_agi"]
    let shortage = 0;

    for(var i=0; need_state.length > i; i++){
        console.log(shortage);
        if(s.monster[Cursor-1][need_state[i]] > s.state[0][state_point[i]]){
            shortage++;
        }
    }    
    if(shortage === 0){
        //s.state[0].monster_id = s.monster[Cursor-1].monster_id
        evolution_monster = Cursor-1
        ChangePhase(71);
    }else{
        SetText("まだ能力が足りないみたいだ","","");
        ChangePhase(71.5);
    }
}

//ランダムな値を返す関数
function RandomUp()
{
   const random = Math.random() * 100;
   return random <= 1 ? '1' : random <= 25 ? '2' : random <= 98 ? '3' : '4';
}

function change_draw(g) {
    // テキスト描画
    let alpha = 1;
    g.globalAlpha = alpha;
    g.font = FONT;
    g.fillStyle = FONT;

    change_state = befor_state - after_state;

    g.fillText("+"+change_state, WIDTH-WIDTH/5, HEIGHT/5 + HEIGHT/13 * 0);
    
    // 透明度を徐々に減少
    alpha -= 0.01;
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

    LoadImage();

    g.drawImage(gImgMonster,32 * Monster_number,0, M_WIDTH , M_HEIGHT 
    ,now_placeX ,now_placeY,
    WIDTH/3,HEIGHT/3);
    moovMonster();
        
    g.fillStyle = WNDSTYLE;                             // ウインドウの色
    g.fillRect(WIDTH/80,HEIGHT/80,WIDTH/7,65);          //日数を表記するウインドウ
    
    g.fillRect(now_placeX + WIDTH / 39 ,now_placeY-WIDTH/200,WIDTH/3.5,HEIGHT/45); //ライフバー（黒）を表記するウインドウ
    
    g.font = FONT;  // 文字フォントを設定
    g.fillStyle = FONTSTYLE                         // 文字色を設定
    g.fillText(s.state[0].day + "日目",WIDTH/27,HEIGHT / 18)   // 日数を表記するテキスト
    
    DrawLife(0);
    
    g.fillStyle = "rgba(255,30,30,1)";
    g.fillRect(now_placeX + WIDTH / 35.5,now_placeY-WIDTH/300,(WIDTH/3.55)/100 * s.state[0].life,HEIGHT/53);    //ライフバー（赤）を表記するウインドウ
}

function DEMonster(g){
    LoadImage();

    g.drawImage(gImgEMonster,32,0, M_WIDTH , M_HEIGHT 
    ,WIDTH / 2 ,HEIGHT / 2,
    WIDTH,HEIGHT);

    console.log("a");
}

//モンスターのライフバーを描画する関数
function DrawLife(L_moov)
{
    s.state[0].life = s.state[0].life + L_moov;
    if(s.state[0].life >= 100){
        s.state[0].life = 100;
    }
    if(s.state[0].life <= 0){
        s.state[0].life = 0;
    }

    if(s.state[0].life <= 0){
        mPhase = 9; 
    }                                                                                                                             
}

function NowCursor(){
    var Menu = GetMenu();
    Cursor = (gCursorY == 0) ? gCursorX + 1 :gCursorY * Menu.Cx + gCursorX+1;

    console.log("X="+gCursorX+"：Y="+gCursorY+"：Cursor="+Cursor);
}

//ホーム画面を描写する関数
function DrawHome(g)
{
    audio.play();
    g.fillStyle = "#F0E68C";								//	背景色
	g.fillRect( 0, 0, WIDTH, HEIGHT );                      //  背景設定
    ResetWND(g);

    g.fillStyle = MWNDSTYLE;                            
    g.fillRect(0,0,WIDTH - WIDTH /3.9,HEIGHT/1.52);         //モンスターウインドウ

    DrawMonster(g);                                         //モンスターを描画する関数
    DrawStatus(g);                                          //ステータスウインドウを描画する関数

    g.fillStyle = WNDSTYLE

    if(mPhase == 0){
        DrawMenu(g);                                        //セレクトメニュー画面を描画する
        SetText("今日は何をしますか？","","");
    }
    if(mPhase == 1){
        DrawMenu(g);                                        //トレーニングメニュー画面を描画する
        SetText("どの能力を鍛えますか？","","");
    }
    if(mPhase == 2){
        DrawMenu(g)        
        SetText("何の仕事をしますか？","","");
    }
    if(mPhase == 3){                                        //休んだ際の処理を行う
        DrawMenu(g)        
        SetText("どうやって休みますか？","","");
    }
    if(mPhase == 4){                                        //買い物をした際の処理を行う
        DrawShopMenu(g);
    }
    if(mPhase == 5){                                        //アイテムを確認する処理を行う
        ItemCheck(g);
    }
    if(mPhase == 6){
        DrawMenu(g);
        SetText("どちらにしますか？","",""); 
    }
    if(mPhase == 61){
        DrawShopMenu(g);
    }
    if(mPhase == 61.5){
        DrawMenu(g);
        SetText("どのスキルを変更しますか？","","");
    }
    if(mPhase == 62.5){
        DrawSetSkill(g);
    }
    if(mPhase == 7){
        DrawEvolution(g);
    }
    if(mPhase == 71){
        DEMonster(g);        DrawMenu(g);
        SetText("本当に進化させますか？","","");
    }
    if(mPhase == 8){
        DrawMenu(g);
        SetText("今の状況をセーブしますか？","",""); 
    }
    if(mPhase == 9){                                        //体力がなくなった際の処理を行う
        SetText("モンスターの体力が無くなってしまった！","モンスターの能力が下がった。","回復の為に三日間休んだ。")
    }

    DrawG(g);                                               //所持ゴールドウインドウを描画する関数
    Drawmessage(g);
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

    const Menu = GetMenu();
    var length = Object.keys(Menu.Cm).length + 1;


    // キーボードの右キーが押された場合
    if (c === 39) {
        // gCursorXが最大値に達していない場合に1増やす


        if (gCursorX < Menu.Cx - 1) {
            gCursorX++;
        }
        else if(gCursorY <= Menu.Cy-1){
            gCursorY++;
            gCursorX = 0;
        }
        if(length-2 <  Menu.Cx * gCursorY + (gCursorX)){
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
            gCursorX = Menu.Cx - 1;
        }else{
            gCursorY = Menu.Cy - 1
            if(Menu.Cy != 1){
                gCursorX = length % Menu.Cy;
            }else{
                gCursorX = Menu.Cx - 1
            }
        }
    }
    NowCursor();
}

function ChangePhase(m){
    mPhase = m;
    gCursorX = 0;
    gCursorY = 0;

    NowCursor();
}

window.onkeyup = function (ev) {
    let c = ev.keyCode;     // キーコード取得
    gIsKeyDown[c] = false;

    if(c == 13 || c == 90){             //Enterキー、またはzキーの場合

        button_se.play();

        if (isAudioPlaying) {
            button_se.currentTime = 0;
        }

        isAudioPlaying = true;


        if(mPhase == 0){
            ChangePhase(Cursor);
            return;
        }else if(mPhase == 1){
            Drawgrowth(Cursor);
            return;
        }else if(mPhase == 11){
            ChangePhase(0);
            return;
        }else if(mPhase == 2){
            Drawgrowth(Cursor);
            return;
        }else if(mPhase == 21){
            ChangePhase(0);
            return;
        }else if(mPhase == 3){
            Drawgrowth(Cursor);
            return;
        }else if(mPhase == 31){
            ChangePhase(0);
            return;
        }else if(mPhase == 4){
            Shop();
            ChangePhase(41);
        }else if(mPhase == 41){
            ChangePhase(0)
        }
        else if(mPhase == 5){
            if(s.myitem.length != 0){
            Use_Item();
            }
            ChangePhase(0);
            return;
        }else if(mPhase == 6){
            if(gCursorX == 0){
                ChangePhase(61)
            }else{
                ChangePhase(61.5)
            }
        }else if(mPhase == 61){
            SkillShop();
            ChangePhase(62);
        }else if(mPhase == 62){
            ChangePhase(0);
        }
        else if(mPhase == 61.5){
            SkillCursor = Cursor;
            ChangePhase(62.5);
        }
        else if(mPhase == 62.5){
            SetSkill();
            ChangePhase(0);
        }
        else if(mPhase == 7){
            Evolution();
        }
        else if(mPhase == 71){
            if(Cursor == 1){
                s.state[0].monster_id = s.monster[evolution_monster].monster_id
                console.log(s.state[0].monster_id);
                ChangePhase(0)
            }else{
                ChangePhase(0)    
            }
        }
        else if(mPhase == 71.5){
            ChangePhase(0);
        }
        else if(mPhase == 8){
            if(gCursorX == 0){
                updata_item();
                updata_state();
                updata_skill();
            }
            ChangePhase(0);
            return;
        }else if(mPhase == 9){ 
            s.state[0].hp   =  Math.floor(s.state[0].hp  * 0.8);
            s.state[0].atk  =  Math.floor(s.state[0].atk * 0.8);
            s.state[0].def  =  Math.floor(s.state[0].def * 0.8);
            s.state[0].agi  =  Math.floor(s.state[0].agi * 0.8);
            s.state[0].day  =  s.state[0].day + 3;

            s.state[0].life =  50;

            ChangePhase(0);
            return;
        }
    }
}

button_se.addEventListener('ended', function () {
    isAudioPlaying = false;
});

// ブラウザ起動イベント
window.onload = function () 
{
    //LoadImage()

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
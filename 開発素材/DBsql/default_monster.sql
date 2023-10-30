-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- ホスト: 127.0.0.1
-- 生成日時: 2023-10-20 03:23:14
-- サーバのバージョン： 10.4.28-MariaDB
-- PHP のバージョン: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `scrum1`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `default_monster`
--

CREATE TABLE `default_monster` (
  `monster_id` int(11) NOT NULL,
  `monster_name` varchar(191) NOT NULL,
  `need_hp` int(4) DEFAULT NULL,
  `need_atk` int(4) DEFAULT NULL,
  `need_def` int(4) DEFAULT NULL,
  `need_agi` int(4) DEFAULT NULL,
  `need_item_id` int(11) DEFAULT NULL,
  `correction_hp` int(4) NOT NULL,
  `correction_atk` int(4) NOT NULL,
  `correction_def` int(4) NOT NULL,
  `correction_agi` int(4) NOT NULL,
  `monster_text` varchar(191) NOT NULL,
  `monster_image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- テーブルのデータのダンプ `default_monster`
--

INSERT INTO `default_monster` (`monster_id`, `monster_name`, `need_hp`, `need_atk`, `need_def`, `need_agi`, `need_item_id`, `correction_hp`, `correction_atk`, `correction_def`, `correction_agi`, `monster_text`, `monster_image`) VALUES
(1, 'スライム', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '青くて柔らかいモンスター、様々な種類がいる', 'slime.png'),
(2, 'スライム・アクア', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '水のように冷ややかで素早く動く', 'aqua.png'),
(3, 'スライム・フレイム', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '火のように熱くたくましく力強い', 'fire.png'),
(4, 'スライム・ボックス', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '箱の中に住むことで防御が上がった\r\n', 'box.png'),
(5, 'スライム・デビル', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '悪魔のように強く小悪魔のように可愛い', 'devil.png'),
(6, 'スライム・メタル', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '速いだけではなくカッチカチに倒しても経験値は少ししか変わらない\r\n', 'metal.png'),
(7, 'スライム・ミミック', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '鉄壁のプレゼントボックスに化けて驚かすのが好き\r\n\r\n', 'mimic.png'),
(8, 'ゴースト', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '半透明のモンスター暗くて静かな場所が好き', 'ghost.png'),
(9, 'スマイル・テラー', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 'イタズラが好きで誰もいないのに笑い声がするのはこのモンスターの仕業\r\n', 'smile.png'),
(10, 'スピリット', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '生物の魂がこの世をさまよい続けた結果モンスターになったとされる姿\r\n', 'spirit.png'),
(11, 'スケルトン', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '安らかに眠っていたつもりが骨だけのモンスターになってしまっていた元人間', 'skeleton.png'),
(12, 'アーマー', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '鎧にゴーストがとり憑いた姿鎧の中は暗くて落ち着くらしい', 'armor.png'),
(13, 'ランプル', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '古いランタンに魂が宿りモンスターとなった恐怖心を煽るような薄暗い明かりを灯す\r\n', 'lanp.png'),
(14, 'ワンダラー', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 'いつも顔を隠して様々な場所に出没する何故さまよっているのかは不明\r\n', 'wandere.png'),
(15, 'メイル', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 'アーマーが金の鎧に移り換えた姿鎧の中はキラキラしててちょっと落ち着きにくいらしい\r\n', 'mail.png'),
(16, 'パピーシュルーム', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 'キノコのような見た目のモンスター、人懐こい性格でペットとして人気\r\n', 'dog.png'),
(17, 'ドギーノコ', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 'のんびりするのが好きで眠っている事が多い\r\n', 'doggy.png'),
(18, 'イヌティー', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '雪男ようなモンスター体は大きいが穏やかな性格', 'inu.png'),
(19, 'スノーハウンド', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '雪のように白く狩りが得意それぞれのテリトリーを持っている', 'hound.png'),
(20, 'プリンワン', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 'プリンのような甘い匂いを放ち触るとプリンのように柔らかい', 'pudding.png');

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `default_monster`
--
ALTER TABLE `default_monster`
  ADD PRIMARY KEY (`monster_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

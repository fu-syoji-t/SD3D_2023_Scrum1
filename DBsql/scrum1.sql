-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- ホスト: 127.0.0.1
-- 生成日時: 2023-10-30 04:02:29
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
(1, 'スライム', 20, 5, 5, 5, NULL, 20, 5, 5, 5, '青くて柔らかいモンスター、様々な種類がいる', 'slime.png'),
(2, 'スライム・アクア', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '水のように冷ややかで素早く動く', 'aqua.png'),
(3, 'スライム・フレイム', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, '火のように熱く力強い', 'fire.png'),
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

-- --------------------------------------------------------

--
-- テーブルの構造 `item`
--

CREATE TABLE `item` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(191) NOT NULL,
  `item_effect` varchar(191) NOT NULL,
  `item_price` int(11) NOT NULL,
  `item_text` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- テーブルのデータのダンプ `item`
--

INSERT INTO `item` (`item_id`, `item_name`, `item_effect`, `item_price`, `item_text`) VALUES
(1, '薬草', 'life += 30', 200, '体力が30回複する'),
(2, '中薬草', 'life += 60', 400, '体力が60回復する'),
(3, '上薬草', 'life += 100', 800, '体力が100回複する'),
(4, 'スライム餅', 'life =  0', 0, '体力が0になる');

-- --------------------------------------------------------

--
-- テーブルの構造 `my_item`
--

CREATE TABLE `my_item` (
  `play_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_number` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `my_monster`
--

CREATE TABLE `my_monster` (
  `play_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `monster_id` int(11) NOT NULL,
  `my_gold` int(8) NOT NULL,
  `day` int(4) NOT NULL,
  `life` int(4) NOT NULL,
  `hp` int(4) NOT NULL,
  `atk` int(4) NOT NULL,
  `def` int(4) NOT NULL,
  `agi` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- テーブルのデータのダンプ `my_monster`
--

INSERT INTO `my_monster` (`play_id`, `user_id`, `monster_id`, `my_gold`, `day`, `life`, `hp`, `atk`, `def`, `agi`) VALUES
(1, 1, 1, 10000, 1, 100, 20, 5, 5, 5);

-- --------------------------------------------------------

--
-- テーブルの構造 `my_skill`
--

CREATE TABLE `my_skill` (
  `play_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `skill`
--

CREATE TABLE `skill` (
  `skill_id` int(11) NOT NULL,
  `skill_name` varchar(191) NOT NULL,
  `skill_count` int(11) NOT NULL,
  `skill_power` int(11) NOT NULL,
  `skill_dex` int(11) NOT NULL,
  `skill_price` int(11) NOT NULL,
  `skill_text` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- テーブルのデータのダンプ `skill`
--

INSERT INTO `skill` (`skill_id`, `skill_name`, `skill_count`, `skill_power`, `skill_dex`, `skill_price`, `skill_text`) VALUES
(1, 'スラッシュ', 3, 10, 100, 1000, '相手を素早く切り付ける');

-- --------------------------------------------------------

--
-- テーブルの構造 `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `mail` varchar(191) NOT NULL,
  `pass` varchar(191) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- テーブルのデータのダンプ `user`
--

INSERT INTO `user` (`user_id`, `mail`, `pass`, `name`) VALUES
(1, 'monster@friends.jp', 'monsterfriends', 'scrum1');

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `default_monster`
--
ALTER TABLE `default_monster`
  ADD PRIMARY KEY (`monster_id`);

--
-- テーブルのインデックス `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`item_id`);

--
-- テーブルのインデックス `my_item`
--
ALTER TABLE `my_item`
  ADD PRIMARY KEY (`play_id`,`user_id`,`item_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- テーブルのインデックス `my_monster`
--
ALTER TABLE `my_monster`
  ADD PRIMARY KEY (`play_id`,`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `monster_id` (`monster_id`);

--
-- テーブルのインデックス `my_skill`
--
ALTER TABLE `my_skill`
  ADD PRIMARY KEY (`play_id`,`user_id`,`skill_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- テーブルのインデックス `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`skill_id`);

--
-- テーブルのインデックス `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- ダンプしたテーブルの AUTO_INCREMENT
--

--
-- テーブルの AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `my_item`
--
ALTER TABLE `my_item`
  ADD CONSTRAINT `my_item_ibfk_1` FOREIGN KEY (`play_id`) REFERENCES `my_monster` (`play_id`),
  ADD CONSTRAINT `my_item_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `my_item_ibfk_3` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`);

--
-- テーブルの制約 `my_monster`
--
ALTER TABLE `my_monster`
  ADD CONSTRAINT `my_monster_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `my_monster_ibfk_2` FOREIGN KEY (`monster_id`) REFERENCES `default_monster` (`monster_id`);

--
-- テーブルの制約 `my_skill`
--
ALTER TABLE `my_skill`
  ADD CONSTRAINT `my_skill_ibfk_1` FOREIGN KEY (`play_id`) REFERENCES `my_monster` (`play_id`),
  ADD CONSTRAINT `my_skill_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `my_skill_ibfk_3` FOREIGN KEY (`skill_id`) REFERENCES `item` (`item_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

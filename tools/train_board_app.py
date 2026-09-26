# -*- coding: utf-8 -*-
"""
文化祭Nゲージ運行情報表示システム
1〜4番線の番線属性・車種連動・運行状況・下部スクロールテロップ管理
"""

import os
import sys
from PyQt6.QtWidgets import (
    QApplication, QWidget, QLabel, QPushButton, QComboBox,
    QVBoxLayout, QHBoxLayout, QGridLayout, QFrame, QGroupBox
)
from PyQt6.QtGui import QPixmap, QFont, QColor, QPalette
from PyQt6.QtCore import QTimer, Qt

# ベースディレクトリ
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 車種プリセット定義
TRAIN_PRESETS = {
    "成田エクスプレス (E259系)": {
        "type_img": "種別-専用-特急成田エクスプレス15号.png",
        "type_text": "特急 成田エクスプレス",
        "dest_img": "行先-JO37成田空港.png",
        "dest_text": "成田空港",
        "cars_img": "編成-6両.png",
        "cars_text": "6両",
        "desc": "特急成田エクスプレス（E259系）が走行中です。成田空港行きです。"
    },
    "東海道線 快速アクティー (E231系)": {
        "type_img": "種別-専用-オレンジ快速アクティー.単体大.png",
        "type_text": "快速アクティー",
        "dest_img": "行先-JT21熱海.png",
        "dest_text": "熱海",
        "cars_img": "編成-15両.png",
        "cars_text": "15両",
        "desc": "東海道線 快速アクティー（熱海行き）です。グリーン車連結の15両編成です。"
    },
    "宇都宮線 普通 (E233系)": {
        "type_img": "種別-専用-緑普通.宇都宮.png",
        "type_text": "普通",
        "dest_img": "行先-JU宇都宮07宇都宮.png",
        "dest_text": "宇都宮",
        "cars_img": "編成-10両.png",
        "cars_text": "10両",
        "desc": "宇都宮線 普通 宇都宮行きです。近郊型10両編成で運行中です。"
    },
    "湘南新宿ライン 特別快速 (E231系)": {
        "type_img": "種別-専用-スカイブルー特別快速.単体大.png",
        "type_text": "特別快速",
        "dest_img": "行先-JT16小田原.png",
        "dest_text": "小田原",
        "cars_img": "編成-15両.png",
        "cars_text": "15両",
        "desc": "湘南新宿ライン 特別快速 小田原行きです。高崎線・東海道線直通です。"
    },
    "横須賀線 普通 (E235系/E217系)": {
        "type_img": "種別-専用-緑普通.横須賀.png",
        "type_text": "普通",
        "dest_img": "行先-JO01久里浜.png",
        "dest_text": "久里浜",
        "cars_img": "編成-11両.png",
        "cars_text": "11両",
        "desc": "横須賀線 普通 久里浜行きです。11両編成で運行中です。"
    },
    "相鉄直通線 各駅停車 (12000系/E233系)": {
        "type_img": "種別-専用-相鉄線.png",
        "type_text": "各駅停車",
        "dest_img": "行先-海老名.png",
        "dest_text": "海老名",
        "cars_img": "編成-10両.png",
        "cars_text": "10両",
        "desc": "相鉄線直通 各駅停車 海老名行きです。新宿方面からの直通列車です。"
    },
    "特急 湘南 (E257系)": {
        "type_img": "種別-専用-特急湘南21号.png",
        "type_text": "特急 湘南",
        "dest_img": "行先-JT14Odawara.png",
        "dest_text": "小田原",
        "cars_img": "編成-9両.png",
        "cars_text": "9両",
        "desc": "特急 湘南号 小田原行きです。快適なリクライニングシート車両です。"
    },
    "回送 / 試運転": {
        "type_img": "種別-専用-グレー普通.単体大.png",
        "type_text": "回送",
        "dest_img": "行先-JS17大崎.png",
        "dest_text": "回送",
        "cars_img": "編成-4両.png",
        "cars_text": "4両",
        "desc": "回送列車です。車内点検および試運転を実施しています。"
    }
}

# 運行状態のスタイルとテキスト
STATUS_STYLES = {
    "走行中": {
        "bg": "#1b5e20", "fg": "#ffffff", "border": "#4caf50",
        "badge_bg": "#2e7d32", "text": "● 走行中"
    },
    "停車中": {
        "bg": "#f57f17", "fg": "#000000", "border": "#fbc02d",
        "badge_bg": "#fbc02d", "text": "■ 停車中"
    },
    "調整中": {
        "bg": "#e65100", "fg": "#ffffff", "border": "#ff9800",
        "badge_bg": "#ff9800", "text": "▲ 調整中"
    },
    "見合わせ": {
        "bg": "#b71c1c", "fg": "#ffffff", "border": "#f44336",
        "badge_bg": "#d32f2f", "text": "× 見合わせ"
    }
}


class TrackRowWidget(QFrame):
    """各番線の表示および操作パネル"""
    def __init__(self, track_num, default_train_key, on_change_callback):
        super().__init__()
        self.track_num = track_num
        self.on_change_callback = on_change_callback
        self.current_train = default_train_key
        self.current_status = "走行中"

        self.setFrameShape(QFrame.Shape.StyledPanel)
        self.setStyleSheet("""
            TrackRowWidget {
                background-color: #1a1a1a;
                border: 2px solid #333333;
                border-radius: 8px;
                margin: 4px;
            }
        """)

        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 8, 12, 8)
        layout.setSpacing(15)

        # 1. 番線バッジ
        self.track_label = QLabel(f"{track_num}番線")
        self.track_label.setFixedWidth(75)
        self.track_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.track_label.setStyleSheet("""
            QLabel {
                background-color: #0d47a1;
                color: #ffffff;
                font-size: 18px;
                font-weight: bold;
                border-radius: 6px;
                padding: 6px;
            }
        """)
        layout.addWidget(self.track_label)

        # 2. 種別表示 (画像 or テキスト)
        self.type_img_label = QLabel()
        self.type_img_label.setFixedSize(140, 48)
        self.type_img_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.type_img_label.setStyleSheet("background: #000; border: 1px solid #444; border-radius: 4px;")
        layout.addWidget(self.type_img_label)

        # 3. 行先表示 (画像 or テキスト)
        self.dest_img_label = QLabel()
        self.dest_img_label.setFixedSize(140, 48)
        self.dest_img_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.dest_img_label.setStyleSheet("background: #000; border: 1px solid #444; border-radius: 4px;")
        layout.addWidget(self.dest_img_label)

        # 4. 両数表示 (画像 or テキスト)
        self.cars_img_label = QLabel()
        self.cars_img_label.setFixedSize(80, 48)
        self.cars_img_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.cars_img_label.setStyleSheet("background: #000; border: 1px solid #444; border-radius: 4px;")
        layout.addWidget(self.cars_img_label)

        # 5. 運行状況バッジ
        self.status_badge = QLabel()
        self.status_badge.setFixedSize(100, 40)
        self.status_badge.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.status_badge)

        # 6. 車種選択コンボボックス（担当者操作用）
        self.train_combo = QComboBox()
        self.train_combo.addItems(list(TRAIN_PRESETS.keys()))
        self.train_combo.setCurrentText(default_train_key)
        self.train_combo.setStyleSheet("""
            QComboBox {
                background-color: #2b2b2b;
                color: #ffffff;
                font-size: 14px;
                padding: 6px 12px;
                border: 1px solid #555555;
                border-radius: 4px;
                min-width: 220px;
            }
            QComboBox QAbstractItemView {
                background-color: #2b2b2b;
                color: #ffffff;
                selection-background-color: #0d47a1;
            }
        """)
        self.train_combo.currentTextChanged.connect(self.on_train_selected)
        layout.addWidget(self.train_combo)

        # 7. 状態切替ボタングループ
        status_btn_layout = QHBoxLayout()
        status_btn_layout.setSpacing(4)
        for st in ["走行中", "停車中", "調整中", "見合わせ"]:
            btn = QPushButton(st)
            btn.setFixedHeight(34)
            btn.setFixedWidth(64)
            btn.setStyleSheet("""
                QPushButton {
                    background-color: #333333;
                    color: #dddddd;
                    font-size: 12px;
                    font-weight: bold;
                    border: 1px solid #555555;
                    border-radius: 4px;
                }
                QPushButton:hover {
                    background-color: #555555;
                }
            """)
            btn.clicked.connect(lambda checked, s=st: self.on_status_clicked(s))
            status_btn_layout.addWidget(btn)
        layout.addLayout(status_btn_layout)

        # 初期表示更新
        self.update_display()

    def set_image_or_text(self, label, img_filename, fallback_text):
        """画像が存在すれば画像、なければテキストをLED風に表示"""
        img_path = os.path.join(BASE_DIR, img_filename)
        if os.path.exists(img_path):
            pixmap = QPixmap(img_path)
            scaled_pixmap = pixmap.scaled(
                label.size(),
                Qt.AspectRatioMode.KeepAspectRatio,
                Qt.TransformationMode.SmoothTransformation
            )
            label.setPixmap(scaled_pixmap)
        else:
            label.clear()
            label.setText(fallback_text)
            label.setStyleSheet("color: #ffaa00; font-size: 14px; font-weight: bold; background: #000;")

    def on_train_selected(self, train_name):
        self.current_train = train_name
        self.update_display()
        self.on_change_callback()

    def on_status_clicked(self, status):
        self.current_status = status
        self.update_display()
        self.on_change_callback()

    def update_display(self):
        train_data = TRAIN_PRESETS.get(self.current_train, {})
        # 種別・行先・両数の反映
        self.set_image_or_text(self.type_img_label, train_data.get("type_img", ""), train_data.get("type_text", ""))
        self.set_image_or_text(self.dest_img_label, train_data.get("dest_img", ""), train_data.get("dest_text", ""))
        self.set_image_or_text(self.cars_img_label, train_data.get("cars_img", ""), train_data.get("cars_text", ""))

        # 運行状況バッジの反映
        st_style = STATUS_STYLES.get(self.current_status, STATUS_STYLES["走行中"])
        self.status_badge.setText(st_style["text"])
        self.status_badge.setStyleSheet(f"""
            QLabel {{
                background-color: {st_style["badge_bg"]};
                color: {st_style["fg"]};
                font-size: 14px;
                font-weight: bold;
                border-radius: 4px;
                border: 1px solid {st_style["border"]};
            }}
        """)

    def get_info(self):
        train_data = TRAIN_PRESETS.get(self.current_train, {})
        return {
            "track": self.track_num,
            "train": self.current_train,
            "status": self.current_status,
            "desc": train_data.get("desc", ""),
            "dest": train_data.get("dest_text", "")
        }


class ScrollingTelop(QFrame):
    """下部スクロールLED風テロップ"""
    def __init__(self):
        super().__init__()
        self.setFixedHeight(50)
        self.setStyleSheet("""
            QFrame {
                background-color: #050505;
                border: 2px solid #ff9900;
                border-radius: 6px;
            }
        """)

        self.full_text = "Nゲージ運行案内システム 稼働中"
        self.offset = 0

        self.label = QLabel(self.full_text, self)
        self.label.setFont(QFont("Meiryo", 16, QFont.Weight.Bold))
        self.label.setStyleSheet("color: #ffaa00; background: transparent;")
        self.label.adjustSize()

        # スクロールアニメーションタイマー
        self.timer = QTimer()
        self.timer.timeout.connect(self.scroll_text)
        self.timer.start(30)  # 30msごとに移動

    def set_messages(self, messages):
        combined = "　◆　".join(messages)
        if combined != self.full_text:
            self.full_text = combined
            self.label.setText(self.full_text)
            self.label.adjustSize()
            self.offset = self.width()

    def scroll_text(self):
        self.offset -= 2
        if self.offset < -self.label.width():
            self.offset = self.width()
        self.label.move(self.offset, (self.height() - self.label.height()) // 2)

    def resizeEvent(self, event):
        super().resizeEvent(event)
        if self.offset == 0:
            self.offset = self.width()


class TrainInfoBoardApp(QWidget):
    """メインアプリケーションウィンドウ"""
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Nゲージ運行情報板 (文化祭モード)")
        self.setStyleSheet("background-color: #121212; color: #ffffff;")
        self.resize(1100, 520)

        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(16, 16, 16, 16)
        main_layout.setSpacing(10)

        # ヘッダー
        header_layout = QHBoxLayout()
        title = QLabel("■ N-Gauge 運行管理・在線情報ディスプレイ")
        title.setFont(QFont("Meiryo", 18, QFont.Weight.Bold))
        title.setStyleSheet("color: #00e5ff; letter-spacing: 1px;")
        header_layout.addWidget(title)

        header_layout.addStretch()

        quick_info = QLabel("※ 車種・状態を選択すると下部テロップ及び表示が即座に連動更新されます")
        quick_info.setStyleSheet("color: #888888; font-size: 12px;")
        header_layout.addWidget(quick_info)

        main_layout.addLayout(header_layout)

        # 1〜4番線のウィジェット生成
        default_assignments = [
            "成田エクスプレス (E259系)",
            "東海道線 快速アクティー (E231系)",
            "宇都宮線 普通 (E233系)",
            "湘南新宿ライン 特別快速 (E231系)"
        ]

        self.track_rows = []
        for i in range(1, 5):
            default_train = default_assignments[i - 1]
            row = TrackRowWidget(i, default_train, self.update_telop_message)
            main_layout.addWidget(row)
            self.track_rows.append(row)

        # 下部テロップ
        self.telop = ScrollingTelop()
        main_layout.addWidget(self.telop)

        # 初期テロップ設定
        self.update_telop_message()

    def update_telop_message(self):
        messages = []
        for row in self.track_rows:
            info = row.get_info()
            st = info["status"]
            track = info["track"]
            desc = info["desc"]
            
            if st == "走行中":
                messages.append(f"【{track}番線 走行中】{desc}")
            elif st == "停車中":
                messages.append(f"【{track}番線 停車中】{info['train']} は現在ホームに停車中です。")
            elif st == "調整中":
                messages.append(f"【{track}番線 調整中】車両点検・調整作業を行っております。")
            elif st == "見合わせ":
                messages.append(f"【{track}番線 見合わせ】安全確認のため運行を見合わせております。")

        messages.append("【ご案内】模型には手を触れず、黄色い線の外側からご鑑賞ください。")
        self.telop.set_messages(messages)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = TrainInfoBoardApp()
    window.show()
    sys.exit(app.exec())

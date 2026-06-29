# Sukasi-kun (Environment Watermark Overlay) Chrome Extension

本番環境（Production）と開発・検証環境（Development/Staging）を見分けるために、ドメインごとにカスタマイズ可能なウォーターマーク（透かしバッジ）を画面上にオーバーレイ表示する Google Chrome 拡張機能です。

## 主な機能

1. **ドメイン指定・管理機能**
   - 部分一致によるドメインマッチング（例: `localhost` と指定すると `localhost:3000` や `localhost:8080` にもマッチ）。
   - 特定のドメインに対する複数のルールを簡単に登録・削除できます。

2. **リアルタイムなウォーターマーク表示**
   - 設定したドメインを表示した際、指定した四隅（左上、右上、左下、右下）にウォーターマークを表示。
   - Shadow DOM を使用して注入するため、対象サイトの CSS による崩れや干渉を受けません。
   - `pointer-events: none` を指定しているため、ウォーターマークの下にあるボタン等のクリックやテキスト選択を一切妨げません。

3. **高度なカスタマイズ性（ドメイン単位）**
   - 表示テキスト（例: `STAGING`, `LOCAL-DEV`）
   - 文字サイズ (10px〜60px)
   - 不透明度 (10%〜100%)
   - 文字色（カラーピッカー）
   - 背景色（カラーピッカー）
   - 表示位置（左上、右上、左下、右下）
   - 拡張機能のポップアップUI上で**リアルタイムにプレビュー**しながら調整可能。
   - ポップアップで設定を変更すると、現在開いているタブのウォーターマークが**リロード不要で瞬時に切り替わり**ます。

---

## ディレクトリ構成

```
sukasi-kun/
├── manifest.json       # 拡張機能の構成ファイル (Manifest V3)
├── popup.html          # 設定変更用ポップアップ UI
├── popup.css           # ポップアップ UI 用スタイル (モダンなダークテーマ・Glassmorphism)
├── popup.js            # ポップアップ UI の状態管理・ストレージ保存ロジック
├── content.js          # ウェブページへのウォーターマーク注入スクリプト (Shadow DOM)
├── icons/              # 拡張機能アイコン
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md           # 本説明書
```

---

## インストール方法（Chrome）

1. Google Chrome を起動し、アドレスバーに `chrome://extensions/` と入力して移動します。
2. 画面右上にある **「デベロッパー モード」** のトグルスイッチを **オン** にします。
3. 画面左上に表示される **「パッケージ化されていない拡張機能を読み込む」** ボタンをクリックします。
4. 本プロジェクトのディレクトリ（`sukasi-kun` フォルダ）を選択して読み込みます。
5. 拡張機能一覧に **「Sukasi-kun (ウォーターマーク表示)」** が追加されます。ツールバーにピン留めしておくと便利です。

---

## 動作テスト方法

1. ローカルで簡易ウェブサーバーを起動します（例として Python を使用する場合）:
   ```bash
   python3 -m http.server 8000
   ```
2. ブラウザで `http://localhost:8000` にアクセスします。
3. 拡張機能のポップアップアイコンをクリックして設定を開きます。
4. 以下の設定を入力してみます：
   - **対象ドメイン**: `localhost`
   - **表示テキスト**: `LOCAL-DEV`
   - **文字サイズ**: `20px`
   - **不透明度**: `70%`
   - **文字色**: `#ffffff`
   - **背景色**: `#ff3366`
   - **表示位置**: `右上`
5. **「ルールを保存」** ボタンをクリックします。
6. 開いている `http://localhost:8000` の右上に、設定した通りのウォーターマークが瞬時に表示されることを確認できます。
7. ポップアップからルールを削除すると、ウォーターマークも瞬時に消去されます。

---

## GitHub での配布方法（GitHub Releases）

本拡張機能を GitHub で配布する場合は、以下の手順でパッケージ（zipファイル）を公開することをお勧めします。

### 1. 配布用 ZIP アーカイブの作成
以下のワンライナーコマンドを実行すると、不要な Git 関連ファイルや設定ファイルを除外した、配布専用の `sukasi-kun.zip` が生成されます：
```bash
python3 -c "import zipfile, os; zipf = zipfile.ZipFile('sukasi-kun.zip', 'w', zipfile.ZIP_DEFLATED); [zipf.write(f, f) for f in ['manifest.json', 'popup.html', 'popup.css', 'popup.js', 'content.js', 'README.md'] if os.path.exists(f)]; [zipf.write(os.path.join('icons', f), os.path.join('icons', f)) for f in os.listdir('icons') if os.path.exists('icons')]"
```

### 2. リポジトリを GitHub にプッシュする
```bash
git branch -M main
git remote add origin https://github.com/ユーザー名/sukasi-kun.git
git push -u origin main
```

### 3. GitHub Releases で公開する
1. GitHub のリポジトリページを開き、右側メニューの **「Releases」** から **「Create a new release」** をクリックします。
2. タグ名（例: `v1.0.0`）とタイトルを指定します。
3. ページ下部のバイナリアタッチ欄に、作成した `sukasi-kun.zip` をドラッグ＆ドロップしてアップロードします。
4. **「Publish release」** ボタンを押して公開します。

利用者は公開された Release ページから `sukasi-kun.zip` をダウンロード・解凍し、Chrome の「パッケージ化されていない拡張機能を読み込む」から簡単にインストールできます。


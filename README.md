# 鬼滅の刃キャラクター一覧

[鬼滅の刃API](https://ihatov08.github.io/kimetsu_api/) からキャラクター情報を取得し、画像・名前・カテゴリを3列のグリッドで表示するWebページです。
ライブラリやフレームワークを使わず、素のJavaScript（Vanilla JS）だけで作っています。

## 機能一覧

- ページを開くと、全キャラクターの一覧を表示する
- ラジオボタン（全キャラクター / 鬼殺隊 / 柱 / 鬼）で、表示するキャラクターを切り替える
  - 切り替えるたびに該当するAPIを呼び出し、一覧を差し替える
- 各キャラクターの画像・名前・カテゴリを3列のグリッドで表示する
- データの取得中は「読み込み中...」を表示する
- 取得に失敗したときは、画面にエラーメッセージを表示する

## 使用技術

- HTML
- CSS（CSS Grid）
- JavaScript（Vanilla JS：`fetch` / `async` / `await`）

ライブラリ・フレームワーク・ビルドツールは使っていません。

## 動かし方

1. このリポジトリをクローンします。

   ```sh
   git clone https://github.com/keita-fukui-dev/js-kimetsu-list.git
   ```

2. `index.html` をブラウザで開きます（ファイルをダブルクリックするだけで動きます）。

インストールやビルドは不要です。APIからデータを取得するため、インターネット接続が必要です。

## ファイル構成

```
.
├── index.html   # ページの骨組み（ラジオボタン・ローディング・エラー表示・一覧の表示エリア）
├── style.css    # 見た目（一覧の3列グリッド、画像サイズの統一など）
├── main.js      # APIからのデータ取得、一覧の描画、ラジオボタンの切り替え処理
└── README.md    # このファイル
```

## 使用API

ベースURL：`https://ihatov08.github.io/kimetsu_api/api`

| ラジオボタン | エンドポイント |
| --- | --- |
| 全キャラクター | `/all.json` |
| 鬼殺隊 | `/kisatsutai.json` |
| 柱 | `/hashira.json` |
| 鬼 | `/oni.json` |

レスポンスは次の形のオブジェクトの配列です。

```json
{
  "name": "竈門炭治郎",
  "image": "/kimetsu_api/images/tanjiro.jpg",
  "category": "鬼殺隊"
}
```

`image` は相対パスのため、先頭に `https://ihatov08.github.io` を付けて絶対パスにして表示しています。

## 実装のポイント

### async / await によるデータ取得

`main.js` の `fetchCharacters(type)` で、`fetch` と `await` を使ってAPIからデータを取得しています。
ラジオボタンの `value` をAPIのファイル名（`all` / `kisatsutai` / `hashira` / `oni`）とそろえているため、`${API_BASE_URL}/${type}.json` の形でURLを組み立てられます。

### ラジオボタンの切り替え

各ラジオボタンに `change` イベントを登録し、選択された `value` を `showCharacters(type)` に渡して一覧を取得し直しています。
描画の前に一覧を空にしているため、前の表示は残りません。

### ローディング表示

`showCharacters(type)` の最初でローディング（`#loading`）を表示し、`try...catch...finally` の `finally` で非表示に戻しています。
成功・失敗のどちらの場合でも、ローディングは必ず消えます。表示の切り替えには HTML の `hidden` 属性を使っています。

### エラー処理

- `fetch` は、404 などの HTTP エラーでは例外を投げません。そこで `response.ok` を確認し、`false` の場合は自分でエラーを投げています。
- 通信失敗・HTTPエラーのどちらも `catch` で受け止め、画面にエラーメッセージ（`#error`）を表示します。詳しい内容は `console.error` でコンソールに出力しています。
- 取得の前に一覧を空にしているため、失敗したときに古い一覧が残ることはありません。

### 表示まわり

- 名前やカテゴリは `textContent` で入れ、文字列がHTMLとして解釈されないようにしています。
- `<img>` の `alt` にはキャラクター名を入れています。
- 一覧は `display: grid` と `grid-template-columns: repeat(3, 1fr)` で3列にしています。画像は `aspect-ratio` と `object-fit: cover` で正方形にそろえています。

## 画像の出典

キャラクター画像は鬼滅の刃APIが提供しているものを表示しています。
APIのページに記載されている画像参照元は次のとおりです。

- https://simplelog.me/entry/kimetsu-negajo-free-item

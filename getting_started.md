# SetUp(初回のみ)
- 実行には.env.localが必要です。必要な場合はお声がけください。

1. .env.localの作成
   1. `cp .env.example .env.local`
   2. .env.localに必要な情報を入力
2. Node.jsのインストール
   1. `nvm install 20`
   2. `nvm use 20` 
3. Dockerの起動
4. DBの起動
   1. `docker compose up`
5. DBの初期化
   1. `npx dotenv -e .env.local -- prisma migrate dev`
6. localhostを開く
   1. `npm run dev`
   2. `http://localhost:3000/`にアクセス

# 2回目以降
1. Node.jsのインストール
   1. `nvm use 20`
2. Dockerの起動
3. DBの起動
   1. `docker compose up`
4. localhostを開く
   1. `npm run dev`
   2. `http://localhost:3000/`にアクセス


# 必要な時に使うコマンド

- DBの中身を見る
  - npx dotenv -e .env.local -- prisma studio

- 原因よく分かってないけどSymbol使う時に`NEXT_NOT_FOUND`みたいなエラーが出る時
  - `cp node_modules/symbol-crypto-wasm-node/symbol_crypto_wasm_bg.wasm .next/server/vendor-chunks/`

# TODO
1. Dockerの起動
2. DBの起動
   1. `docker compose up`
3. DBの初期化(初回のみ)
   1. `npx dotenv -e .env.local -- prisma migrate dev`
4. localhostを開く
   1. `npm run dev`
   2. `http://localhost:3000/`にアクセス


# 必要な時に使うコマンド

- DBの中身を見る
  - npx dotenv -e .env.local -- prisma studio

- 原因よく分かってないけどSymbol使う時に`NEXT_NOT_FOUND`みたいなエラーが出る時
  - `cp node_modules/symbol-crypto-wasm-node/symbol_crypto_wasm_bg.wasm .next/server/vendor-chunks/`

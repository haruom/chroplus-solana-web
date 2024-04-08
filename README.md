# XHRO API
XHROのAPI開発に関するドキュメントです。  

## 動作環境
npmコマンドが利用できるようにしておいてください。  
dockerが利用できるようにしておいてください。

## 環境変数
管理者に問い合わせて取得してください。

## 環境構築
```
docker compose build
docker compose up -d
docker ps // chroplus-solana-web が起動していることを確認する.
docker exec -it chroplus-solana-web /bin/bash
firebase experiments:enable webframeworks
firebase login --no-localhost
cd functions
npm install
npm run build
npm run emulators
```

## デプロイ方法
ゲストOS内でfunctions/package.jsonにあるスクリプトを実行してください。  

例:
```
npm run deploy
```

# About this document
CHROPLUSの開発環境構築に関するドキュメントです。
Documentation on building a development environment for CHROPLUS.

## Environment
npm command should be available.  
Please make sure docker is available.

## Environment Variables
Contact the administrator to obtain the information.

## Building
```
docker compose build
docker compose up -d
docker ps // Check the `chroplus-solana` is running.
docker exec -it chroplus-solana /bin/bash
firebase experiments:enable webframeworks
firebase login --no-localhost
cd hosting
npm install
cd ../functions
npm install
```  

import * as admin from "firebase-admin"
import * as fs from "fs"
import * as functions from "firebase-functions"
import { BigQuery } from "@google-cloud/bigquery"

import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionSignature,
  sendAndConfirmTransaction,
} from "@solana/web3.js"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
  keypairIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  mplTokenMetadata,
  createNft,
} from "@metaplex-foundation/mpl-token-metadata";
import * as bs58 from "bs58"

// APPの秘密鍵
// eslint-disable-next-line max-len
const SECRET_KEY = functions.config().chroplus.wallet.privatekey;
// ArweaveのWallet
// eslint-disable-next-line max-len,key-spacing,comma-spacing
const arweaveWalletPath = fs.readFileSync(
  functions.config().chroplus.arweave.wallet.path,
  "utf-8"
);
const arweaveWallet = JSON.parse(arweaveWalletPath);
const ENDPOINT = "https://api.devnet.solana.com"

module.exports = functions.region("us-central1").runWith({
  timeoutSeconds: 300,
})
  .pubsub
  .schedule("33 0 * * *")
  // .schedule("every 10 minutes synchronized")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    console.log("setThePriceOfDailyXHROData")

    const bigQuery = new BigQuery()
    const dataset = bigQuery.dataset("xhro")

    // 日本時間の今日の日付を取得
    const today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    // 日本時間の前の日の日付を取得
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    // 2024-03-31 00:00:00このようなフォーマットで日付を取得
    const todayStr = today.toISOString().split(".")[0].replace("T", " ")
    const yesterdayStr =
      yesterday.toISOString().split(".")[0].replace("T", " ")
    console.log(`today: ${todayStr}, yesterday: ${yesterdayStr}`)

    const data = await dataset.query({
      query: `
SELECT
  uid,
  COUNT(*) as count
FROM
  chro-plus.xhro.meta
WHERE
  TIMESTAMP_MILLIS(timestamp) >= TIMESTAMP("${yesterdayStr}", "Asia/Tokyo")
  AND
  TIMESTAMP_MILLIS(timestamp) < TIMESTAMP("${todayStr}", "Asia/Tokyo")
GROUP BY
  uid
      `,
    })

    for (const row of data[0]) {
      const promises = []
      const uid = row.uid
      const seconds = row.count
      const price = _sigmoid(seconds / 3600, 0.5, -10, 0.01)
      console.log(`uid: ${uid}, seconds: ${seconds}, price: ${price}`)

      const rewardId = admin.firestore().collection("rewards").doc().id

      const transactionPromise = admin
        .firestore()
        .runTransaction(async (transaction) => {
          const userRef = admin.firestore().collection("users").doc(uid)
          const userDoc = await transaction.get(userRef)
          const user = userDoc.data()
          if (!user) {
            return
          }
          if (user.walletPublicKey !== undefined) {
            const solanaTransactionPromise = _makeSolanaTransaction(
              user.walletPublicKey,
              price
            )
            promises.push(solanaTransactionPromise)
          }

          const rewardsRef = admin.firestore().collection("rewards")
          const params = {
            uid,
            seconds,
            price,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          }

          transaction.set(rewardsRef.doc(rewardId), params)
        })

      const csv = `uid,seconds,price\n${uid},${seconds},${price}`
      const storagePromise = admin.storage()
        .bucket("gs://chro-plus.appspot.com")
        .file(`xhro-data/${rewardId}.csv`)
        .save(csv)

      promises.push(transactionPromise)
      promises.push(storagePromise)

      await Promise.all(promises)

      const metaURL = await _uploadJson(rewardId);
      await _mintNFT(metaURL);
    }
  })

/**
 * 報酬計算のためのシグモイド関数
 * @param {number} x
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number}
 */
const _sigmoid = (
  x: number,
  a: number,
  b: number,
  c: number
): number => {
  return 1 / (1 + Math.exp(-a * (x + b))) * c
}

const _makeSolanaTransaction = (
  publicKey: string,
  price: number
): Promise<TransactionSignature> => {
  const keypair = Keypair.fromSecretKey(
    bs58.decode(SECRET_KEY)
  )
  const connection = new Connection(
    ENDPOINT,
    "confirmed"
  )

  // 1lamport = 0.000000001 SOL
  const lamportsToSend = Math.floor(price * 1_000_000_000)

  const toPublickey = new PublicKey(publicKey)
  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: toPublickey,
      lamports: lamportsToSend,
    })
  )

  return sendAndConfirmTransaction(connection, transferTransaction, [keypair])
}

const _uploadJson = async (dataId: string) => {
  const keypair = Keypair.fromSecretKey(
    bs58.decode(SECRET_KEY)
  )

  // Upload json to Arweave
  const Arweave = require("arweave");
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: false,
  });

  const params = {id: dataId};
  const transaction = await arweave.createTransaction({
    data: JSON.stringify(params),
  }, arweaveWallet);
  transaction.addTag("Content-Type", "application/json");

  await arweave.transactions.sign(transaction, arweaveWallet);

  const response = await arweave.transactions.post(transaction);
  console.log(response);

  const id = transaction.id;
  const url = id ? `https://arweave.net/${id}` : undefined;
  console.log("url", url);

  // Upload metadata to Arweave

  const metadata = {
    name: "CHRO-PLUS NFT TEST #3",
    symbol: "CHROPLUS-TEST",
    description: "This is my CHRO-PLUS NFT TEST #3",
    seller_fee_basis_points: 0.001,
    external_url: "https://chro-plus.web.app/",
    attributes: [
      {
        trait_type: "NFT type",
        value: "Custom",
      },
    ],
    collection: {
      name: "Test Collection",
      family: "Custom NFTs",
    },
    properties: {
      files: [
        {
          uri: url,
          type: "application/json",
        },
      ],
      category: "json",
      maxSupply: 0,
      creators: [
        {
          address: keypair.publicKey.toBase58(),
          share: 100,
        },
      ],
    },
  };

  const metadataRequest = JSON.stringify(metadata);

  const metadataTransaction = await arweave.createTransaction({
    data: metadataRequest,
  });

  metadataTransaction.addTag("Content-Type", "application/json");

  await arweave.transactions.sign(metadataTransaction, arweaveWallet);

  const txid = metadataTransaction.id;
  console.log("metadata txid", txid);

  const metaResponse = await arweave.transactions.post(metadataTransaction);
  console.log(metaResponse);
  const metaURL = txid ? `https://arweave.net/${txid}` : "";
  console.log("metaURL", metaURL);

  return metaURL;
}

const _mintNFT = async (metaURL: string) => {
  const keypair = Keypair.fromSecretKey(
    bs58.decode(SECRET_KEY)
  )

  // Mint NFT
  const umi = createUmi(ENDPOINT).use(mplTokenMetadata());
  const payerKeypair = umi.eddsa.createKeypairFromSecretKey(keypair.secretKey);
  umi.use(keypairIdentity(payerKeypair));

  const collectionUpdateAuthority = generateSigner(umi);
  const collectionMint = generateSigner(umi);
  await createNft(umi, {
    mint: collectionMint,
    authority: collectionUpdateAuthority,
    name: "CHRO-PLUS NFT TEST",
    uri: metaURL,
    sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
    isCollection: true,
  }).sendAndConfirm(umi);

  console.log("payer =>", payerKeypair.publicKey.toString());
  console.log(
    "collectionUpdateAuthority =>",
    collectionUpdateAuthority.publicKey.toString()
  );
  console.log("collectionMint =>", collectionMint.publicKey.toString());
}

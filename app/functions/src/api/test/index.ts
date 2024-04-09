import * as functions from "firebase-functions"
import * as fs from "fs"
import { Request, Response } from "express"
import {
  // Connection,
  Keypair,
  // LAMPORTS_PER_SOL,
  // PublicKey,
  // SystemProgram,
  // Transaction,
  // sendAndConfirmTransaction,
} from "@solana/web3.js"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
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

const testRequest = async (req: Request, res: Response) => {
  console.log("testRequest")

  const keypair = Keypair.fromSecretKey(
    bs58.decode(SECRET_KEY)
  );
  console.log("keypair", keypair)

  const endpoint = "https://api.devnet.solana.com";
  // const connection = new Connection(endpoint, "confirmed");

  // const lamportsToSend = 1_000_000; // 0.001 SOL

  // const key = "71D52uXqogQzWRvNJJkcr5U4x8eqwkXsSWD3aYsqR8jH";
  // const toPublickey = new PublicKey(key);
  // const transferTransaction = new Transaction().add(
  //   SystemProgram.transfer({
  //     fromPubkey: keypair.publicKey,
  //     toPubkey: toPublickey,
  //     lamports: lamportsToSend,
  //   })
  // );

  // const result = await sendAndConfirmTransaction(
  //   connection,
  //   transferTransaction,
  //   [keypair]
  // );
  // console.log("result", result)

  // Upload json to Arweave

  const Arweave = require("arweave");
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: false,
  });

  const params = {id: "Aj7J0cP81cNvlkl7VMcb"};
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
    name: "CHRO-PLUS 20240408 XHRO DATA",
    symbol: "CHROPLUS-TEST",
    description: "This is CHRO-PLUS 20240408 XHRO DATA",
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

  // Mint NFT
  const umi = createUmi(endpoint).use(mplTokenMetadata());
  const payerKeypair = umi.eddsa.createKeypairFromSecretKey(keypair.secretKey);
  umi.use(keypairIdentity(payerKeypair));

  const collectionUpdateAuthority = generateSigner(umi);
  const collectionMint = generateSigner(umi);
  await createNft(umi, {
    mint: collectionMint,
    authority: collectionUpdateAuthority,
    name: "CHRO-PLUS 20240408 XHRO DATA",
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

  res.status(200).end()
}

export { testRequest }

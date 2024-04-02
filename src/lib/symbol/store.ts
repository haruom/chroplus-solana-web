import symbolSdk from 'symbol-sdk';
import crypto from 'crypto';

export function hexToUint8(input: string) {
  return symbolSdk.utils.hexToUint8(input);
}

export async function store(dataStr: string) {
  const encryptResult = encrypt(dataStr);
  const aggregateTransactionHash = await createAggregateTransaction(encryptResult.encryptedDataStr);
  return ({ ...encryptResult, aggregateTransactionHash });

  // fallbackは必要そうだけど一旦しないでおく
  const decryptedData = await decrypt(encryptResult.keyStr, encryptResult.ivStr, encryptResult.encryptedDataStr);
  console.log(`dataStr === decryptedData: ${dataStr === decryptedData}`)
  // userId, date, transactionHash, keyStr, ivStr
}

const algorithm = 'aes-256-cbc';

function encrypt(dataStr: string) {
  const password = crypto.randomBytes(32).toString('hex');
  const salt = process.env.AUTH_SECRET as string;
  const key = crypto.scryptSync(password, salt, 32);

  const iv = crypto.randomFillSync(new Uint8Array(16));

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encryptedData = Buffer.concat([cipher.update(dataStr), cipher.final()]);

  const keyStr = key.toString('hex');
  const ivStr = Buffer.from(iv).toString('hex');
  const encryptedDataStr = encryptedData.toString('hex');
  return { keyStr, ivStr, encryptedDataStr }
}

export function decrypt(keyStr: string, ivStr: string, encryptedDataStr: string) {
  const key = Buffer.from(keyStr, 'hex');
  const iv = Uint8Array.from(Buffer.from(ivStr, 'hex'));
  const encryptedData = Buffer.from(encryptedDataStr, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  const decryptedJsonStr = new TextDecoder().decode(decryptedData);
  return decryptedJsonStr;
}

async function createAggregateTransaction(dataStr: string) {
  const NODE_URL = process.env.SYMBOL_NODE as string;
  const networkProperties = await (await fetch(`${NODE_URL}/network/properties`)).json();
  const epochAdjustment = BigInt(networkProperties.network.epochAdjustment.slice(0, -1)) * BigInt(1000);
  const currencyMosaicId = BigInt(networkProperties.chain.currencyMosaicId.replace(/'/g, ''));
  const networkType = networkProperties.network.identifier;
  const network = networkType === 'testnet' ? symbolSdk.symbol.Network.TESTNET : symbolSdk.symbol.Network.MAINNET;
  const facade = new symbolSdk.facade.SymbolFacade(networkType);
  const privateKey = new symbolSdk.PrivateKey(process.env.SYMBOL_PRIVATE_KEY as string);
  const keyPair = new symbolSdk.symbol.KeyPair(privateKey);
  const publicKey = keyPair.publicKey;
  const signerPublicKey = publicKey;
  const recipientAddress = network.publicKeyToAddress(publicKey);
  const deadline = BigInt(Date.now()) - epochAdjustment + BigInt(7200000);

  const textEncoder = new TextEncoder();
  const transactions = splitStrBy1KiB(dataStr).map(d => {
    const encoded = textEncoder.encode(d);
    const message = new Uint8Array(encoded.length + 1);
    message.set(new Uint8Array([0]), 0);
    message.set(encoded, 1);
    return facade.transactionFactory.createEmbedded({
      type: 'transfer_transaction_v1',
      signerPublicKey,
      recipientAddress,
      mosaics: [{ mosaicId: currencyMosaicId, amount: BigInt(1000000) }],
      message,
    })
  });
  const transactionsHash = symbolSdk.facade.SymbolFacade.hashEmbeddedTransactions(transactions);
  const transaction = facade.transactionFactory.create({
    type: 'aggregate_complete_transaction_v2',
    signerPublicKey,
    fee: BigInt('10000000'),
    deadline,
    transactions,
    transactionsHash,
  })
  const signature = facade.signTransaction(keyPair, transaction);
  const jsonPayload = (facade.transactionFactory.constructor as any).attachSignature(transaction, signature);
  const hash = facade.hashTransaction(transaction).toString();

  const putResponse = await (await fetch(`${NODE_URL}/transactions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonPayload,
  })).json();
  console.log(putResponse);

  console.time('put transaction');
  let count = 0;
  let statusResponse;
  while (count < 60) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    statusResponse = await (await fetch(`${NODE_URL}/transactionStatus/${hash}`)).json();

    const group = statusResponse.group;
    if (group !== 'unconfirmed') { break; }
    count++;
  }
  console.log(statusResponse);
  console.log(`count: ${count}`);
  console.timeEnd('put transaction');
  
  if (statusResponse.code === 'ResourceNotFound') {
    throw '睡眠データの保存に失敗した';
  }

  return hash;
}

function splitStrBy1KiB(str: string): string[] {
  const matchResult = str.match(/.{1023}/g);
  // 1023文字未満なので配列に包んで返すだけ
  if (!matchResult) { return [str]; }
  const arr = Array.from(matchResult);

  const rest = str.substring(arr.join('').length);
  return [...arr, ...(rest.length > 0 ? [rest] : [])]
}

"use client";
import { useState } from 'react';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import Image from "next/image";
import Link from "next/link";
import Quantity from "./quantity";
import GetAmount from "./amount";

const Page = () => {
  const [clickedCopy, setClickedCopy] = useState(false);
  const router = useRouter();
  const address = "CQzBVzHWbwkcUQ9Ey251bzPFLocXt27ZvjjTn9UfFMnR";
  const recipientAddress = new PublicKey("CQzBVzHWbwkcUQ9Ey251bzPFLocXt27ZvjjTn9UfFMnR");
  const connection = new Connection('https://api.devnet.solana.com');
  const amount = GetAmount(); // GetAmountから取得した金額をSOLとして使用
  const lamportsAmount = amount * 1000000000; // Convert SOL to lamports
  console.log('Amount:', amount);

  const getProvider = () => {
    if ('phantom' in window) {
      const phantom = window.phantom as any;
      if ('solana' in phantom) {
        return phantom.solana;
      }
    }
    window.open('https://phantom.app/', '_blank');
  };

  const sendTransaction = async () => {
    try {
      const provider = getProvider();
      const wallet = await provider.connect();
      const senderPublicKey = new PublicKey(wallet.publicKey.toString());
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipientAddress,
          // lamports: lamportsAmount, // ここで送金額を指定（1 SOL = 1000000000 lamports）
          lamports: 1000,
        })
      );

      transaction.feePayer = senderPublicKey;
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      const signed = await provider.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      alert('Transaction successful!');
      router.push('/lab/download');
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Transaction failed');
    }
  };

  return (
    <>
      <header className="bg-black relative lg:w-full">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex">
            <a href="/" className="">
              <Image
                className="relative dark:invert"
                src="/chro-plus_logo_wht.svg"
                alt="chro-plus Logo"
                width={90}
                height={22}
                priority
              />
            </a>
          </div>
          <div className="flex text-white">Lab.</div>
        </nav>
      </header>
      <h1 className="text-3xl text-center m-20 font-bold">Order</h1>
      <div className="m-30 mx-auto max-w-3xl">
        <section className="m-10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="m-3 font-bold">Quantity</h3>
              <div className="m-3">
                <Suspense>
                  <Quantity />
                </Suspense>
              </div>
            </div>
            <div>
              <h3 className="m-3 font-bold">Amount</h3>
              <div className="m-3 flex items-center">
                <span>{GetAmount()} SOL</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="m-3 font-bold">Remittance Address</h3>
            <div className="m-3">
              <div className="break-words">{address}</div>
              <button
                className="btn border border-blue-500 hover:border-blue-700 text-black font-bold py-2 px-4 rounded mt-4"
                onClick={() => sendTransaction()}
              >
                Send SOL
              </button>
            </div>
          </div>
        </section>
        <hr />
        {clickedCopy && (
          <div className="flex justify-center m-3">
            <Link href={{ pathname: '/lab/download' }}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Your NFT Collections
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fetchAllDigitalAssetByOwner } from '@metaplex-foundation/mpl-token-metadata';
import Image from "next/image";

const ENDPOINT = 'https://api.devnet.solana.com';

interface NFTData {
  publicKey: string; 
  name: string;
  uri: string;
}

export default function Home() {
  const [nfts, setNFTs] = useState<NFTData[]>([]);
  const router = useRouter();

  const getProvider = () => {
    if ('phantom' in window) {
      const phantom = window.phantom as any;
      if ('solana' in phantom) {
        return phantom.solana;
      }
    }
    window.open('https://phantom.app/', '_blank');
  };

  const connectWallet = async () => {
    try {
      const provider = getProvider();
      const wallet = await provider.connect();
      console.log('Wallet Public Key:', wallet.publicKey.toString());

      const umi = createUmi(ENDPOINT);
      const owner = publicKey(wallet.publicKey.toString());
      console.log('Owner Public Key:', owner.toString());

      const digitalAssets = await fetchAllDigitalAssetByOwner(umi, owner);
      console.log('Digital Assets:', digitalAssets);

      if (digitalAssets.length === 0) {
        console.log('このウォレットにはデジタルアセットがありません。');
      }

      const nftData = digitalAssets.map((asset) => ({
        publicKey: asset.publicKey.toString(),
        name: asset.metadata.name,
        uri: asset.metadata.uri
      }));

      setNFTs(nftData);

      // 接続が成功した場合、/lab/searchにリダイレクト
      router.push('/lab/search');
    } catch (error) {
      console.error('データの取得中にエラーが発生しました:', error);
    }
  };

  return (
    <>
      <header className="bg-black fixed lg:w-full">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex">
            <Image
              className="relative dark:invert"
              src="/chro-plus_logo_wht.svg"
              alt="chro-plus Logo"
              width={90}
              height={27}
              priority
            />
          </div>
          <div className="flex">items</div>
        </nav>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            DEMO version&nbsp;
            <code className="font-mono font-bold">0.2.3</code>
          </p>
        </div>

        <div className="relative flex place-items-center">
          <Image
            className="relative dark:invert"
            src="/chro-plus_logo_blk.svg"
            alt="chro-plus Logo"
            width={708}
            height={212}
            priority
          />
        </div>
        <div className="flex justify-center items-center h-screen/2">
          <button
            onClick={connectWallet}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Connect Wallet{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
          </button>
        </div>

        <div className="flex justify-center items-center">
          {nfts.map((nft) => (
            <div key={nft.publicKey}>
              <h3>{nft.name}</h3>
              <img src={nft.uri} alt={nft.name} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

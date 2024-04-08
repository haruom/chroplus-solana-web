"use client";

import React, { useEffect, useState } from 'react';
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

const Page = () => {
  const [nfts, setNFTs] = useState<NFTData[]>([]);
  const [csvUrl, setCsvUrl] = useState('');

  const getProvider = () => {
    if ('phantom' in window) {
      const phantom = window.phantom as any;
      if ('solana' in phantom) {
        return phantom.solana;
      }
    }
  
    window.open('https://phantom.app/', '_blank');
  };

  const downloadCSV = async (url: string) => {
    try {
      const response = await fetch(`/api/csv?url=${url}`);
      if (!response.ok) {
        throw new Error('Data fetching failed');
      }
      const jsonData = await response.json();
      console.log(jsonData.csvUrl);
      const link = document.createElement("a");
      link.href = jsonData.csvUrl;
      link.click();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    async function fetchMyOwnedNFTs() {
      try {
        const provider = getProvider(); // see "Detecting the Provider"
        const wallet = await provider.connect();
        console.log(wallet.publicKey.toString());

        const umi = createUmi(ENDPOINT);
        const owner = publicKey(wallet.publicKey.toString());
        const digitalAssets = await fetchAllDigitalAssetByOwner(umi, owner);
        console.log(digitalAssets);

        const nftData = digitalAssets.map((asset) => ({
          publicKey: asset.publicKey,
          name: asset.metadata.name,
          uri: asset.metadata.uri
        }));

        setNFTs(nftData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchMyOwnedNFTs();
  }, []);

  return <>
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
     <section className="CONTENTS_WRAP m-30 mx-auto max-w-3xl">
     <h1 className="text-3xl text-center m-20 font-bold">Collections</h1>
        <h3 className="mt-10 m-5 font-bold">Your NFT Collections to download XHRO Data</h3>
        <hr/>
        <div className="C-data-list">
          {nfts.map((nft, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between m-5">
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center basis-4/12">
                        <div>
                          <Image
                              className="relative"
                              src="/ic_97897ha7f34.png"
                              alt="ic_97897ha7f34"
                              width={36}
                              height={36}
                              priority
                            />
                          </div>
                        <div className="pl-4">
                          <div><a href="" target="_blank" rel="no-openner" className="underline decoration-solid">{`0x298f8a73t5f...`}</a></div>
                          <div className="text-xs">{`YYYY.MM.DD 00:00:00`}</div>
                        </div>
                      </div>
                      <div className="text-left basis-6/12">
                        <span className="">{nft.name}</span>
                      </div>
                      <button className='basis-2/12 btn border border-blue-500 hover:border-blue-700 text-black font-bold py-2 px-4 rounded' onClick={() => downloadCSV(nft.uri)}>Download</button>
                    </div>
                  </div>
              </div>
              <hr />
            </React.Fragment>
          ))}
        </div>
        <hr/>
      </section>
  </>
};

export default Page;

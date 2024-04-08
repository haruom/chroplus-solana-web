"use client";

import React, { useEffect, useState } from 'react';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fetchAllDigitalAssetByOwner } from '@metaplex-foundation/mpl-token-metadata';

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
     <section className="CONTENTS_WRAP m-30 mx-auto max-w-3xl">
        <h3 className="mt-10 m-5 font-bold">Your NFT Collections to download XHRO Data</h3>
        <hr/>
        <div className="C-data-list">
          {nfts.map((nft, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between m-5">
                <span className="basis-7/12 flex justify-between">
                  <details className="w-full">
                    <summary className="flex justify-between">
                      <span className="basis-5/6">{nft.name}</span>
                      <button className='btn border border-blue-500 hover:border-blue-700 text-black font-bold py-2 px-4 rounded' onClick={() => downloadCSV(nft.uri)}>Download</button>
                    </summary>
                  </details>
                </span>
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

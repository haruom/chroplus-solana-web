'use client'
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";

interface RewardData {
  id: string;
  createdAt: Date;
  price: number;
  seconds: number;
  uid: string;
}

const defaultDataDetails = [
  { name: 'EEG', size: '330MB' },
  { name: 'ECG', size: '330MB' },
  { name: 'PPG', size: '132MB' },
  { name: 'Body temperature', size: '0.66MB' },
];

const Page = () => {
  const [data, setData] = useState<RewardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data'); // Make sure this points to your actual API endpoint
        if (!response.ok) {
          throw new Error('Data fetching failed');
        }
        const jsonData = await response.json();
        setData(jsonData); // Update your state with the fetched data

        // Calculate the total using jsonData directly
        const total = jsonData.reduce((sum: number, record: RewardData) => sum + parseFloat(record.price.toString()), 0);
        setTotalBalance(total);
        console.log(total);
      } catch (error) {
        // Assuming you're using TypeScript and error handling is properly set up
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    }

    fetchData();

  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

    return (<>
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
          <div className="flex text-white">User.</div>
        </nav>
      </header>

      <h1 className="text-3xl text-center m-20 font-bold">My data</h1>

      <section className="CONTENTS_WRAP m-30 mx-auto max-w-3xl">
        <h3 className="mt-10 m-5 font-bold">"XHRO" Measurement data </h3>
        <hr/>
        <div className="C-data-list">
          {data.map((record, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between m-5">
                <span className="basis-3/12">{new Date(record.createdAt).toLocaleDateString("ja-JP")}</span>
                <span className="basis-7/12 flex justify-between">
                  <details className="w-full">
                    <summary className="flex justify-between">
                      <span className="basis-4/6">▼ {defaultDataDetails.length} types of data</span>
                      <span className="basis-2/6">{
                      `${Math.floor(record.seconds / 3600)}h ${Math.floor((record.seconds % 3600) / 60)}m`}
                      </span>
                    </summary>
                    {defaultDataDetails.map((detail, detailIndex) => (
                      <span key={detailIndex} className="flex justify-between mt-3">
                        <span className="basis-4/6">- {detail.name}</span>
                        <span className="basis-2/6">{detail.size}</span>
                      </span>
                    ))}
                  </details>
                </span>
                <span className="basis-2/12 text-right">{record.price.toFixed(5)}SOL</span>
              </div>
              <hr />
            </React.Fragment>
          ))}
        </div>
        <hr/>
      </section>
      <section className="CONTENTS_WRAP mt-20 mx-auto max-w-3xl pb-20">
        <div className="flex justify-between font-bold p-5 bg-slate-400">
          <h3 className="font-bold">Total Rewards Earned</h3>
          <div className="text-center">{`Balance: ${totalBalance.toFixed(8)} SOL`}</div>
            {/* <Token records={records} earnSum={earnSum} withdrawSum={withdrawSum} /> */}
        </div>
      </section>

    </>);
}


export default Page;
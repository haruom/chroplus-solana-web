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
  const [dataAmount, setDataAmount] = useState<number[]>([]);
  const [dataDetails, setDataDetails] = useState<{ name: string; size: string }[][]>([[]]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);

  const NUMAMOUNTFIX= 2;
  const NUMSOLFIX = 3; 

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data'); // Make sure this points to your actual API endpoint
        if (!response.ok) {
          throw new Error('Data fetching failed');
        }
        var jsonData = await response.json();
        const uniqueData = jsonData.filter((value: RewardData, index: number, self: RewardData[]) => {
          // Create a unique key for each combination of 'seconds' and 'createdAt'
          const uniqueKey = `${value.seconds}-${value.createdAt}`;
          // Check if the current index is the first occurrence of this unique key
          return self.findIndex((item: RewardData) => `${item.seconds}-${item.createdAt}` === uniqueKey) === index;
        });

        // Now, sort by 'createdAt' in descending order
        uniqueData.sort((a: RewardData, b: RewardData) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        // Update jsonData or set your state with the filtered and sorted data
        jsonData = uniqueData;



        setData(jsonData); 


        var totalSOL = 0
        var dataAmoutArray = []
        var dataDetails = [[{ name: '', size: ''}, { name: '', size: ''}, { name: '', size: ''}, { name: '', size: ''}]]
        for (let i = 0; i < jsonData.length; i++) {
          // EEG: 0.25MB/min
          // ECG: 0.25MB/min
          // PPG: 0.10MB/min
          // Body Temperature: 0.0005MB/min
          // totalSOL += (0.25 + 0.25 + 0.10 + 0.0005) * jsonData[i].sectonds / 60\
          const amount = 0.60005 * jsonData[i].seconds / 60 /1024
          totalSOL += amount
          dataAmoutArray.push(amount)
          const dataDetail = [
            { name: 'EEG', size: (jsonData[i].seconds * 0.25 / 60).toFixed(NUMAMOUNTFIX) + 'MB' },
            { name: 'ECG', size: (jsonData[i].seconds * 0.25 / 60).toFixed(NUMAMOUNTFIX) + 'MB' },
            { name: 'PPG', size: (jsonData[i].seconds * 0.10 / 60).toFixed(NUMAMOUNTFIX) + 'MB' },
            { name: 'Body temperature', size: (jsonData[i].seconds * 0.0005 / 60).toFixed(NUMAMOUNTFIX) + 'MB'},
          ]
          dataDetails.push(dataDetail)
        }
        setDataAmount(dataAmoutArray)
        setTotalBalance(totalSOL);
        setDataDetails(dataDetails);

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
                    {dataDetails[index+1].map((detail, detailIndex) => (
                      <span key={detailIndex} className="flex justify-between mt-3">
                        <span className="basis-4/6">- {detail.name}</span>
                        <span className="basis-2/6">{detail.size}</span>
                      </span>
                    ))}
                  </details>
                </span>
                <span className="basis-2/12 text-right">{dataAmount[index].toFixed(NUMSOLFIX)}SOL</span>
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
          <div className="text-center">{`Balance: ${totalBalance.toFixed(NUMSOLFIX)} SOL`}</div>
            {/* <Token records={records} earnSum={earnSum} withdrawSum={withdrawSum} /> */}
        </div>
      </section>

    </>);
}


export default Page;
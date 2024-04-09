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


const Page = () => {
    const [showResult, setShowResult] = useState(false);
    const oneweek = new Date(new Date().getTime() - (24 * 60 * 60 * 7000)).toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(oneweek);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [days, setDays] = useState(0);
    const [amount, setAmount] = useState(0);
    const [aleart, setAleart] = useState('');
    const [data, setData] = useState<RewardData[]>([]);
    const [dataAmount, setDataAmount] = useState<number[]>([]);
    const [dataDetails, setDataDetails] = useState<{ name: string; size: string }[][]>([[]]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalBalance, setTotalBalance] = useState(0);
    const [numCheck, setNumCheck] = useState(0);
    const [numChkeckDate, setNumCheckDate] = useState(0);
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
            return self.findIndex((item: RewardData) => `${item.seconds}-${item.createdAt}` === uniqueKey) === index;
          });
          uniqueData.sort((a: RewardData, b: RewardData) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
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
          setError(error instanceof Error ? error.message : String(error));
        } finally {
          setLoading(false);
        }
      }
  
      fetchData();
  
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleSearchClick = () => {
      // count how many checkboxes are checked
      const checkedItems = document.querySelectorAll('input[name="data-items"]:checked');
      setNumCheck(checkedItems.length);
      // show reward data with checked items
      const checkedItemsArray = Array.from(checkedItems);
      const checkedItemsValue = checkedItemsArray.map((item) => item.getAttribute('value'));
      const checkedData = data.filter((record) => checkedItemsValue.includes(record.id));
      console.log(checkedData);
      const uniqueDatesSet = new Set(checkedData.map(item => item.createdAt));
      const uniqueDatesCount = uniqueDatesSet.size;
      setNumCheckDate(uniqueDatesCount);
      setShowResult(true);
    };

    const checkDate = (startDate: string, endDate: string) => {
      if (startDate === '' || endDate === '') {
        return { result: false, message: 'input date' };
      }
      if (new Date(startDate) > new Date(endDate)) {
        return { result: false, message: 'Please enter a date after the start date for the end date.' };
      }
      const today = new Date().toISOString().split('T')[0];
      if (new Date(startDate) > new Date(today)) {
        return { result: false, message: 'Please enter a date before today for the start date.' };
      }
      if (new Date(endDate) > new Date(today)) {
        return { result: false, message: 'Please enter a date before today for the end date.' };
      }
      return { result: true, message: '' };
    }
    
    const calculateDaysBetweenAndAmount = () => {
      const difference = new Date(endDate).getTime() - new Date(startDate).getTime();
      const calculatedDays = difference / (1000 * 3600 * 24); 
      setDays(calculatedDays);
      
      const calculatedAmount = calculatedDays * 1000;
      setAmount(calculatedAmount);
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
      <h1 className="text-3xl text-center m-20 font-bold">Search</h1>

      <section className="CONTENTS_WRAP m-30 mx-auto max-w-3xl">
        <h3 className="mt-10 m-5 font-bold">"XHRO" User data list</h3>
        <hr/>
        <div className="C-data-list">
          <div className="flex justify-between font-bold m-5">
            <span className="basis-3/12">Date</span>
            <span className="basis-7/12 flex justify-between">
              <span className="basis-4/6">Data Info</span>
              <span className="basis-2/6">Amount</span>
            </span>
            <span className="basis-2/12 text-right">Cost</span>
          </div>
          <fieldset>
            {data.map((record, index) => (
              <React.Fragment key={index}>
                <div> {/* Add a div as the parent element */}
                  <hr/>
                  <label htmlFor={record.id}>
                    <div className="flex justify-between m-5">
                      <input type="checkbox" id={record.id} name="data-items" value={record.id}/>
                      <span className="basis-3/12 pl-3">{new Date(record.createdAt).toLocaleDateString("ja-JP")}</span>
                      <span className="basis-7/12 flex justify-between">
                        <details className="w-full">
                          <summary className="flex justify-between">
                            <span className="basis-4/6">▼ {dataDetails[index].length} types of data</span>
                            <span className="basis-2/6">{`${Math.floor(record.seconds / 3600)}h ${Math.floor((record.seconds % 3600) / 60)}m`}</span>
                          </summary>
                          {dataDetails[index+1].map((detail, detailIndex) => (
                            <span key={detailIndex} className="flex justify-between mt-3">
                              <span className="basis-4/6">- {detail.name}</span>
                              <span className="basis-2/6">{detail.size}</span>
                            </span>
                          ))}
                        </details>
                      </span>
                      <span className="basis-2/12 text-right">{dataAmount[index].toFixed(NUMSOLFIX)} SOL</span>
                    </div>
                  </label>
                </div> {/* Close the div */}
              </React.Fragment>
            ))}
          </fieldset>
        </div>
      <hr/>
      </section>


      <div className="flex justify-center m-3">
        {aleart && <p className="text-red-500">{aleart}</p>}
      </div>
      <div className="flex justify-center m-3">
        <button onClick={handleSearchClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Estimate</button>
      </div>

      {showResult && (
        <>
          <p className="text-center m-3">result</p>
          <div className="flex justify-center m-3">
            <table className="table-auto border-separate">
              <thead>
                <tr>
                  <th className="border px-4 py-2">number of data</th>
                  <th className="border px-4 py-2">cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 text-center">{numChkeckDate}</td>
                  <td className="border px-4 py-2 text-center">{numCheck}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center m-3">
            <Link  href={{pathname: '/lab/order', query: { startDate:startDate, endDate:endDate, amount:amount}}} >
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Pay</button>
            </Link>
          </div>
        </>
      )}


      <section className="pt-10 pb-10 m-30 mx-auto max-w-3xl">
        <hr/>
        <div className="flex justify-center pt-10">
          <Link  href={{pathname: '/lab/download'}} >
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Your NFT Collections</button>
          </Link>
        </div>
      </section>
    </>
  );
}


export default Page;